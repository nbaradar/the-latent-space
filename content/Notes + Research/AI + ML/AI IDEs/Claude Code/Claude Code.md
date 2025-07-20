---
title: Claude Code
tags:
  - lab
  - claude
  - anthropic
  - ai/ml
draft:
---
>[!important]- **You** must **have a** **pro account**
>[Pricing](https://www.anthropic.com/pricing) 
>- `$17/month` if billed annually
>- `$20/month` if billed monthly.
>
>Also comes with more usage and more models. 

>[!info]- Addtional Resources
>- https://www.reddit.com/r/ClaudeAI/comments/1ljv2kz/tips_for_developing_large_projects_with_claude/
>- https://www.reddit.com/r/ClaudeAI/comments/1lquetd/the_claude_code_divide_those_who_know_vs_those/
>- https://github.com/hesreallyhim/awesome-claude-code
>- https://github.com/wong2/awesome-mcp-servers
>- https://github.com/punkpeye/awesome-mcp-servers

An agentic IDE/CLI provided by [[Anthropic]].

It seems like the most important thing when it comes to "vibe-coding" is setting up your context and tooling correctly. 
So your `CLAUDE.md` file, slash commands, and the newly added "hooks" feature.

As of updating this on June 19, 2025 Claude Code is still considered the best code assist tool when it comes to the quality of it's output. 

NOTE: 
- **Pro ($20/month)**: Average users can send approximately 45 messages with Claude every 5 hours, OR send approximately 10-40 prompts with Claude Code every 5 hours.
	- **Model access**: Pro plan subscribers can access Sonnet 4, but won’t be able to use Opus 4 with Claude Code.

- **Max 5x Pro ($100/month)**: Average users can send approximately 225 messages with Claude every 5 hours, OR send approximately 50-200 prompts with Claude Code every 5 hours.
- **Max 20x Pro ($200/month)**: Average users can send approximately 900 messages with Claude every 5 hours, OR send approximately 200-800 prompts with Claude Code every 5 hours.
	- **Model access**: Max plan subscribers can use Sonnet or Opus 4 on Claude Code (switch between them using the `/model` command).

---
# [[Claude Code Install|Installation]]

---
# Configuration

---
# Tooling

---
# Additional Tips/Tricks
### Tracking Usage
If you want to track your remaining usage credit, there are a couple open source tools that help you do so through JSONL files 
Look at [CCUsage](https://ccusage.com/) 

And if you want to know [how it's working in the background](https://deepwiki.com/ryoppippi/ccusage/5.2-data-loading-system): Basically, ClaudeCode generates JSONL files (JSONL is JSON where each new line is a valid JSON object) that track usage data. CCUsage has a Data Processing Pipeline that looks for these files and any modifications to them and tracks them in real time. You can also learn more about how [ClaudeCode implemented OpenTelemetry for Monitoring here](https://docs.anthropic.com/en/docs/claude-code/monitoring-usage).

