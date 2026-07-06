---
title: "Code Review Cannot Scale to the AI Era"
description: "AI increased pull request volume faster than reviewer capacity, and confidence at review time is drifting away from the structural risks that actually accumulate."
date: "2026-07-06"
tags:
  - AI
  - Code Review
  - Governance
  - Software Engineering
slug: "code-review-cannot-scale-to-the-ai-era"
series: "The Industrialization of Software Engineering"
series_order: 8
series_total: 15
series_thesis: "how AI is restructuring software development from a craft discipline into an industrial production system"
series_prev_slug: "vibe-coding-has-a-governance-problem"
series_prev_title: "Vibe Coding Has a Governance Problem"
image: "/projects/markus-winkler-afW1hht0NSs-unsplash.jpg"
image_credit: "Photo by [Markus Winkler](https://unsplash.com/@markuswinkler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/magnifying-glass-on-white-table-afW1hht0NSs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

# Code Review Cannot Scale to the AI Era

Open two pull requests side by side. One was written by a person who’s owned this module for three years. The other was written by an agent that has never seen this codebase before today. Strip the author field and the timestamps. Look only at the diff. 

Increasingly, the distinction may matter less than it used to, to the reviewer approving them as much as to anyone else. 

That’s not a failure of the reviewer. It’s a failure of the unit of measurement. Code review was built to evaluate diffs, on the assumption that a diff carries enough signal to judge the work behind it. That assumption held for as long as the volume of diffs stayed roughly proportional to the number of people who’d thought carefully about each one. It doesn’t hold anymore, and the place that shows up first isn’t in the code. It’s in how confident reviewers feel while reading it.

Let’s be precise about what kind of failure this is. Code review was built to catch correctness, readability, maintainability, the obvious bug a second set of eyes spots fast. It was never designed to detect architectural duplication, system-wide coupling, cross-service redundancy, or technical debt accumulating quietly across many independent changes. That mismatch predates AI; a sufficiently distracted or rushed human reviewer could miss those things too. What’s new is the volume and confidence now flowing through exactly the side of the ledger review was never built to police. The argument that follows isn’t that code review broke. It’s that code review is being asked to measure something it was never designed to measure. 

# What Changed

Code review used to be a conversation between two people who had each written code before. A reviewer brought pattern-matching built from years of being burned by their own bugs. The pace was slow because the supply of code was slow: one engineer, one ticket, one diff, roughly bounded by how fast a person can type and think. 

That bound is gone. GitHub’s own 2025 Octoverse report shows developers [merging 43.2 million pull requests on average each month, up 23 percent year over year](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/). The constraint was never really “can a human review this diff.” It was “can the supply of diffs stay within a few multiples of what a team of humans can read.” AI removed that ceiling on one side of the equation and left it untouched on the other. 

# The Scale Is Already Concrete

This isn’t a forecast. CodeRabbit alone has reviewed [over 13 million pull requests across more than 2 million connected repositories](https://dev.to/rahulxsingh/the-state-of-ai-code-review-in-2026-trends-tools-and-whats-next-2gfh). Opsera’s 2026 benchmark, drawn from more than 250,000 developers across 60-plus enterprises, found AI-assisted teams [cut time-to-PR by up to 58 percent](https://opsera.ai/resources/report/ai-coding-impact-2026-benchmark-report/). Faros AI’s telemetry, drawn from 22,000 developers across more than 4,000 teams, found AI-heavy periods correlate with [98 percent more pull requests and PRs that are 154 percent larger](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways) than their pre-AI baseline, (whoa\!). Generation has scaled far faster than organizations’ ability to review what it produces. 

# The Three Pressure Points

The bottleneck isn’t one problem, it’s three compounding ones.

**Volume outpaces attention.** More PRs, larger PRs, same number of human reviewer-hours in a day. Opsera also found that despite PRs being created up to 58 percent faster, [AI-generated PRs wait 4.6 times longer to even get picked up for review](https://opsera.ai/resources/report/ai-coding-impact-2026-benchmark-report/). The queue isn’t slower because reviewers got worse. It’s slower because the input rate doubled and the output rate didn’t. 

**Issue density is higher in AI-authored PRs.** CodeRabbit’s own “State of AI vs Human Code Generation’ report, an analysis of 470 open-source pull requests, found AI-coauthored PRs [carry roughly 1.7 times more issues overall than human-only PRS, 10.83 issues per PR versus 6.45](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report), and the breakdown is sharper than the headline number suggests: logic and correctness errors were 75 percent more common, security vulnerabilities up to 2.74 times higher, error-handling gaps nearly twice as frequent. GitHub’s own data points the same direction: [Broken Access Control overtook Injection as GitHub’s most common CodeQL alert in 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/), flagged in more than 151,000 repositories, up 172 percent year over year, which GitHub engineers attribute in large part to AI-generated scaffolds that skip critical authentication checks. One vendor’s structured study plus a platform-wide signal consistent with the same direction: more code arriving, and a higher fraction of it showing trouble in the categories that matter most. 

**Trust calibration is inconsistent and mostly informal.** Developers don’t treat AI review comments as authoritative. Research on agentic coding pull requests on GitHub, citing a 2024 study of how engineers responded to ChatGPT-generated review feedback, [found suggestions were met with skepticism or disagreement close to a third of the time](https://arxiv.org/html/2509.14745v3), and even then, mostly through ad hoc judgment rather than any team-wide standard for when to trust the machine and when not to. 

None of these three is fatal on its own. Together, they describe a system absorbing more load, with less margin, and no shared protocol for where to apply scrutiny. 

# The Comfortable Assumption

Here’s where the obvious response lives, and it’s not a bad one: deploy AI to review the AI. If agents can generate code faster than humans can read it, use agents to read it too. CodeRabbit, GitHub’s own review agents, Greptile, Qodo, Cursor’s BugBot. The market has answered this exact problem at scale, at the volume already cited above, and a Graphite case study, co-published with Anthropic, reported a [feedback loop that used to take an hour now takes ninety seconds, with two-thirds of suggested changes actually implemented](https://claude.com/customers/graphite). Anthropic’s own internal numbers tell a similar story: before deploying its own multi-agent review system on internal pull requests, [only 16 percent got substantive review comments; after, 54 percent did](https://claude.com/blog/code-review), against a backdrop of roughly 200 percent year-over-year growth in code output per engineer. 

Taken at face value, that’s the bottleneck solved. Review got faster, coverage went up, the tools are everywhere, everyone’s happy. This is the version of the story that’s getting told in most boardrooms right now, and on the adoption numbers, it’s a reasonable one to believe.

# The Inversion

A January 2026 study, [“More Code, Less Reuse,”](https://arxiv.org/pdf/2601.21276)  looked underneath that story and found something uncomfortable: agent-generated code introduces more redundancy and more accumulated technical debt per change than human-written code. And reviewers, per the same research, feel better about approving it. 

Sit with that pairing for a second, because it’s not two unrelated facts. The paper argues these observations may stem from a common mechanism: models trained with reinforcement learning from human feedback are optimized to maximize perceived helpfulness, not necessarily code quality or truthfulness. That’s the authors’ proposed explanation, not an experimentally confirmed cause, but it’s a plausible account for why the output that results is built to look agreeable on inspection rather than engineered to minimize structural risk. The researchers go further: reviewers in their dataset actually expressed *fewer* negative emotions toward agent-authored PRs than human-authored ones, despite the agent PRs carrying more reuse and redundancy problems. That’s a reviewer’s blind spot operating exactly where you’d least expect it, lower vigilance toward the code most likely to need scrutiny. 

AI-generated code tends to be locally clean: consistent formatting, sensible naming, no obvious smell at the diff level. A human reviewer scanning for the kinds of problems they’re trained to catch, sloppy logic, inconsistent style, obvious shortcuts, finds less of it. The signal a reviewer has historically used as a proxy for “this is probably fine” (it looks careful) is firing positive on code that is, structurally, accumulating debt the diff view can’t show: duplicated logic across files, abstractions reinvented instead of reused, dependencies pulled in redundantly. The code that’s hardest to evaluate at the PR level is exactly the code that’s now triggering the most confidence. 

This is the part that should reframe how the review-agent numbers above get read. Faster merge times and fewer flagged defects are real, measured outcomes. But “fewer flagged defects” describes what the review process catches, not what’s actually in the codebase. If the failure mode is structural debt that doesn’t look like a defect at the point of review, a faster, more confident review process can clear more of it through, not less. 

The telemetry backs this up at the org level, not just the PR level. Faros AI’s two-year dataset, tracking the same 22,000 developers and 4,000+ teams across periods of low and high AI adoption, found [pull requests merging with zero review, human or agentic, up 31.3 percent](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways) during high-adoption periods. That’s not a deliberate policy decision anywhere. It’s what happens when reviewer capacity stays flat while the volume in front of it does not, and confidence in what’s arriving quietly rises at the same time capacity is most strained. The contrast with self-reported data is notable, though the two aren’t measuring the same organizations. DORA’s 2025 State of AI-Assisted Software Development report, drawing on its long-running survey research, found that [higher AI adoption is associated with an increase in both software delivery throughput and software delivery instability at the same time](https://dora.dev/insights/balancing-ai-tensions/), describing AI’s primary role as an amplifier rather than a uniform improvement. Faros’s telemetry shows review behavior changing materially during periods of high AI adoption. Taken together, they suggest self-reported and observed measures are converging on the same underlying picture, more speed paired with more strain, even though the studies aren’t measuring identical organizations. 

# Where the Value Actually Went

The honest reframe isn’t “AI code review tools don’t work” or “go back to manual review.” Both review agents and the underlying generation models are doing real work, faster merges and genuinely fewer surface-level defects are not illusions. What changed is what review confidence is actually evidence of. It used to be a reasonable proxy for code quality, because the things a fast human scan could catch correlated fairly well with the things that caused problems later. That correlation is weakening. 

That mismatch, between what review catches and what actually causes long-term damage, isn’t new, as the opening of this piece laid out. A class of defects that traditional review is poorly suited to detect increasingly live one layer below where a diff-level scan, human or AI, naturally looks: in duplication across the codebase, in architectural choices made independently by agents that don’t share context, in dependency graphs no reviewer is likely to inspect in a single PR. 

Call this **review-confidence drift**: the gap between how sure a review process feels and how much risk it’s actually screening for, widening as the thing being reviewed gets cleaner-looking at the surface and messier underneath. It’s a more specific claim than “be careful with AI code,” and a more useful one, because it points at where the next layer of tooling actually needs to live: not faster PR-level review, but structural visibility that PR review was never designed to provide. 

# What Isn’t Working Yet

To be fully honest about the limits of this argument: most of the structural-debt evidence is early. “More Code, Less Reuse” is one study, not a consensus, and replication across more codebases and longer time horizons would meaningfully change how much weight it deserves. The RLHF-driven explanation for the inversion is the authors’ proposed mechanism. More an interpretation rather than established fact. The defect-rate figures traced to CodeRabbit’s published report and the comfortable-assumption numbers are traced to Anthropic’s own blog post about its own product, but both are vendors selling AI review with a direct stake in the result, so those numbers deserve the same scrutiny as any benchmark published by a company measuring its own tool. The review-agent tools criticized implicitly in this piece, CodeRabbit, Copilot Review, Claude Code Review, are also the most plausible path to eventually closing the gap they’re currently obscuring; dismissing them wholesale would be its own kind of overcorrection. The honest position is that the tooling is ahead of the measurement, in both directions. Anyone making confident claims about AI code review right now, this essay included, is working with less certainty than the tone of the debate suggests. 

# What to Do With This Now

1. **Stop treating “review agent approved it” as a quality signal equivalent to human sign-off.** Use it as a triage filter, not a final gate, especially on code that touches shared modules or gets reused across services.   
2. **Instrument for duplication and structural drift directly, not just defect counts.** A review process measuring “bugs caught” is blind to the failure mode described here by design.   
3. **Set an explicit policy for zero-review merges, and audit against it quarterly.** If your org doesn’t know its current zero-review merge rate, that’s the first number to get, before adding another review tool.   
4. **Reserve human reviewer attention for architectural and cross-cutting changes, not line-level scanning.** That’s where the AI review agents are weakest and where structural debt actually accumulates.   
5. **Treat review-agent vendor metrics (merge time, defect-flag rate) as marketing claims until validated against your own production incident data,** not as proof the bottleneck is solved. 

Code review was built for a world where the supply of code was bounded by how fast a person could write it. That world is over, and the tools built to keep pace with the new one are real, working, and still measuring the wrong thing. The queue got faster. Whether it got safer is a separate question, and right now, nobody’s confidence is good evidence either way. 

**Next in the series:** if review confidence is drifting away from the actual risk, the next question is whether testing can pick up the slack, or whether continuous verification has to replace the review gate entirely. 