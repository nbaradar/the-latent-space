---
title: Codex CLI Commands
tags:
  - ai/ml
  - reference
  - openai
  - chatgpt
draft:
---
| Command                              | Purpose                             | Example                              |
| ------------------------------------ | ----------------------------------- | ------------------------------------ |
| `codex`                              | Interactive REPL                    | `codex`                              |
| `codex "..."`                        | Initial prompt for interactive REPL | `codex "fix lint errors"`            |
| `codex -q "..."`                     | Non-interactive "quiet mode"        | `codex -q --json "explain utils.ts"` |
| `codex completion <bash\|zsh\|fish>` | Print shell completion script       | `codex completion bash`              |

Key flags: `--model/-m`, `--approval-mode/-a`, `--quiet/-q`, and `--notify`.