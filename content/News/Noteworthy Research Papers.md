## [Cultural Fingerprints in AI; A Comparative Analysis of Ethical Guardrails in Large Language Models Across US, Chinese, and French Implementations](https://danielkliewer.com/blog/2024-12-30-Cultural-Fingerprints)
> This dissertation explores the comparative analysis of ethical guardrails in Large Language Models (LLMs) from different cultural contexts, specifically examining LLaMA (US), QwQ (China), and Mistral (France). The research investigates how cultural, political, and social norms influence the definition and implementation of "misinformation" safeguards in these models. Through systematic testing of model responses to controversial topics and cross-cultural narratives, this study reveals how national perspectives and values are embedded in AI systems' guardrails.

## [Non-Determinism of "Deterministic" LLM Settings](https://arxiv.org/abs/2408.04667)
> LLM (large language model) practitioners commonly notice that outputs can vary for the same inputs under settings expected to be deterministic. Yet the questions of how pervasive this is, and with what impact on results, have not to our knowledge been systematically investigated. We investigate non-determinism in five LLMs configured to be deterministic when applied to eight common tasks in across 10 runs, in both zero-shot and few-shot settings. We see accuracy variations up to 15% across naturally occurring runs with a gap of best possible performance to worst possible performance up to 70%. In fact, none of the LLMs consistently delivers repeatable accuracy across all tasks, much less identical output strings. Sharing preliminary results with insiders has revealed that non-determinism perhaps essential to the efficient use of compute resources via co-mingled data in input buffers so this issue is not going away anytime soon. To better quantify our observations, we introduce metrics focused on quantifying determinism, TARr@N for the total agreement rate at N runs over raw output, and TARa@N for total agreement rate of parsed-out answers. Our code and data are publicly available at [this https URL](https://github.com/breckbaldwin/llm-stability).

## [Research Paper: Self-Adapting Language Models](https://arxiv.org/abs/2506.10943)
> [!warning]
> The papers title is slightly misleading, but it's stepping stone in the development of ai/ml systems. 

> Catastrophic forgetting. [...] We do not explicitly optimize for retention in our current training setup, but we aim to establish a baseline for how well SEAL handles sequential self-edits without dedicated mechanisms for handling catastrophic forgetting. [...] As shown in Figure 6, performance on earlier tasks gradually declines as the number of edits increases, suggesting that SEAL is still susceptible to catastrophic forgetting. [...]

![[Pasted image 20250616151718.png|400]]

## [The Illusion of Thinking - Apple Research](https://machinelearning.apple.com/research/illusion-of-thinking)
> Research paper written by the Apple AI research team. Brief takeaway:
> - Regular models beat thinking models on simple tasks.
> - Thinking models beat regular models on medium-complexity tasks.
> - Both type of models suffer from high-complexity tasks - even at short prompt length, thus no relevant [long-context degradation](https://www.reddit.com/r/LocalLLaMA/comments/1kxvaq2/new_deepseek_r1s_long_context_results/) impact on the results.
> - Thinking models allocate more reasoning tokens with increasing task complexity, yet at some point start reducing them and thus result quality suffers.
> - Models tend to stick to wrong early answers, which aligns with the [multi-turn research](https://www.reddit.com/r/LocalLLaMA/comments/1kn2mv9/llms_get_lost_in_multiturn_conversation/).
> - Problem-solving doesn't generalize. They can be doing OK in some puzzles, yet utterly fail in others despite no increase in difficulty.

![[Pasted image 20250623132628.png|400]]

## [How much do Language Models Memorize? - Meta Research ](https://arxiv.org/abs/2505.24832)
>

## [AI 2027: Research Paper outlining future AI outcomes](https://ai-2027.com/)
>"Claims about the future are often frustratingly vague, so we tried to be as concrete and quantitative as possible, even though this means depicting one of many possible futures.
>
>We wrote two endings: a “slowdown” and a “race” ending."

