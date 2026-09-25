# Overview

I want to build a collaborative investment-research agent/workflow.

The goal is **not** to create an autonomous trading bot or have an AI make investment decisions for me. I want something that can perform substantial research tasks, return with findings, and then let me decide what direction to investigate next.

The agent should help me investigate technologies, industries, companies, and possible investment opportunities by tracing relationships between things like:
- technologies and emerging research
- academic papers and researchers    
- companies working on those technologies
- connections between researchers, companies, labs, patents, etc.
- public companies that may benefit economically
- whether those companies actually capture value from the trend
- financial fundamentals and valuation
- arguments against the investment thesis

I am especially interested in situations where the public market may misunderstand the technical implications of an event or new technology.

I also want the workflow itself to be controllable. Part of the reason for building this instead of simply giving a research task to Codex or another general agent is that I want to experiment with things like:
- breaking research into explicit stages
- deciding which models handle which tasks
- controlling context and token usage
- retaining provenance/sources
- adding verification and adversarial reasoning
- deciding when the agent should stop and ask me what to investigate next

## Historical Evaluation Idea

I want to test whether the research process is actually useful.
One possibility is to create **point-in-time historical research simulations**. For example, restrict the system to information that existed before a particular date and ask it to investigate an emerging technology or industry.
Then compare its conclusions with what actually happened afterward.
The important constraint would be preventing future-information leakage. Ideally, the agent should only have access to papers, filings, news, financial data, etc. that were available at the simulated historical date.
This could let me evaluate both the agent and the research methodology rather than simply assuming the workflow produces good-looking reports.

## Current Philosophy

The system should be a **research partner**, not an oracle.
It should help me explore ideas rigorously, surface connections I may have missed, challenge my assumptions, and organize evidence.
I want to design the actual methodology myself as I build and use it.

---
# Initial Contract

## Purpose
Build a collaborative research system for investigating emerging technologies and the companies exposed to them.
The system is **not** intended to autonomously trade or make final investment decisions.
Its job is to perform structured research and return evidence that helps a human decide what deserves deeper investigation.

## Inputs
The initial workflow takes two primary inputs:
- **Computing subdomain**
    - Examples: cloud computing, smartphones, GPUs, cybersecurity, robotics, AI infrastructure
- **Point-in-time cutoff**
    - The system must only use information that was available on or before this date.
## Core Task
Given a computing subdomain and a point-in-time cutoff:

> Identify important technical developments that appear to be moving toward commercialization, map the companies meaningfully exposed to those developments, and rank which companies deserve deeper investment research.
## Expected Output
The research result should include:

- important technical developments within the subdomain
- evidence that those developments are progressing toward commercialization
- companies meaningfully connected to those developments
- evidence explaining each company's exposure
- a ranked shortlist of companies worth investigating further
- uncertainty, missing evidence, and unresolved questions

## Historical Evaluation
The same workflow should operate on both historical and current data
Historical runs should enforce the point-in-time cutoff so that information from the future cannot leak into the research process.

Example evaluation inputs:
- `cloud computing` + `2010-12-31`
- `smartphones` + `2007-06-01`
- `parallel computing / GPUs` + `2011-12-31`

The goal is not simply to check whether the system identifies companies that later became successful.

Evaluation should also examine the quality of the research process itself, including:
- retrieval quality
- source quality and provenance
- temporal leakage
- identification of important technologies
- identification of relevant companies
- unsupported or hallucinated relationships
- quality of commercialization reasoning
- ranking quality
- uncertainty calibration
- unnecessary or repetitive research behavior
## Scope Boundary

For the first version:
> **The human chooses the computing subdomain.**

Discovering which subdomains are themselves worth researching is a separate problem and may become a later workflow or higher-level agent.

The immediate next step is to manually decompose this contract into the tasks I would perform if I were conducting the research myself.