---
title: Documentation-Routed Agentic Coding
tags:
  - ai/ml
  - agentic-coding
  - claude
  - workflow
  - guide
draft:
created: 2026-09-25

modified: 2026-09-25
published: 2026-09-25

---
> [!abstract] TL;DR
> A way to structure a repo's docs so a coding agent loads a **small contract** by default and **routes itself** to deeper docs only when needed. Paired with a four-stage workflow — **design → plan → implement → finish** — where the owner and agent design a unit of work together, then an agent implements it alone and finishes with a **Definition of Done**. Tests keep the docs accurate.
>
> Built and first used with [[Claude Code]] on a solo TypeScript / Postgres project (a personal finance dashboard).

> [!info] Status
> **Set up, not yet battle-tested.** The skills below had not been run on a real unit of work when this was written. See [[#Evaluation log]] for results as I test it against other workflows.

## The problem

My agent guidance had grown into two big files: `AGENTS.md` (rules plus a running changelog) and `PLAN.md` (vision plus a phase log). The agent loaded both at the start of every session:

- **~26,500 tokens** before any work began, mostly history the agent didn't need
- a rule saying *"update both files after every change"* that made them **grow with every unit of work**
- no clean way to **design something together, write it down, and hand it to an agent** to implement on its own

## The core idea

Split documentation into three layers, and let a routing system decide what gets loaded when.

| Layer | What | When it loads |
|---|---|---|
| **Contract** | `AGENTS.md`: rules that always apply + a routing table | Every session |
| **Topic docs** | `docs/…`: each has a small header describing itself | On demand, via routing |
| **Work artifacts** | RFCs (*why*), plans (*how*), status (*now*), history (*then*) | When working a unit |

> [!tip] One fact, one owner
> Every fact lives in exactly one document. Everything else **links** to it instead of copying it. Most documentation bloat is the same fact copied into three places.

## Repository layout

```text
CLAUDE.md                 "@AGENTS.md", so Claude Code loads the contract automatically
AGENTS.md                 rules + "Where to look" routing table + workflow + Definition of Done
PLAN.md                   vision, non-goals, phases, open decisions
README.md                 for humans: capabilities table, setup, troubleshooting
docs/
  README.md               full index: each doc and when to read it
  status.md               current state + next plan (replaced each unit, never appended)
  history.md              one dated entry per completed unit
  architecture/           overview, data model, modules, security, safety, UI, hosting…
  decisions/              RFCs / ADRs + index and conventions
  plans/                  implementation plans + TEMPLATE.md + index with statuses
  future/                 deliberately deferred work
.claude/skills/
  plan-unit/              design → write a plan
  implement-plan/         implement an approved plan → run the Definition of Done
  project-status/         a short status report
.github/pull_request_template.md
tests/documentation.test.mjs
```

### Who reads what

| File | Audience | Loaded |
|---|---|---|
| `AGENTS.md` | Agents | Every session (via `CLAUDE.md`) |
| `docs/*` | Agents | When the routing table or index points there |
| `PLAN.md` | Owner + agents | When planning or checking the roadmap |
| `README.md` | Owner / GitHub | Agents only for troubleshooting, or when updating it |

> [!note] Claude Code quirk
> Claude Code reads `CLAUDE.md`, not `AGENTS.md`. A one-line `CLAUDE.md` containing `@AGENTS.md` keeps the shared `AGENTS.md` convention (read by Codex, Cursor, and others) working in Claude Code too.

## Routing: how the agent finds context

Two layers, similar to how skills work: the agent reads short descriptions, then decides what to open.

### 1. A routing table in `AGENTS.md`

```markdown
| Working on…                        | Read first                                        |
|------------------------------------|---------------------------------------------------|
| What to build next                 | docs/status.md, then the plan it names            |
| Designing a unit of work           | docs/plans/README.md, docs/plans/TEMPLATE.md      |
| Ledger schema, money, transactions | docs/architecture/ledger-model.md, RFC 0001       |
| Connectors, sync, provider access  | docs/institutions.md, RFC 0003, RFC 0004          |
| Local setup failures               | README.md, Troubleshooting section only           |
| Anything else                      | docs/README.md (full index)                       |
```

Paths are **plain text, not Markdown links**. The file is for the model; plain paths cost fewer tokens and read just as well.

### 2. A header on every doc

```yaml
---
summary: What this document covers
read_when: The situations in which an agent should open it
---
```

`docs/README.md` is a list of each document and its `read_when`. The agent scans those one-liners the same way it scans skill descriptions.

## The workflow

```mermaid
flowchart LR
    A[Design<br/>owner + agent] -->|boundary change?| R[RFC<br/>accepted]
    A --> P[Plan<br/>Draft]
    R --> P
    P -->|owner approves<br/>no open questions| AP[Approved]
    AP -->|/implement-plan| IP[In progress<br/>agent alone]
    IP --> DoD{Definition<br/>of Done}
    DoD -->|all items true| D[Done]
    DoD -->|something missing| IP
```

1. **Design** *(together)*. If the unit changes an architectural boundary (e.g., a new core table), write an **RFC** first and accept it.
2. **Plan** *(together)*. `/plan-unit` writes `docs/plans/NNNN-title.md` from the template. It stays **Draft** until approved and its *Open questions* section is empty.
3. **Implement** *(agent alone)*. `/implement-plan NNNN` refuses anything not **Approved**, sets it **In progress**, loads the plan's required reading, and builds it.
4. **Finish** *(agent alone)*. Runs the **Definition of Done** before saying it's finished.

> [!important] Plan lifecycle
> `Draft → Approved → In progress → Done` (or `Superseded`). At most **one** plan is in progress at a time, and `status.md` links to it.

### The plan template

Every section exists so the implementing agent can work **without asking**:

| Section | Purpose |
|---|---|
| **Goal** | What becomes true when it's done |
| **Scope / Non-goals** | Non-goals are a *hard boundary* |
| **Required reading** | Specific docs and code, and what to look for in each |
| **Decisions already made** | Settled choices the agent must not ask about again |
| **Open questions** | Must be empty before approval |
| **Steps / Acceptance criteria** | Ordered steps; checkable boxes |
| **Tests required / Verification** | Behaviours to prove; commands to run |
| **Documentation to update** | A checklist specific to this unit |
| **Stop and ask if** | Halt conditions specific to this unit |
| **Completion record** | Date, verified counts, deviations, what wasn't verified, follow-ups |

> [!tip] The two sections that make agents autonomous
> **Decisions already made** stops the agent from asking again. **Non-goals** stops it drifting into neighbouring work.

### Definition of Done

Lives in `AGENTS.md`, so every agent sees it, even without the skill:

- [ ] Plan acceptance criteria met and checked off
- [ ] Format, lint, typecheck, tests, and build pass (+ integration tests / schema-drift checks when relevant)
- [ ] Every doc in the plan's *Documentation to update* is updated
- [ ] `status.md` **replaced**, not appended; `history.md` gets **one** dated entry
- [ ] README updated if a user-visible capability, setup step, or known problem changed
- [ ] Plan set to **Done**, with its Completion record
- [ ] Anything unverified (e.g., *"UI not tried in a browser"*) is stated explicitly

> [!warning] Why "replace" and "one line" matter
> *"Update X after every change"* grows X forever. **Replace** current-state files and **append one line** to logs; that's what stops the always-loaded context from growing again.

## The skills

> [!example]- `/plan-unit`: design → plan
> - Gathers context through the routing table; opens only relevant docs and code
> - Recommends **one** smallest cohesive unit (not a survey of options)
> - Asks only questions whose answers change the plan
> - Drafts an RFC if a boundary changes and gets it accepted first
> - Writes the plan from the template, updates the plans index and `status.md`
> - Runs the doc checks and reports the path, status, and open questions

> [!example]- `/implement-plan <n>`: implement → finish
> - Refuses a plan that isn't **Approved**, or when another plan is **In progress**
> - Loads the plan's required reading and related RFCs
> - Follows *Decisions already made*; treats *Non-goals* as hard limits
> - Keeps out-of-scope work as follow-ups instead of doing it
> - **Stops** when reality contradicts the plan, instead of quietly redesigning
> - Runs verification, checks off criteria only when proven, completes the Definition of Done
> - Reports what was built, verified counts, what wasn't verified, deviations, and follow-ups

> [!example]- `/project-status`: a cheap status report
> Reads **only** `status.md`, the plans index, the last two history entries, and `git log` / `git status`. Outputs at most about 12 lines:
> ```text
> Last built:  …
> In progress: …
> Plans:       …
> Next up:     …
> Needs you:   …
> Repo:        …
> ```

## Enforcement: tests that keep the docs accurate

A documentation test file runs with the normal unit tests and **fails** when:

- a doc is missing its `summary` / `read_when` header
- a doc isn't listed in an index
- a relative link, or a path named in `AGENTS.md`, points to a missing file
- a plan's status is invalid, or doesn't match the plans index
- an Approved (or later) plan still has open questions
- more than one plan is In progress, or `status.md` doesn't link the one that is
- `CLAUDE.md` stops loading `AGENTS.md`

> [!caution] Limitation
> Tests check **structure**, not **content**. Nothing proves `status.md` was updated *meaningfully*; that still depends on the checklist, the skill, and a human reviewing the PR against the template.

## Migrating an existing project

What worked for moving two bloated files into this structure without losing anything:

1. **Move text word for word first; condense later.** A script copied line ranges from the old files into the new ones.
2. **Check nothing was lost.** Compare every non-blank line of the originals against the new files, and look at each mismatch: formatting, a renamed heading, a rewritten link, or content that was genuinely out of date.
3. **Drop only exact duplicates** during the move.
4. **Condense in a separate pass.** Start with what loads by default, then the largest on-demand files.
5. **Measure** before and after.

## Results

> [!success] Context loaded at session start dropped ~76%

| What loads | Before | After |
|---|---|---|
| Session start | ~26,500 tokens | **~6,300** (−76%) |
| `AGENTS.md` alone | ~10,700 | **~3,700** (−65%) |
| Planning session starting set | — | **~5,550** |
| History / changelog doc | ~9,700 | **~4,400** (−55%) |
| All documentation | ~50,800 | ~55,300 (+9%, none loaded by default) |

*Estimates: characters ÷ 4, not tokenizer counts.*

## Lessons learned

- **Changelogs don't belong in always-loaded files.** Git and a history doc already hold that.
- **Formatters can quietly inflate tokens.** Prettier padded every Markdown table cell to the widest one; switching an index from a table to a list saved ~60%.
- **Keep human docs and agent docs separate.** The README is for people; agents open it only for troubleshooting.
- **Write rules and reasoning in different places.** Rules go in the always-loaded contract; the reasoning goes in topic docs the agent opens when it needs the *why*.
- **Tell agents what's already decided.** Most mid-task interruptions are the agent asking about something already settled.

## Evaluation log

> [!question] To fill in as I test this against other workflows
> | Metric | Result |
> |---|---|
> | Units run | |
> | Finished without asking me anything? | |
> | Stops, and were they justified? | |
> | Docs actually updated at the end? | |
> | Planning time vs. implementation time | |
> | Tokens / cost per unit | |
> | Where the plan template fell short | |
> | Compared with other workflows | |
