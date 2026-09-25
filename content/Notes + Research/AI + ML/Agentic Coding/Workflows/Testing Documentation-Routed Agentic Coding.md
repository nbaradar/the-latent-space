---
title: Testing Documentation-Routed Agentic Coding
tags:
  - ai/ml
  - agentic-coding
  - claude
  - workflow
  - evaluation
draft:
created: 2026-09-25

modified: 2026-09-25
published: 2026-09-25

---
> [!abstract] TL;DR
> Word counts show only what the [[Documentation-Routed Agentic Coding]] workflow **costs**, not whether agents do the work **better**. This page tests two separate things:
> 1. **Did the migration go well?** Tests the `/adopt-routed-workflow` skill.
> 2. **Do agents do at least as well with less context?** An A/B comparison of the old docs against the new ones, on the same tasks.

> [!warning] The risk being tested
> The design moves most rules out of the always-loaded `AGENTS.md` into docs the agent opens only when the routing table points there. If routing fails, an agent can **miss a rule it used to see every session**, and nothing obvious tells you it happened. These tests are designed to catch that.

## Part 1: Did the migration go well?

Run `/adopt-routed-workflow` on at least two repos: one in **setup mode** (no docs) and one in **migration mode** (existing docs).

| Check | How | Pass when |
|---|---|---|
| Nothing lost | `coverage.py` (migration mode) | Every reported line is explained |
| Structure valid | `node scripts/check-docs.mjs` | Passes, and fails when a link, header, or plan status is broken on purpose |
| Project still works | The project's own checks | Pass |
| Routing makes sense | Read `AGENTS.md` and its routing table yourself | *You* would know where to look for each area |
| Effort | Count interruptions and time | Few questions, all justified |

> [!note]
> Part 1 shows the **skill** works. It says nothing about whether agents work better afterwards; that's Part 2.

## Part 2: Do agents do as well with less context?

### Setup: an A/B comparison with git

- **A (before):** the commit before the docs were restructured.
- **B (after):** the commit after.
- Use a **separate git worktree** for each so both can exist at once:
  ```bash
  git worktree add ../repo-A <commit-before>
  git worktree add ../repo-B <commit-after>
  ```
- Run every task in a **fresh session**, **three or more times per version**. Agent runs vary a lot, so one run of each proves nothing.
- Use the **same prompt** in both versions, and don't mention the rule being tested.

### Three kinds of test, cheapest first

#### a. Knowledge probes: the early warning

Ask questions whose answers now live **only in routed docs**, not in `AGENTS.md`. Score whether the answer is right, and whether the agent opened the right doc to find it.

> [!example]- Example probes (from the finance dashboard)
> | Question | Correct answer comes from |
> |---|---|
> | "Can I store a daily closing price in the `ledger` schema?" | Data-plane rules: no, it belongs in `world.*` |
> | "How should I store the date of a CSV transaction that has no time?" | Data conventions: a `date`, never a made-up midnight timestamp |
> | "Which institutions can we place trades through?" | `institutions.md`: Schwab only for equities |
> | "What must you do before calling a task done?" | The Definition of Done |
> | "Where is the reasoning for why news can't influence strategies?" | Architecture overview |
> | "What happens if the YNAB label key is lost?" | Security and keys doc |

Write eight to ten probes spread across the routing table's rows.

#### b. Trap tasks: rules the prompt doesn't mention

Small coding tasks where a routed rule matters but the prompt doesn't say so. Score whether the agent followed the rule **without being reminded**.

> [!example]- Example traps
> - *"Add an endpoint that renames an account."* Correct: append a new revision; the ledger is append-only, so no `UPDATE`.
> - *"Parse this dollar amount from a CSV."* Correct: decimal strings, never `parseFloat`.
> - *"Store the price we got for a stock purchase."* Correct: a fill price is ledger data, not market data.

#### c. Real units: the realistic test

Plan and implement the **same small feature** in both versions:

- **A:** your old way of prompting.
- **B:** `/plan-unit` → approve → a fresh session → `/implement-plan`.

This is expensive, so one or two units is enough to start.

### What to record for every run

| Metric | What it tells you |
|---|---|
| **Correct?** (probe answer right, or tests and acceptance criteria pass) | The main outcome |
| **Rule violations** | Whether a rule is now out of the agent's sight |
| **Right docs opened?** (read the transcript) | Whether routing works |
| **Questions or stops,** and whether each was justified | Autonomy |
| **Docs updated at the end?** (status, history, plan record) | Whether the Definition of Done works |
| **Tokens, cost, turns, time** | Efficiency |
| **Rework:** how much you had to fix | Hidden cost |

> [!tip] Automating the runs
> Claude Code's headless mode lets you script this. For example, running `claude -p "<prompt>" --output-format json` in each worktree prints a JSON result that, as far as I know, includes cost, turns, and duration. Check the exact field names on your version. A small script can run each probe N times in both worktrees and put the results in a table. Headless runs still spend API or plan usage.

## Reading the results

| Result | Meaning | Action |
|---|---|---|
| Same accuracy, fewer tokens | **The design works** | Keep it |
| Lower accuracy on probes or traps | A rule was routed away from where agents look | Move that rule back into `AGENTS.md`, or make its routing row clearer, then re-test |
| Right answers but wrong docs opened | Routing works by luck | Improve the `read_when` lines or the routing rows |
| Slower real units, but no rework and complete docs | Better quality for more time | Your call |
| More stops in B | The plan template is missing something | Add it to *Decisions already made* or *Required reading* |

> [!important] Fix the specific failure, not the whole design
> A regression almost always points to one rule or one routing row. Move that single rule back into the contract rather than going back to loading everything.

## Suggested order

1. **Knowledge probes** on the finance dashboard, A vs B. Quick, and it tests the riskiest part first.
2. **Three trap tasks.**
3. **`/adopt-routed-workflow`** on another repo (migration mode), then run the same kind of probes there.
4. **One real unit** with `/plan-unit` and `/implement-plan`.
5. Record everything in the Evaluation log below and in [[Documentation-Routed Agentic Coding#Evaluation log]].

## Evaluation log

> [!question] Knowledge probes
> | Probe | A correct (n/3) | B correct (n/3) | B opened the right doc? | Notes |
> |---|---|---|---|---|
> | | | | | |

> [!question] Trap tasks
> | Trap | A followed the rule (n/3) | B followed the rule (n/3) | Notes |
> |---|---|---|---|
> | | | | |

> [!question] Real units
> | Unit | Version | Passed? | Stops (justified?) | Docs updated? | Tokens / cost | Time | Rework |
> |---|---|---|---|---|---|---|---|
> | | | | | | | | |

> [!question] Migration runs (Part 1)
> | Repo | Mode | Coverage clean? | Checks pass? | Routing sensible? | Interruptions | Default tokens before → after |
> |---|---|---|---|---|---|---|
> | | | | | | | |
