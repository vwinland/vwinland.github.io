---
title: "Build Log: Ask My Archive"
description: "I built a retrieval-augmented Q&A tool over my own published essays. This is the log of building it — the actual decisions, in order, with real numbers and real code."
date: "2026-08-08"
tags:
  - AI
  - RAG
  - Python
  - Software Engineering
slug: "build-log-ask-my-archive"
image: "/projects/header_image.png"
---

[I built a RAG tool over my own writing](https://github.com/vwinland/ask-my-archive). Here's what I learned.

I've spent the last several months writing about agentic AI, multi-agent coordination, governance. All from the outside. Research, reading, synthesis. Real work, but not the same as building the thing.

So I built something. A retrieval-augmented Q&A tool over my own published essays. Ask it a question, it retrieves the relevant excerpts from my blog, HackerNoon, IBM Think, wherever, and answers grounded in what I actually wrote, with citations back to the source.

This is the log of building it. Not a polished retrospective. The actual decisions, in the order I had to make them, with the real numbers and the real code.

## The corpus was messier than I expected

I assumed inventorying my own writing would be the easy part. It wasn't.

My blog is canonical. Sixteen posts. But most of them are syndicated to HackerNoon under a different title. HackerNoon editors review and often retitle to match their guidelines and optimize for search engines. "Romanticism Has a New Villain" on my blog is "A24's AI Backlash Is an Old Creative Argument in New Clothes" on HackerNoon. Same essay. Different string entirely.

If I'd naively indexed both platforms, I'd have had near-duplicate chunks competing against each other in retrieval, under titles that don't obviously match. So one post gets treated as canonical, and every other platform it lives on gets stored as metadata on that same entry, not as a separate document.

The blog/HackerNoon problem was the trickiest case, but it's one piece of a bigger picture. My writing actually lives across four different sources, each with a different relationship to syndication:

- **My personal blog** — the canonical source for 16 essays, most of them also syndicated to HackerNoon (title changes) or Medium (title stays the same)
- **IBM Think** — 27 pieces (explainers, tutorials, one insights piece) that are native to that platform, no syndication involved
- **The IBM tutorials GitHub repo** — markdown and notebook source files for a subset of those IBM Think tutorials, useful because the repo's markdown is cleaner to parse than scraping the live page
- **Medium** — home to two personal essays, syndicated from the blog, separate from the HackerNoon-syndicated technical pieces

That's why the schema has a `primary_platform` field with more than two options, and why `platform_urls` is a dict rather than two hardcoded fields. Here's the actual schema:

```python
@dataclass
class SourceDocument:
    canonical_title: str
    primary_platform: str  # "blog" | "ibm_think" | "ibmdotcom_tutorials"
    content_type: str  # "essay" | "personal_essay" | "explainer" | "tutorial"
    published_date: str
    body: str

    syndicated_titles: dict = field(default_factory=dict)
    platform_urls: dict = field(default_factory=dict)
    series: str | None = None
    co_authors: list[str] = field(default_factory=list)
```

One document, one `platform_urls` dict holding every place it lives. `syndicated_titles` holds the HackerNoon and Medium titles alongside the canonical one, so a title mismatch never gets mistaken for a different essay. A blog post ends up with two or three entries in that dict; an IBM Think piece, with no syndication, ends up with just the one.

I pulled the actual title mapping from my own HackerNoon stats export rather than guessing from search snippets, then verified every URL against the live page's HTML directly, since HackerNoon sometimes appends a hash suffix that a slugified guess won't predict. Slower than assuming a pattern. Also correct, which assuming a pattern was not.

Two of the sixteen posts are personal essays rather than technical ones, and get tagged differently (`content_type: "personal_essay"`) so a query about my technical writing doesn't accidentally surface something personal, or vice versa.

## Chunking: start simple, notice what breaks

I chunked by paragraph. The simplest strategy available. A one-sentence paragraph becomes a weak, low-context chunk on its own, so anything under 200 characters gets merged into its neighbor before it's stored:

```python
def merge_short_paragraphs(paragraphs: list[str]) -> list[str]:
    merged = []
    buffer = ""
    for p in paragraphs:
        buffer = f"{buffer}\n\n{p}".strip() if buffer else p
        if len(buffer) >= MIN_CHUNK_CHARS:
            merged.append(buffer)
            buffer = ""
    if buffer:
        if merged:
            merged[-1] = f"{merged[-1]}\n\n{buffer}"
        else:
            merged.append(buffer)
    return merged
```

Sixteen posts became 392 chunks. Averaging roughly 24 chunks per post, though that varies a lot by how long the piece is and how choppy my paragraphing is in any given essay.

I didn't reach for a fancier chunking strategy up front, like splitting by semantic similarity or a fixed token count. The plan was get the whole loop working end to end first, then go back and tune. Optimizing chunk size before I'd even confirmed retrieval worked at all would have been solving a problem I hadn't verified I had.

## What "embedding" actually means here, concretely

A quick grounding note, since this term does a lot of work in RAG systems and I want to actually understand it, not just use it.

An embedding is a list of numbers that represents the meaning of a piece of text. Two chunks about similar ideas end up with similar number-lists, even if they don't share any of the same words. That's what makes "search by meaning" possible instead of just keyword matching.

I used `all-MiniLM-L6-v2`, a small model that runs locally and turns each chunk into a list of 384 numbers. When I ask a question, the question gets turned into a list of 384 numbers the same way, and the system finds which stored chunks have the closest numbers to the question's numbers. That's retrieval. Nothing more mysterious than a distance calculation, run 392 times, sorted, and the closest few returned.

## Local embeddings, on purpose

My corpus is roughly forty documents once every source is in. A hosted embedding API is built for a scale I don't need. It adds an API key dependency and a per-call cost for zero real benefit at this size.

`all-MiniLM-L6-v2` runs locally and free. One-time download (about 90MB), then it just works, no per-query cost, no network dependency after that.

To say it plainly: the fanciest available option is not automatically the right one. Match the infrastructure to the actual scale of the problem, not to what everyone defaults to.

## No distance-based relevance cutoff, on purpose

When retrieval comes back with nothing genuinely relevant, does the system filter out the weak matches before they reach the model, or hand the model everything and trust it to say so itself?

I went with the second option. At forty documents I have no labeled relevance set to calibrate a distance threshold against. A hardcoded cutoff would be a guess dressed up as a number. An explicit instruction in the prompt instead: tell me if you can't answer this from what you're given. That's a legible, testable failure mode instead of an arbitrary one.

That decision got tested directly, and it held.

## The test that actually mattered

I ran three questions against the finished pipeline, through two different models: Claude, and a free local model (Llama 3.1) running through Ollama on my own laptop, no API key, no cost.

| Question | Ollama result | Claude result |
|---|---|---|
| Well-covered: "What has Vanna written about how AI changes code review?" | Correct answer, 1 source cited | Correct answer, 3 sources cited, quoted source text directly |
| Near-miss: "What does Vanna think about quantum computing?" | Correctly declined, 0 sources cited | Correctly declined, 0 sources cited, named what the excerpts *did* cover first |
| Cross-essay synthesis: "How does Vanna connect agentic coordination to platform governance?" | Correct synthesis, 2 sources cited | Correct synthesis, 3 sources cited |

The near-miss row is the one that matters. A RAG system that confidently invents an answer when it doesn't have one is worse than a system that does nothing. That failure mode is the actual risk in a tool like this, and it's silent until you go looking for it.

Both models declined correctly. Neither fabricated a connection to quantum computing. Both hit 100% compliance on the citation format I'd asked for in the prompt, which genuinely surprised me for a 4.9GB local model with no fine-tuning and no few-shot examples.

Where they differed was depth, not correctness. Claude's answers quoted my own source text back to me, and at one point flagged my own hedging: it noticed a line where I'd written that "the tooling is ahead of the measurement," and used that against my own overconfidence, which is a very funny thing for a tool built from my own writing to do to me. Claude also pulled in one extra relevant essay on the synthesis question, one that Ollama's retrieval had also surfaced but didn't weave into its answer. Ollama's answers were shorter, correct, more bullet-summary than argument.

Running all three questions through Claude's API cost nine cents.

The honest takeaway is not "local models are just as good." It's narrower and more useful than that: on this specific task, at this scale, the failure mode that actually threatens trust in a RAG tool didn't discriminate between a frontier model and a free one running on my own machine. The gap was in richness of the answer, not in whether I could trust it.

## Where this leaves me

Sixteen blog posts fully indexed, syndication metadata verified and attached, retrieval and generation proven end to end on a real corpus, tested against the one failure mode that actually matters. Twenty-seven IBM Think pieces and a tutorials repo still to add. A chat interface still to build.

More than that, though: I have a real, tested answer to a question I'd only argued about from the outside before this. Does a free local model hold up against a frontier one, for a task like this, at this scale? Yes, on the thing that actually matters. That's a different kind of knowing than reading about it.
