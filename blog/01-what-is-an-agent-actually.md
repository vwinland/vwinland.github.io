---
title: "What Is an Agent, Actually?"
description: "Untangling LLMs, agents, orchestration, and frameworks to establish shared vocabulary for agentic systems."
date: "2026-07-17"
tags:
  - AI
  - Agentic AI
  - Multi-Agent Systems
  - Software Engineering
slug: "what-is-an-agent-actually"
series: "Actually Agentic"
series_order: 1
series_total: 5
series_thesis: "how agentic systems coordinate, where they fail, and what remains unresolved"
image: "/projects/essay_1_header_agent_stack.png"
---

# What is an Agent, Actually?

*Distinguishing LLMs, agents, orchestration, and frameworks*

When I wrote my first tutorials on opensource multi-agent frameworks in 2024, “agent” already meant something genuinely complicated – an LLM’s behavior already depended on scaffolding well beyond the model itself: a defined role, a memory system, a planning process, coordination layers. The complexity was real then and it hasn’t gone away. If anything, the coordination problems have gotten harder as more agents and moving parts get added to the system. 

Since then, a separate problem has emerged: marketing copy, press releases, and vendor branding each use “agent” to mean something different, which has nothing to do with whether the systems themselves are hard to build. 

Ask around and you’ll get answers that don’t share a definition. Someone building a customer-support bot means a single LLM call wrapped in a persona. Someone building with crewAI or AutoGPT means several LLMs dividing labor and debating their way to an answer. Someone at a SaaS company means a no-code workflow tool that happens to call an LLM at one step in an otherwise ordinary pipeline. And a press release might mean the underlying model itself. None of these are wrong exactly, they’re each referring to a different layer of the same stack. 

Separate the layers and most of the disagreement resolves, because people usually agree on the facts, they’re just using the same word, “agent,” to mean different things. That’s what this essay does: describe the stack layer by layer to set the foundation of how this series describes agents, from the perspective of someone who has been researching and trying to understand this technology since before it got popular.

# Layer 1: The bare LLM

Start at the bottom. A large language model, used directly – you type into a prompt field, it generates a response, done. No memory beyond what fits in the current context window, no ability to act on anything outside producing text, no sense of an ongoing task. Ask a model a single question in a fresh conversation, a raw API call with no tools or memory attached, or a model served locally through Ollama with nothing wired in, and that’s layer 1\. This is the layer people mean when they call something “just an LLM”: a powerful pattern completer, but not pursuing a goal – answering a prompt. 

# Layer 2: A single agent

Add supporting components to that same LLM and capabilities emerge. A widely-cited 2023 survey on LLM-based agents, by Lei Want and colleagues at Renmin University, proposes [a framework](https://arxiv.org/abs/2308.11432) built around four components commonly associated with LLM agents. It’s one survey, not final word on the topic, but its four-part breakdown is a useful lens: 

- **Profiling** \- a defined role or persona (what practitioners usually just call a system prompt or role config), which shapes what the agent notices and how it interprets ambiguous instructions.  
- **Memory** \- short-term (whatever fits the context window this session) and long-term (an external store, read and written across sessions, with its own discipline about what to keep, what to forget, and how to synthesize raw observations into something more useful. For example, three turning three separate notes from past research sessions into one reliable summary.  
- **Planning** \- breaking a goal into steps, and in more capable systems, revising the plan when a step doesn’t go as expected/  
- **Action** \- the mechanism for doing something: calling a tool, querying an API, writing a file.

Take a research-assistant agent producing a literature summary. Its profile keeps it cautious rather than pundit-confident. Its memory holds sources read this session, plus notes from earlier sessions on adjacent topics. Its planning breaks “summarize this literature” into find-extract-check-draft-revise, and can repeat each step if a search comes up empty. Its action module issues the searches and writes the draft. 

Remove any one of the four and the system gets noticeably worse at being an agent, though the underlying LLM hasn’t changed. Same model, different components, genuinely different behavior. That’s what elevates layer 2 from layer 1\.

# Layer 3: Orchestration

Even a single agent needs a controller deciding when each module fires: plan or just act? Reflect on whether the last action worked, or push ahead? A disappointing result – retry, or replan?

Easy to understand because it’s “just” control flow, but it’s where a lot of real-world agent unreliability comes from. Excellent planning and memory can still perform badly if orchestration reflects too rarely to catch a mistake, or so often it never commits to finishing a step. This is where how often an agent pauses to reflect versus keeps acting gets decided, with nothing else in the stack changing at all. 

One terminology note, since I’ve written about this elsewhere: in industry usage, “orchestration” often means something [considerably broader](https://www.ibm.com/think/topics/llm-orchestration) than what I mean by it here – frameworks like LangChain, LlamaIndex, and Haystack get called orchestration frameworks even though they’re managing memory, prompt chains, and API integration all at once, not just the narrow plan, act, reflect loop this essay is discussing. That’s not a contradiction so much as further proof of the point: even a single word like “orchestration” gets used to cover multiple layers of this stack. For the rest of this series, I’m using it narrowly – just the control flow, not the whole set of components. 

# Agent vs. agentic – not the same claim

Having a profile, memory store, and a tool doesn’t automatically make something agentic. Agentic means the system decides what to do next by reasoning about the specific situation, rather than by following a fixed, pre-written rule. A thermostat acts entirely on its own without a human approving each decision, and it’s done that for a century – yet nobody calls a thermostat agentic because it isn’t reasoning about anything. It’s executing a rule someone wrote in advance. That’s the actual dividing line. 

That doesn’t mean an agentic system operates free of any rules or specs – a spec-driven agent still works within written constraints, and that’s not a contradiction. The real question is whether the rule fully determines the action in advance, or leaves a gap that has to be closed by judgement. A thermostat’s rule has no gap: for any given temperature, there’s exactly one correct action, fully specified. A spec that says "resolve the complaint professionally, within policy X” has a real gap – it constrains the goal and the boundaries, but it doesn’t list the exact response for every complaint that could come in. Deciding what “professional” looks like for this specific complaint, and which part of the policy actually applies, is the reasoning step that makes the following spec agentic rather than mechanical. Spec-driven development, in other words, isn’t in tension with being agentic – it’s a way of constraining what the reasoning has to accomplish, without pretending the reasoning itself can be written out in advance. 

Two other properties get conflated with this definition, and they’re worth keeping separate: 

- **Autonomy** is a different question: is a human approving each step, or not? A system can be agentic, reasoning its way to a decision, while still pausing for a human to approve the results before it’s used. That’s supervised, but it’s still agentic. This distinction matters more than it might sound like it does: whether a system can reason its way to a good answer and whether it should be allowed to act on that answer unsupervised are two separate questions. An agent drafting an email is a different situation than an agent approving a loan. The stakes should be addressed to determine whether agency is warranted.    
- **Iteration** is also different: does the system loop through plan, act, observe, revise? Iteration is the mechanism that lets a reasoning-driven system check and correct itself across a multi-step task. It isn’t what makes a decision agentic in the first place – a single action can be agentic (the model reasoned its way to it) even if it only happens once.

Much of what gets marketed as an “AI agent” is really a single-shot call: a role, a task, one response, stop. If the model reasoned about what to say rather than following a scripted template, that response is genuinely agentic – it’s just not iterating on its response, and it may not be autonomous depending on whether a human reviews it before it’s used. “Agent” describes the architecture: profiling, memory, planning, and action modules present. “Agentic” describes whether the decisions coming out of that architecture are actually reasoned, rather than scripted. 

Iteration is what matters most for the kinds of coordination failures the rest of this essay series examines, not for AI failures in general. Plenty of failure modes don’t need iteration at all: a hallucination, a poor tool choice, an unsafe output, a bad plan can each happen in a single pass. What iteration adds is the mechanism that lets things go wrong *across* multiple steps instead of just once. A system that reasons its way to a single action and stops can’t drift from the original spec. The coordination failures the rest of this essay series examines only show up once a system is both agentic and iterating: reasoning-driven decisions, repeated and revised across a longer task, with nobody double-checking each individual step. 

# Layer 4: Multi-agent frameworks

Most of the current hype is about this layer, and it’s more complicated than layer 2 or 3 copy-pasted several times. A 2024 survey on emerging agent architectures, by Tula Masterman and colleagues, frames it as [coordination problems that don’t exist for a single agent:](https://arxiv.org/abs/2404.11584) who’s in charge, if anyone? How does work get divided so two agents aren’t redundant, or leaving a gap neither covers? What does agent A’s output need to look like for agent B to use it correctly? What happens when B disagrees with what A produced? 

[ChatDev](https://arxiv.org/abs/2307.07924), [MetaGPT](https://arxiv.org/abs/2308.00352), and [crewAI](https://www.ibm.com/think/topics/crew-ai) all operate at this layer – and, spoiler for the next essay, each answers these questions quite differently. A multi-agent framework isn’t a stronger single agent; it’s a genuinely different kind of system, because it has to solve a coordination problem that doesn’t exist until there’s more than one agent involved.

# Why the layers matter

The chatbot-with-tools your coworker is excited about is mostly Layer 2\. The multi-bot-debate system your other coworker is skeptical of is Layer 4\. Neither is wrong, it’s just that the term “agent” is being used to mean all four layers at once. 

None of this – role prompting, external memory, task decomposition, multiple LLMs coordinating – is conceptually new. Distributed systems and multi-agent research addressed strikingly similar coordination questions decades before any language model existed capable of running it. They’re also not the only fields that got there first – classical agent architectures, robotics, and planning research have all wrestled with versions of the same problem. LLMs didn’t invent the problem of getting independent decision-makers toward one goal; they gave that older problem much more capable technology to run on. 

