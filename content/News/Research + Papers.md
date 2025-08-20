---
title: Research + Papers
tags:
  - signal
draft:
---
## [Cultural Fingerprints in AI; A Comparative Analysis of Ethical Guardrails in Large Language Models Across US, Chinese, and French Implementations](https://danielkliewer.com/blog/2024-12-30-Cultural-Fingerprints)
> This dissertation explores the comparative analysis of ethical guardrails in Large Language Models (LLMs) from different cultural contexts, specifically examining LLaMA (US), QwQ (China), and Mistral (France). The research investigates how cultural, political, and social norms influence the definition and implementation of "misinformation" safeguards in these models. Through systematic testing of model responses to controversial topics and cross-cultural narratives, this study reveals how national perspectives and values are embedded in AI systems' guardrails.

## [Non-Determinism of "Deterministic" LLM Settings](https://arxiv.org/abs/2408.04667)
> LLM (large language model) practitioners commonly notice that outputs can vary for the same inputs under settings expected to be deterministic. Yet the questions of how pervasive this is, and with what impact on results, have not to our knowledge been systematically investigated. We investigate non-determinism in five LLMs configured to be deterministic when applied to eight common tasks in across 10 runs, in both zero-shot and few-shot settings. We see accuracy variations up to 15% across naturally occurring runs with a gap of best possible performance to worst possible performance up to 70%. In fact, none of the LLMs consistently delivers repeatable accuracy across all tasks, much less identical output strings. Sharing preliminary results with insiders has revealed that non-determinism perhaps essential to the efficient use of compute resources via co-mingled data in input buffers so this issue is not going away anytime soon. To better quantify our observations, we introduce metrics focused on quantifying determinism, TARr@N for the total agreement rate at N runs over raw output, and TARa@N for total agreement rate of parsed-out answers. Our code and data are publicly available at [this https URL](https://github.com/breckbaldwin/llm-stability).

## [The Illusion of Thinking - Apple Research](https://machinelearning.apple.com/research/illusion-of-thinking)
> Research paper written by the Apple AI research team. Brief takeaway:
> - Regular models beat thinking models on simple tasks.
> - Thinking models beat regular models on medium-complexity tasks.
> - Both type of models suffer from high-complexity tasks - even at short prompt length, thus no relevant [long-context degradation](https://www.reddit.com/r/LocalLLaMA/comments/1kxvaq2/new_deepseek_r1s_long_context_results/) impact on the results.
> - Thinking models allocate more reasoning tokens with increasing task complexity, yet at some point start reducing them and thus result quality suffers.
> - Models tend to stick to wrong early answers, which aligns with the [multi-turn research](https://www.reddit.com/r/LocalLLaMA/comments/1kn2mv9/llms_get_lost_in_multiturn_conversation/).
> - Problem-solving doesn't generalize. They can be doing OK in some puzzles, yet utterly fail in others despite no increase in difficulty.

## [How much do Language Models Memorize? - Meta Research ](https://arxiv.org/abs/2505.24832)
>A new method for estimating how much a model knows about a datapoint and use it to measure the capacity of modern language models. Prior studies of language model memorization have struggled to disentangle memorization from generalization. We formally separate memorization into two components: unintended memorization, the information a model contains about a specific dataset, and generalization, the information a model contains about the true data-generation process.

## [AI 2027: Research Paper outlining future AI outcomes](https://ai-2027.com/)
>"Claims about the future are often frustratingly vague, so we tried to be as concrete and quantitative as possible, even though this means depicting one of many possible futures.
>
>We wrote two endings: a “slowdown” and a “race” ending."

## [Situational Awareness: The Decade Ahead](https://situational-awareness.ai/)
>Aschenbrenner predicts an “intelligence explosion” where AI systems rapidly evolve from human-level intelligence to vastly superhuman capabilities. He says this transition could happen extremely quickly, potentially within less than a year. If true, the implications would be staggering, suggesting a world where AI can automate AI research, compressing decades of progress into mere months.

## [Advances and Challenges in Foundation Agents](https://arxiv.org/pdf/2504.01990)
>This survey provides a comprehensive overview, framing intelligent agents within a modular, brain-inspired architecture that integrates principles from cognitive science, neuroscience, and computational research. We structure our exploration into four interconnected parts. First, we delve into the modular foundation of intelligent agents, systematically mapping their cognitive, perceptual, and operational modules onto analogous human brain functionalities, and elucidating core components such as memory, world modeling, reward processing, and emotion-like systems. Second, we discuss self-enhancement and adaptive evolution mechanisms, exploring how agents autonomously refine their capabilities, adapt to dynamic environments, and achieve continual learning through automated optimization paradigms, including emerging AutoML and LLM-driven optimization strategies. Third, we examine collaborative and evolutionary multi-agent systems, investigating the collective intelligence emerging from agent interactions, cooperation, and societal structures, highlighting parallels to human social dynamics. Finally, we address the critical imperative of building safe, secure, and beneficial AI systems, emphasizing intrinsic and extrinsic security threats, ethical alignment, robustness, and practical mitigation strategies necessary for trustworthy real-world deployment. By synthesizing modular AI architectures with insights from different disciplines, this survey identifies key research gaps, challenges, and opportunities, encouraging innovations that harmonize technological advancement with meaningful societal benefit. The project’s Github link is: https://github.com/FoundationAgents/awesome-foundation-agents.

## [How People use Claude for Support, Advice, and Companionship](https://www.anthropic.com/news/how-people-use-claude-for-support-advice-and-companionship)
>- Only 2.9% of all Claude conversations are "affective" (emotional/personal support)
>- Companionship and roleplay combined make up less than 0.5% of conversations
>- Most people primarily use AI for work tasks, not emotional support
>- Claude pushes back less than 10% of the time in supportive contexts
>- People tend to end conversations more positively than they started

## [Early Signs of Steganographic Capabilities in Frontier LLMs](https://arxiv.org/abs/2507.02737)
> Can frontier models hide secret information and reasoning in their outputs? We find that current models are unable to encode short messages in their outputs without a monitor noticing under standard affordances. They can succeed, however, if given additional affordances such as using an unmonitored scratchpad and coordinating on what encoding scheme to use. We additionally find early signs that models can perform basic encoded reasoning in a simple state-tracking problem. This includes some ability to reason with their own and pre-defined schemes, including encoding schemes such as Hexadecimal. Despite this, they can rarely hide reasoning subtly within a cover task to fool a monitor. Overall, our results indicate that current LLMs exhibit nascent steganographic capabilities. While these capabilities are likely insufficient to bypass well-designed monitors at present, this could change in the future.

## [Small Language Models are the Future of Agentic AI](https://arxiv.org/abs/2506.02153)
>**What’s the Problem?**  
>LLMs (like GPT‑4, Gemini, Claude) are great for open-ended conversation and “do‑everything” AI, but deploying them for every automated agent is overkill. Most agentic AI in real life handles _routine, repetitive, and specialized_ tasks—think email triage, form extraction, or structured web scraping. Using a giant LLM is like renting a rocket just to deliver a pizza.
>
>**NVIDIA’s Position:**  
> They argue that **small language models (SLMs)**—models with fewer parameters, think under 10B—are often just as capable for these agentic jobs. The paper’s main points:
>
>- **SLMs are Efficient and Powerful Enough:**
>	- SLMs have reached a level where for many agentic tasks (structured data, API calls, code snippets) they perform at near parity with LLMs—but use far less compute, memory, and energy.
>	- Real-world experiments show SLMs can match or even outperform LLMs on speed, latency, and operational cost, especially on tasks with narrow scope and clear instructions.
>- **Best Use: Specialized, Repetitive Tasks**  
>	- The rise of “agentic AI”—AI systems that chain together multiple steps, APIs, or microservices—means more workloads are predictable and domain-specific.
>	- SLMs excel at simple planning, parsing, query generation, and even code generation, as long as the job doesn’t require wide-ranging world knowledge.
>- **Hybrid Systems Are the Future:**
>	- Don’t throw out LLMs! Instead, pipe requests: let SLMs handle the bulk of agentic work, escalate to a big LLM only for ambiguous, complex, or creative queries.
>	- They outline a method (“LLM-to-SLM agent conversion algorithm”) for systematically migrating LLM-based agentic systems so teams can shift traffic without breaking things.
>- **Economic & Environmental Impact:**
>	- SLMs allow broader deployment—on edge devices, in regulated settings, and at much lower cost.
>	- They argue that even a _partial shift_ from LLMs to SLMs across the AI industry could dramatically lower operational costs and carbon footprint.
>- **Barriers and “Open Questions”:**
>	- Teams are still building for giant models because benchmarks focus on general intelligence, not agentic tasks. The paper calls for new, task-specific benchmarks to measure what really matters in business or workflow automation.
>	- There’s inertia (invested infrastructure, fear of “downgrading”) that slows SLM adoption, even where it’s objectively better.
>- **Call to Action:**
>	- NVIDIA invites feedback and contributions, planning to open-source tools and frameworks for SLM-optimized agents and calling for new best practices in the field.
>	- The authors stress the shift is not “anti-LLM” but a push for AI architectures to be matched to the right tool for the job.
>
>**Why this is a big deal:**
>- As genAI goes from hype to production, cost, speed, and reliability matter most—and SLMs may be the overlooked workhorses that make agentic AI actually scalable.
>- The paper could inspire new startups and AI stacks built specifically around SLMs, sparking a “right-sizing” movement in the industry.
>
>**Caveats:**
>- SLMs are not (yet) a replacement for all LLM use cases; the hybrid model is key.
>- New metrics and community benchmarks are needed to track SLM performance where it matters.