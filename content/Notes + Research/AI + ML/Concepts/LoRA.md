---
title: LoRA
tags:
  - concept
  - ai/ml
---
# Low Rank Adaptation
This is a lightweight fine-tuning technique. It adds extra matrices to the model rather than modifying all of its weights. 

Particularly used with [[Large Language Model]] and [[Diffusion Model]].

This makes training much faster and cheaper than full fine-tuning. It's also easy to load/unload into models dynamically, which is great for customization