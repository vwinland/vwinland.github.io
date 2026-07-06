---
title: "Vibe Coding Has a Governance Problem"
description: "Vibe coding is fast and useful in the right scope, but without governance it introduces security risk, dependency sprawl, and architectural drift that outpace review."
date: "2026-06-30"
tags:
  - AI
  - Governance
  - Software Engineering
  - Security
slug: "vibe-coding-has-a-governance-problem"
series: "The Industrialization of Software Engineering"
series_order: 7
series_total: 15
series_thesis: "how AI is restructuring software development from a craft discipline into an industrial production system"
series_prev_slug: "legacy-migration-may-become-ais-largest-empire"
series_prev_title: "Legacy Migration May Become AI's Largest Enterprise Market"
series_next_slug: "code-review-cannot-scale-to-the-ai-era"
series_next_title: "Code Review Cannot Scale to the AI Era"
image: "/projects/julian-hochgesang-3-y9vq8uoxk-unsplash.jpg"
image_credit: "Photo by [Julian Hochgesang](https://unsplash.com/@julianhochgesang?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/time-lapse-photography-of-vehicles-3-y9vq8uoxk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

# Vibe Coding Has a Governance Problem

It's 4:47 on a Friday. A developer types a sentence describing what they want, hits enter, and watches the AI write the implementation, wire up the dependencies, and hand back working code before their coffee goes cold. It runs on the first try. Nobody wrote a test for it, so nothing fails. The pull request gets approved in the time it takes to skim the diff, and the feature is live before the standup on Monday.

Nobody on the team could fully explain how it works. Not because it's complicated, but because nobody had to think about it long enough to find out. The prompt was the spec. The output was the product. The part where a human sits with the logic, traces the edge cases, and decides whether this is actually a good way to solve the problem never happened.

This is vibe coding: describing an outcome and accepting whatever code arrives that produces it, with little inspection of what's underneath. It's also, more and more, how production software actually gets written, even if nobody has a clean number for how much.

The speed is real. The risk is structural, not incidental, and it doesn't show up in the demo.

---

**The Case for Not Looking Too Closely**

It's worth being honest about why vibe coding caught on, because the reasons are good ones. A lot of code was never going to need to last. A spike to test whether an integration is feasible. A script that reformats a file once and gets deleted. A dashboard built to answer this week's question, not run for the next five years. None of that calls for the scrutiny a payments system requires, and pretending otherwise isn't rigor. It's just waste, applied to work that was never going to carry that kind of risk.

Vibe coding also lowers the cost of finding out whether an idea is worth pursuing at all. The fastest way to learn that a product concept doesn't work is often to build a rough version of it and watch it fail, and that loop used to require an engineer's time before anyone knew if the idea deserved it. Compressing that loop to minutes instead of days is a genuine gain, not a corner cut.

And it has put real capability into the hands of people who were never going to learn to code the traditional way. That path assumes you'll stay motivated long enough to build someone else's idea of "the basics" before you're allowed to build the thing you actually want. For a lot of people, that's exactly where the motivation runs out, long before the fundamentals do. Vibe coding skips the part that doesn't work and starts at the part that does: building the actual thing.

None of this is new in kind. Copy-pasted Stack Overflow answers, scaffolding generators, and code written by junior engineers under deadline pressure have been shipping under-scrutinized logic into production for decades. Vibe coding inherits that risk category. It doesn't invent it. What's different is the speed and the volume, and that difference is exactly what turns a familiar, manageable risk into something that can outrun the controls built to catch it.

The honest claim isn't that vibe coding is reckless. It's that vibe coding has a correct operating envelope, low-stakes, disposable, exploratory work, and most of the damage shows up when code written for that envelope ends up load-bearing somewhere it was never built to hold.

---

**What Gets Lost When Review Becomes Optional**

Traditional development has a bottleneck built into it: a human has to write the code. Writing it was never a guarantee that someone understood it. But it forced a kind of contact with the logic that simply accepting a finished answer doesn't. Where does this data go? Who can call this function? What happens when this input is malformed? A developer typing line by line answers those questions, even informally, because typing requires deciding.

AI-generated code collapses that bottleneck without replacing what it did. The model produces a plausible answer to the prompt, not necessarily a correct or safe one, and plausibility is not the same property as soundness. The code can run, pass a quick test, and still be the wrong design: insecure defaults, missing authorization checks, a SQL query built with string concatenation in a function that looks identical to a parameterized one. Nothing about the surface signals which kind it is.

That gap between looking right and being right is closely related to what AI researchers call hallucination, though in software development it often appears in a subtler form. The code compiles, runs, and produces plausible outputs while still embedding incorrect assumptions, insecure patterns, or flawed logic. [Researchers at Stanford tested this directly](https://arxiv.org/abs/2211.03622): developers given access to an AI coding assistant wrote measurably less secure code than developers working without one, and were simultaneously more likely to believe their code was secure. The tool didn't just fail to catch the problem. It made the problem harder to see. That's tolerable in a script nobody depends on. It's a different problem entirely once the code is handling user data, auth, or money, and nobody flagged the shift.

---

**The Vulnerabilities Vibe Coding Tends to Produce**

A few failure modes show up consistently enough to be worth naming directly.

Security defaults get skipped. Models trained on a wide distribution of public code reproduce whatever patterns are common in that distribution, including insecure ones. [One of the first systematic studies of this](https://dl.acm.org/doi/10.1145/3610721) tested GitHub Copilot against 89 security-focused programming scenarios built from MITRE's top security weakness categories and found that roughly 40% of the generated solutions contained vulnerabilities. A request for "a login form" or "a file upload endpoint" is more likely to return something that works in the demo than something that resists the obvious attack against it, because the training data is full of code that does the former and not always the latter.

Dependencies multiply faster than anyone is tracking them, and increasingly, they don't even need to be real. AI models sometimes invent plausible-sounding package names that don't exist in any registry, a problem researchers call package hallucination. [A 2025 study presented at USENIX Security](https://www.usenix.org/system/files/usenixsecurity25-spracklen.pdf) generated over 576,000 code samples across sixteen models and found that nearly one in five recommended packages didn't exist anywhere, with 43% of those invented names repeating consistently enough across prompts to be predictable. That predictability is what makes the gap exploitable: an attacker may be able to register a package name the model repeatedly invents and wait for developers or automated workflows to install it. Security researchers have started calling the resulting attack slopsquatting. Even when every dependency is real, each one added is still a new piece of the supply chain nobody on the team chose deliberately or added to an inventory. Sprawl accumulates in increments too small to notice until the count is large enough to matter.

Architectural drift happens by default, not by mistake. Every AI-generated change is locally coherent: it solves the prompt in front of it. Nothing about that process accounts for how the change fits the system's existing patterns, layering, or ownership boundaries. Without someone actively enforcing consistency, a codebase assembled this way accumulates contradictory approaches to the same problem, solved differently each time, because each solution was generated in isolation from the others.

Hidden vulnerabilities survive specifically because the code works. A function with a logic flaw that breaks the build gets caught immediately. A function with a security flaw that still returns the correct output for every test case anyone thought to write can ship clean and stay in production until something exploits it. Correctness on the happy path is the easiest property to verify and the least useful one for catching this category of problem.

---

**Why This Isn't a Tooling Problem**

The instinct is to treat this as something a better model or a smarter linter eventually fixes. That undersells what's actually happening.

AI removed friction from the part of software development that produces code. It did nothing to remove friction from the part that produces consequences. A vulnerability shipped in ten seconds is exploited on the same timeline as a vulnerability that took a developer two days to write. The downstream cost of insecure code, the breach, the outage, the compliance failure, doesn't scale down just because the generation step got faster. If anything, the volume problem makes it worse: more surface area, generated faster, reviewed at the same human pace as before.

This is the same asymmetry that shows up everywhere else in this series. Generation scales easily. Verification scales only when organizations invest deliberately in the systems that make it possible. A development process where code arrives faster than anyone can meaningfully evaluate it is not actually faster. It has just moved the bottleneck downstream, to the point where the cost shows up after the damage instead of before it.

---

**The Assumption That Doesn't Hold**

There's an obvious rebuttal to all of this, and it deserves to be taken seriously rather than waved off. Vibe coding, the argument goes, is the immature version of the problem. Replace the loose prompt-and-accept loop with spec-driven development, wrap it in a governed agentic pipeline that plans, executes, tests, and self-corrects against a defined contract, and the risk this essay describes should mostly close. The bottleneck doesn't move. It gets automated.

That assumption is worth testing against what's actually happening at the more sophisticated end of this spectrum, not the careless end.

[A 2026 industry survey of more than 900 executives and technical practitioners](https://www.gravitee.io/blog/state-of-ai-agent-security-2026-report-when-adoption-outpaces-control) reported a wide gap between confidence and visibility, not a confirmed measurement of harm, but a pattern worth taking seriously on its own terms. 82% of executives said they felt confident their existing policies protected them from unauthorized agent actions. The same respondents reported that only 47.1% of their organization's AI agents were actually being monitored or secured, and 88% said they had confirmed or suspected an AI agent security incident that year. Self-reported suspicion isn't proof an incident occurred. But the confidence-versus-visibility gap itself is the more interesting finding here, and it's the same shape as the Stanford result above, reproduced at the organizational level, in teams that explicitly believed they had governance in place.

Agent skills, the modular, packaged, reusable capabilities that are supposed to represent the mature, productized version of agentic coding, tell a similar story. [A 2026 empirical study](https://arxiv.org/abs/2601.10338) analyzed over 31,000 published agent skills and found that 26.1% contained at least one security vulnerability, spanning prompt injection, data exfiltration, privilege escalation, and supply chain risk. These aren't loose, unreviewed prompts. They're packaged components built for reuse, the kind of artifact a spec-driven shop would actually adopt. A quarter of them were dangerous anyway.

What this suggests is that "good enough" agentic tooling doesn't make the operating envelope irrelevant. It moves it. Spec-driven development can close the gap between what was asked for and what was built. It does less to close the gap between what was specified and what should have been specified, because that gap was never a tooling problem to begin with. A spec is still written under deadline pressure by people who don't always know which edge case matters until it's exploited. Governance can verify conformance to a contract. It can't verify that the contract was the right one, and the same speed that made vibe coding attractive without scrutiny is what makes thin specs attractive once the scrutiny has a more sophisticated name.

---

**What Governance-First Vibe Coding Would Require**

None of this is an argument against AI-generated code, agentic or otherwise. It's an argument against treating either generation speed or governance infrastructure as the finish line, when the actual work is making sure the thing being verified was worth verifying in the first place.

A few principles separate organizations getting real value from this from organizations accumulating risk they haven't measured yet.

Review has to happen somewhere, even if not everywhere. Not every line generated needs a human reading it character by character, but every codebase needs an enforced policy about what gets automated scanning, what gets human review, and what's allowed to ship without either. The absence of that policy is itself the governance failure, regardless of how good the AI is.

Security checks need to be structural, not optional. Static analysis, dependency scanning, and policy-as-code enforcement need to run automatically against every AI-generated change, in the pipeline, not as a step someone can skip under deadline pressure. The same speed that makes vibe coding attractive makes manual security review unsustainable as the primary control.

Provenance has to be tracked. Knowing which code was AI-generated, which model produced it, and what prompt produced it isn't bureaucratic overhead. It's the information needed to investigate an incident, audit a dependency tree, or figure out why a pattern appears inconsistently across a codebase.

Architecture has to be enforced by something other than habit. AI systems don't inherently respect the boundaries a team has agreed to. Golden paths, internal developer portals, and platform-level constraints exist precisely to give generation a shape to conform to, the same governance infrastructure earlier essays in this series describe as the new factory floor.

---

**Closing**

The pattern from this series keeps repeating. Generation gets cheap. Consequences don't. Every previous bottleneck this series has examined, code review, platform standardization, legacy migration, was a place where human judgment used to be required by necessity. AI removes the necessity without removing the requirement. The organizations that treat governance as the next feature to build, rather than the thing slowing down the real work, are the ones that get to keep the speed.

Vibe coding isn't reckless by nature. It's scoped for disposable, low-stakes work, and most of the damage happens when nobody notices the moment that code stops being disposable. Better tooling can reduce real portions of that risk, but it doesn't eliminate the need for judgment. More often, it changes where the failure modes appear: from a careless prompt to a confident spec, from an individual developer's false sense of security to an organization's. The fix isn't slowing generation down, and it isn't a more sophisticated pipeline either. It's knowing, deliberately, when something has crossed out of the envelope it was built for, and treating that moment, not the next model release, as the trigger for everything review, scanning, and architecture are supposed to catch.

*Next in the series: "Code Review Cannot Scale to the AI Era" — why the human review bottleneck that used to catch exactly these problems is breaking down under AI-generated volume, and what has to replace it.*
