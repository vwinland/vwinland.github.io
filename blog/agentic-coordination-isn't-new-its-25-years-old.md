---
title: "Agentic Coordination Isn't New. It's 25 Years Old"
description: "A 1999 NASA collective-intelligence report reframed as a lens for understanding modern multi-agent LLM coordination."
date: "2026-08-04"
tags:
  - AI
  - Agentic AI
  - Multi-Agent Systems
  - Software Engineering
slug: "agentic-coordination-isnt-new-its-25-years-old"
series: "Actually Agentic"
series_order: 2
series_total: 5
series_thesis: "how agentic systems coordinate, where they fail, and what remains unresolved"
series_prev_slug: "what-is-an-agent-actually"
series_prev_title: "What Is an Agent, Actually?"
image: "/projects/essay_2_header_old_robot_new_robot_v2.png"
---

# Agentic Coordination Isn't New. It's 25 Years Old

*What a 1999 NASA report on distributed AI tells us about today’s multi-agent systems.*

In 2024, while researching an explainer on ChatDev for IBM Think, I ran into a phrase in the project’s own GitHub README that stopped me: the framework described itself as a way to study *collective intelligence* in LLM-orchestrated multiagent systems. That’s an unusual claim for a coding-agent tool to make, so I went and found out what “collective intelligence” actually meant in this context instead of taking the phrase at face value. The trail didn’t stay in 2024\. It ran back through a 2010 definition of collective intelligence, a 1989 paper on multiagent task decomposition, and landed on a 1999 NASA Ames technical report by David Wolpert and Kagan Tumer: [An Introduction to Collective Intelligence](https://arxiv.org/abs/cs/9908014).

That report has nothing to do with language models. It’s actually about reinforcement learning in large distributed systems, written before anyone had a language model capable of holding a conversation. Despite that, the problem it’s solving is close enough to what multiagent frameworks, like the early ones I’ve studied (ChatDev, MetaGPT, and crewAI) were each built to do. 

# The setup

Wolpert and Tumer were interested in what they called a COllective INtelligence, or COIN: a system made up of many agents, with little to no centralized communication between them, where some outside observer has a way of scoring how well the whole system performed – a “world utility.” Each individual agent, meanwhile, is only trying to maximize its own reward, learned through reinforcement learning, with no direct access to that world utility at all. 

The central design problem they posed is this: assuming each agent gets good at maximizing its own private reward, what should that reward actually be, such that agents chasing it also happen to push the world utility up? Get the private rewards wrong, and you get agents that are individually successful and collectively useless; or worse, actively working against each other. Wolpert and Tumer named specific failure patterns to watch for: agents converging on the same overcrowded solution instead of spreading out to cover different parts of a problem, agents whose “improvements” cancel each other out, whole systems that get worse the more each individual agent optimizes itself.

That’s the tragedy of the commons, restated as an engineering problem instead of an economics one. It’s the entire question the report exists to answer. 

# The pivot

Swap a few words and this stops sounding like 1999\.  
Replace “private reward function” with “system prompt” or “role.” Replace “world utility” with however the outcome actually gets judged: what the human wanted, and some way of checking whether they got it. In a toy COIN example that’s a scoring function, in a real deployment, that’s often where governance comes in. Suddenly, ChatDev’s CEO, CTO, and programmer agent personas, the ones that shaped how the framework was originally built, read like a 2023 answer to a question posed in 1999\. This describes the phase-chained architecture the ChatDev project itself now calls “1.0, Legacy.” More on where the project went next in a moment – the point here is about the underlying problem, not the specific implementation.

Each agent in ChatDev, MetaGPT, or crewAI is given a private specification: a role, a set of instructions, a slice of responsibility, with the hope that if every agent follows its own slice well, the whole system produces what the human actually asked for. That’s the COIN problem, wearing natural language instead of a reward function. (Same caveat applies to MetaGpt as to ChatDev above: its open-source repository hasn’t shipped a release since April 2024 – the team’s current work lives elsewhere, and shows up later in this essay.) 

These three keep coming up in this series for a reason, not because they’re the only ones that exist: they’re the ones I [built](https://vwinland.github.io/tutorials) with hands-on for IBM over the last two years, after an earlier piece on LLM orchestration that led me to start digging into agent frameworks specifically. That meant actually running each one – building a three-agent crewAI crew powered by [watsonx.ai](http://watsonx.ai) to analyze customer service transcripts, forking ChatDev’s own source code to wire in a new model backend, and standing up a MetaGPT team with Ollama and DeepSeek to draft and revise a product requirements document – not reading documentation and summarizing it secondhand. Everything in this essay about their architecture comes from that hands-on work, not a survey of the whole multi-agent landscape. 

# The uncomfortable part

Wolpert and Tumer were explicit about what doesn’t work: the conventional approach to this problem, in their telling, is to model the dynamics of the whole system in detail and then hand-tune each agent’s behavior until the pieces cooperate. They flagged this approach as effortful and inclined to produce brittle systems that don’t hold up as the system grows or the environment changes. That’s a real bar to usefulness for something meant to work at scale in situations that weren’t specifically modeled in advance. 

That’s a fair description of the dominant design pattern in multi-agent LLM frameworks – the one that won the adoption, even if it wasn’t the only one being tried (more on that in a moment). Roles get hand-authored by a person who read the requirements and wrote down what the CEO agent should do, what the CTO agent should do, what the programmer agents should do. It’s the same design move Wolpert and Tumer flagged 25 years earlier, just executed in prose instead of code, and it inherits the same fragility they described: it works for the cases the human author thought of, and it’s brittle outside them. 

This isn’t a swipe at ChatDev, MetaGPT, or crewAI specifically – hand-authored roles were the dominant pattern among the multi-agent frameworks that got the most attention and adoption after 2023\. “Dominant” isn’t “universal,” though: in the same period, [AgentVerse](https://arxiv.org/abs/2308.10848) built a recruitment phase that adds and removes agents based on progress instead of a fixed roster, and a framework literally called [AutoAgents](https://arxiv.org/abs/2309.17288) set out to generate agent roles automatically rather than have a human write them. The hand-authored pattern won more adoption, but it was never the only approach on the table, even at the start. 

# Why it mostly works anyway

The honest complication is that it works better than the 1999 warning would predict. LLMs bring something reinforcement-learning agents from that era never had – a huge amount of pretrained world knowledge and a real ability to follow natural-language instructions without needing a hand-shaped reward signal to get there. A hand-written role like “you are a meticulous QA engineer, flag any test that doesn’t match the specification” gives an LLM agent enough to work with in a way that a hand-shaped numeric reward never could for an RL agent starting from nothing. 

That’s genuine progress. But it’s progress in the substrate the roles run on, not a resolution of the underlying coordination-design question. The fragility Wolpert and Turned described – hand-tuned interactions that work for anticipated cases and break outside them – hasn’t been solved. It’s just less visible, because the model underneath is strong enough to paper over more of the cracks than an RL policy could. 

# A second precedent, briefly

COIN isn’t the only piece of decades-old work worth knowing about here. Leslie Lamport – the computer scientist behind the Paxos consensus algorithm and the formal specification language TLA+ – has long argued for [writing a system’s specification before writing its code](https://softwareengineeringdaily.com/2016/02/26/distributed-systems-with-leslie-lamport/), not after. That’s a more literal ancestor of “spec-first” as a design philosophy than anything in COIN, which is really about incentives, not specification methodology. It’s a separate thread from the one this essay is pulling on, and it deserves its own space rather than a rushed paragraph here – it comes back properly later in this series.

# What happened next

The most interesting part of this story isn’t that COIN predicted a problem current frameworks still have. It’s what happened when the people who built those frameworks noticed it themselves. 

ChatDev’s own team didn’t stop at the hand-authored CEO/CTO/programmer pipeline. In 2024, they published [MacNet](https://arxiv.org/abs/2406.07155), which treats the *topology* connecting agents – not just their individual roles – as something to design deliberately, scaling cooperation across thousands of agents using directed graph structures instead of a fixed chain. In 2025 they went further with [Puppeteer](https://arxiv.org/abs/2505.19591): a central orchestrator, trained with reinforcement learning, that learns which agents to activate and in what order, rather than following a hand-written sequence. 

MetaGPT’s team made the same move. Their original framework hand-authored structured roles and standard operating procedures. Their follow-up, [AFlow](https://arxiv.org/abs/2410.10762), searches for effective agent workflows automatically, using tree search over code-represented workflows instead of a person writing the workflow by hand. 

The people who wrote the roles by hand came back, on their own, to build systems that write the roles instead. Not a separate camp of academics pointing out a flaw from the outside – the original authors, revisiting their own designs, arriving independently at something close to Wolpert and Tumer’s implicit suggestion 25 years earlier: don’t hand-tune the interaction structure, let it be learned. Whether that fully closes the gap COIN identified is a separate question.

For now, the more immediate one is what these hand-authored systems actually look like up close, and where their coordination choices show up as real, specific failure modes. That’s next.

