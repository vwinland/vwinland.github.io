---
title: "The Rise of Intent-Driven Development"
description: "How spec-driven workflows, context engineering, and constraint authorship are becoming core engineering practices in AI-assisted teams."
date: "2026-06-02"
tags:
  - AI
  - Spec-Driven Development
  - Context Engineering
  - Developer Workflow
slug: "rise-of-intent-driven-development"
series: "The Industrialization of Software Engineering"
series_order: 2
series_total: 15
series_thesis: "how AI is restructuring software development from a craft discipline into an industrial production system"
series_prev_slug: "software-engineering-after-coding-era"
series_prev_title: "Software Engineering After the Coding Era"
image: "/projects/sven-mieke-fteR0e2BzKo-unsplash.jpg"
image_credit: "Photo by [Sven Mieke](https://unsplash.com/@sxoxm?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/brown-pencil-on-white-printing-paper-fteR0e2BzKo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

# The Rise of Intent-Driven Development

The following is what a modern AI-assisted software session can look like today.

A developer opens their editor and runs a single command: `/gsd-new-project`. An agent asks them a series of questions about what they are building. It researches the problem space, generates a requirements document, and produces a phased roadmap. The developer reviews it and approves. From that point forward, they do not write much code directly. They discuss implementation decisions before each phase, approve a plan, and watch parallel AI executors build it out in isolated context windows while their main session stays clean. When a phase completes, a verification agent walks through what was built, diagnoses anything broken, and produces a fix plan. The developer reviews, approves, and ships.

This is not a prototype or research demo. It is a description of how GSD ([Get Shit Done](https://github.com/open-gsd/get-shit-done-redux)), an open-source spec-driven development system with over 1,300 GitHub stars, works today. Trusted by engineers at Amazon, Google, Shopify, and Webflow, it is one of the clearest existing examples of a new kind of engineering workflow: one where the developer primary job is no longer physically writing software, but specifying intent precisely enough that AI systems can build it reliably.

That shift is what this essay is about.

## The Bottleneck Has Moved

In Essay 1 of this series, we established that code is no longer the scarce resource. When AI systems can generate thousands of lines of functional output in minutes, the constraint stops being implementation and starts being everything that comes before and after it: the quality of your requirements, the clarity of your constraints, the rigor of your acceptance criteria, and the robustness of your verification systems.

Intent-driven development is the emerging set of practices built around that new reality. It is the discipline of translating what you want a system to do into structured, precise, verifiable specifications that AI systems can act on reliably.

This skill is harder than it sounds.

## What Intent-Driven Development Actually Looks Like

The easiest way to understand the shift is to look at where things go wrong without it.

Most engineers who have used AI coding tools have experienced some version of this: you describe what you want, the AI generates something, it mostly works, you iterate a few times, and gradually the output drifts further from what you actually needed. The code is syntactically correct, it may even pass basic tests, but it does not respect the edge cases you care about. It makes architectural decisions that conflict with your existing system, or it introduces dependencies you did not want. You spend more time correcting than you would have building from scratch.

The root cause in almost every case is the same: the intent was not specified precisely enough.

Intent-driven development addresses this by making specification a first-class engineering activity. In practice, that means several things.

**Requirements become executable artifacts.** Instead of a Confluence page or a Jira ticket, a requirement in an intent-driven workflow is structured, versioned, and directly consumed by the systems doing the building. GSD maintains a `REQUIREMENTS.MD` file that the planning and execution agents reference throughout the project. Changes to requirements flow through to the agents working from them. The document is not documentation, it is an operational input.

**Constraints get defined before generation starts.** The most expensive mistakes in AI-assisted development are architectural ones that get baked in early and discovered late. Intent-driven workflows front-load constraint definition, for example: what are the performance boundaries, the security requirements, the integration contracts, and the things this system must never do? GSD `/gsd-discuss-phase` command exists specifically for this reason. Before anything gets planned or built, a developer captures implementation decisions (API shapes, error handling strategies, data structures, edge cases) so planning agents have them as inputs rather than making assumptions.

**Acceptance criteria replace implementation instructions.** In traditional development, a developer often knows both what a system should do and how it should do it. In intent-driven development, the how belongs to the AI. The developer job is to define what correct behavior looks like with enough specificity that it can be verified. This is closer to writing a contract than writing code.

**Verification is built into the loop, not bolted on at the end.** One of the most important structural features of systems like GSD is that verification is not a separate phase that happens after delivery. After each execution cycle, a dedicated verification agent walks through what was built, compares it against the original intent, and surfaces discrepancies before they compound. The developer reviews a diagnosis, not a codebase.

## The New Engineering Skill: Constraint Authorship

What emerges from these practices is a recognizable but unfamiliar engineering skill: constraint authorship, the ability to define what a system can do, under what conditions, with what boundaries, in enough detail that an AI system can implement it correctly and a verification system can confirm that it did.

This skill draws on things engineers already know (systems thinking, domain modeling, API design, security analysis), but applies them differently. The output is not working code, it is working specifications.

GSD describes this concisely in its own documentation: the quality of what gets built is a direct function of how clearly the developer specifies it. "If you know clearly what you want, this will build it for you" is not just a marketing claim, it is a description of a dependency. Ambiguous intent produces ambiguous output. Precise intent produces precise output. The AI is an amplifier, and what it amplifies is the quality of your specification.

This has practical implications for hiring and team development that most engineering organizations are not yet taking seriously. The developers who will have the most leverage in AI-assisted workflows are not necessarily the strongest implementers, but those who can think through how the system will work. These developers can decompose a problem into well-bounded components, define the contracts between them, specify the failure modes they care about, and construct acceptance criteria that actually capture correct behavior. That profile looks more like a principal engineer or architect than a senior individual contributor, and it needs to be developed deliberately, because it does not emerge automatically from years of implementation experience.

## Context Engineering: The Infrastructure of Intent

A related discipline emerging alongside specification does not get enough attention: context engineering.

One of the structural problems with AI-assisted development is that AI systems have no persistent memory. Each session starts fresh. As a session grows longer, quality degrades. This is a phenomenon known as "context rot." The longer the context window fills, the more the model attention gets diluted across everything that came before, and the less reliably it can focus on the task at hand.

Context engineering is the practice of managing what gets fed into an AI system context window at any given point in a workflow. That means maintaining structured artifacts that survive session boundaries: vision documents, requirements, roadmaps, state tracking, and per-phase implementation notes. The goal is feeding the right subset into each session rather than accumulating everything into one sprawling context. For heavier tasks, delegating to subagents with clean, scoped context windows keeps the primary session focused and output quality consistent.

The developer who manages this well gets consistently better output than the developer who does not, even using the same underlying models. Context engineering is, in effect, the operational discipline of intent-driven development. Specification defines what you want. Context engineering ensures the AI system can reliably hold onto that intent long enough to act on it.

## Prompts Are Not Enough

It is worth being direct about one thing: vibe coding is not intent-driven development.

Vibe coding is the practice of iterating with an AI through loosely specified prompts, sometimes accepting whatever the model produces, and moving fast without a formal specification layer. It can be genuinely useful for prototyping, exploration, and low-stakes tooling. It is not a reliable production engineering practice, and treating it as one is where a significant portion of AI-generated technical debt originates.

The distinction matters because both practices look similar from the outside: a developer at a keyboard, generating software with AI assistance. The difference is in the structure underneath. Intent-driven development invests upfront in making the specification precise enough to be trustworthy. Vibe coding skips that investment and moves faster in the short run, often at a significant cost later.

This is not a moral argument. It is an engineering economics argument. The cost of ambiguity in AI-assisted development does not disappear, it gets deferred. Vibe coding defers it to debugging, refactoring, and security remediation. Intent-driven development pays it upfront in the form of disciplined specification work and produces output that is more coherent, more maintainable, and more verifiable as a result.

## What This Means for Engineering Teams Today

The transition to intent-driven development is not something that happens automatically when you adopt AI coding tools. It requires deliberate investment in new practices, new artifacts, and new skills.

A few places to start:

**Treat your specifications as living infrastructure.** Requirements documents, architecture decision records, and acceptance criteria should be versioned, maintained, and treated as operational inputs to AI-assisted workflows, not documentation that trails behind development.

**Build the discuss-before-plan habit.** The most expensive AI-assisted mistakes happen when implementation decisions get made by the AI instead of the developer. Build a practice of capturing those decisions explicitly before generation begins. GSD discuss phase is one model. An architecture review before a sprint is another. The specific format matters less than the discipline of doing it.

**Develop constraint authorship as a team skill.** This means investing in how your team writes requirements, defines acceptance criteria, and specifies system behavior. It means reviewing specifications with the same rigor you apply to code review. It also means recognizing that not all engineers will naturally be strong at this; it requires explicit development, not just exposure to AI tools.

**Invest in context management.** If your team is using AI-assisted development without a strategy for managing what the AI knows at each point in the workflow, you are leaving significant quality on the table. Structured artifacts, clean session management, and deliberate use of subagents for heavy tasks are practices that compound over time.

## Closing

There is a version of AI-assisted development that is mostly noise: faster generation of uncertain output, more iteration, more review burden, and a gradual accumulation of complexity that outpaces the team ability to understand its own system.

There is another version that is genuinely transformative: precise specification, disciplined context management, AI systems that build what you actually intend, and verification loops that catch discrepancies before they compound.

The difference between those two versions is not the AI model. It is the engineering practice around it.

Intent-driven development is that practice. It is not fully mature yet. The tooling is still evolving, the conventions are still forming, and most teams are still figuring out what it means for their existing workflows. But the direction is clear: the bottleneck in software engineering has moved from writing to specifying, and the teams that learn to specify well will have a durable advantage over those that do not.

What happens when a team can generate software reliably at the speed of a well-structured conversation? That question points toward the next transformation this series will explore: the collapse of the traditional software development lifecycle, and what replaces it.
