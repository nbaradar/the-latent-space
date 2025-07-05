---
title: ContextStore
tags:
  - projects
  - contextcore
  - contextstore
draft:
---
The database for ContextCore. The reason I have this listed as a "subsystem" of ContextCore is because it's core to the vision: A PRIVATE database that is owned by the user. 

Right now it consists of: 
- MongoDB schema + access layer
- No business logic

Users all have their own ContextStores

Collections:
  - memories
  - imports
  - [[prompts|prompts]]             
  - tags
  - snapshots
  - personas
  - weaves
  - providers
  - logs
