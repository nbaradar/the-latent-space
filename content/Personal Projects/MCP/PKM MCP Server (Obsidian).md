---
title: Obsidian MCP Server
tags:
  - obsidian
  - mcp
  - lab
  - ai/ml
draft:
---
> [!info] Reference: [[MCP Overview]]

Notes I take while I create an MCP server that can hook up to my personal obsidian vault (`nader_obsidian_vault`). This is just a general vault with random notes in it. Going to use Claude Desktop as the client for now.

Later I will make more sophisticated MCP servers that connected to themed vaults like "mental health." Sort of like a "Project" in ChatGPT but more powerful/dynamic. Will need to build my own client most likely, unless OpenAI has released a client. 

---
So what does my server need at a minimum for now? What tool calls? 

It needs CRUD operations on files
- Create (create_file)
- Read (read_file)
- Update (update_file)
- Delete (delete_file)

list_files
search_files

I'm thinking for now each can be it's own tool call. But maybe later when I create tools like "update_news_for_month()" I can move the CRUD operations into helper functions instead and just call the helper functions in the right order from the tool call. 
## Minimal v1 = 6 Tools
1. `create_file`
2. `read_file`
3. `update_file`
4. `delete_file`
5. `list_files`
6. `search_files`

