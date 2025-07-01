---
title: prompt Collection
tags:
  - contextstore
  - lab
draft:
---
Create **one unified `prompts` collection** in your `contextcore` DB, with metadata fields that let you filter/scope across use cases.

| **Use Case**                        | **Subsystem**           | **Example**                                                    |
| ----------------------------------- | ----------------------- | -------------------------------------------------------------- |
| System-level operational prompts    | EchoForge, ContextWeave | "Prompt for exporting OpenAI memory"                           |
| User-defined reusable prompts       | User UI                 | "My daily reflection prompt", "Midjourney v6 art style prompt" |
| Personality (Akasha) prompt modules | Akasha                  | "Prompt for simulating Carl Jung", "Therapist coaching style"  |
|                                     |                         |                                                                |

Suggested schema: 
```JSON
{
  "_id": ObjectId,
  "name": "Export OpenAI Memories",
  "content": "Give me a complete, unfiltered, up-to-date export of all of my saved 'notepad' memories...",
  "tags": ["echoforge", "system", "openai", "import"],
  "scope": "system",         // or "user", "akasha", "weave", etc.
  "owner_id": null,          // null for system-level prompts, user ID for personal ones
  "persona_id": null,        // used if tied to an Akasha personality module
  "description": "Prompt used by EchoForge to fetch memory exports from OpenAI.",
  "created_at": "2025-06-29T00:00:00Z",
  "updated_at": "2025-06-29T00:00:00Z",
  "version": 1,
  "active": true
}

```

| Scenario                             | How This Schema Helps                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| 🔁 Reusing prompts across subsystems | Just filter by `tags` or `scope` (e.g., `"scope": "system"` for EchoForge)   |
| 👤 Personal prompt management        | Filter by `owner_id = <user_id>` and `scope = "user"`                        |
| 🧠 Prompt injection via Akasha       | Use `persona_id` and `scope = "akasha"` to attach to a personality module    |
| 🔄 Prompt versioning and rollback    | Add a `version` field or create `prompt_versions` collection for audit trail |
