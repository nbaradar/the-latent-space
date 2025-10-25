---
title: Obsidian MCP Server
tags:
  - obsidian
  - mcp
  - lab
  - ai/ml
draft:
---
> [!info] Reference: [[MCP Overview]] | [[Build an MCP Server]]

>[!tip]- Update: [GitHub Repo for this MCP Server](https://github.com/nbaradar/obsidian-mcp-server) 
>- https://missingham.net/Research-Notes/Agentic-Workflows-in-Obsidian

Notes I take while I create an MCP server that can hook up to my personal obsidian vault (`nader_obsidian_vault`). This is just a general vault with random notes in it. Going to use Claude Desktop as the client for now.

Later I will make more sophisticated MCP servers that connected to themed vaults like "mental health." Sort of like a "Project" in ChatGPT but more powerful/dynamic. Will need to build my own client most likely, unless OpenAI has released a client. 

---
# MCP Server v1.0 - CRUD Operations, Vault Selection, Session Management
I'm going to build this server with the Python SDK. Also remember that you can use the "uv" python package manager and "FastMCP" to make your life easier.

So what does my server need at a minimum for now? I don't think prompts are necessary yet. Maybe later. 
- Resources: The markdown files in my obsidian vault
- Tools: A variety of tools that allow me to manipulate the markdown files

What tool calls? It needs CRUD operations on files
- Create (create_file)
- Read (read_file)
- Update (update_file)
- Delete (delete_file)

list_files
search_files: this could help save on token usage. We need to be smart about tokens. 

I'm thinking for now each can be it's own tool call. But maybe later when I create tools like "update_news_for_month()" I can move the CRUD operations into helper functions instead and just call the helper functions in the right order from the tool call. 
## Minimal v1 = 6 Tools
1. `create_file`
2. `read_file`
3. `update_file`
4. `delete_file`
5. `list_files`
6. `search_files`

Alright first I'll create a skeleton of the MCP server, and then I'll use Codex to start implementing everything. 
You can see the AGENTS.md file here. I created it with the help of ChatGPT

Holy shit it works!!!
![[Pasted image 20251024175607.png|700]]
## Multi-Vault capability with contextual understanding

Right now though, my vault path is just a constant in my server:
```python
# Constants
VAULT_PATH = Path("/Users/naderbaradar/Library/Mobile Documents/iCloud~md~obsidian/Documents/nader_obsidian_vault/nader_obsidian_vault")
```

I don't like how inflexible this is. I have a lot of different vaults I want to access. If I want to expose the vault how can I do that? OR should I just create a bunch of vaults? OR I could create a "vault" resource that gets dynamically updated based on the query the user makes? Like if I say "update my personal vault" VS "update my work vault" 

Okay, I'm going to implement config-driven multi vault support. 
- Session Tracking of Vault inside of MCP sessions Context Object. 
	- MCP tool call arrives with a [Context](https://gofastmcp.com/servers/context) object. This is through FastMCP
	- When we call `set_active_vault`, we will remember the preference for subsequent requests.
- Vault "Allow List" through a config file with detail for the MCP client
- Active vault tracking 
- Implement logging
	- On all helpers
	- CRUD operations
	- when a sessions active vault changes
- Add new management tools
	- list_vaults 
	- set_active_vault

The allowlist would look something like this:
```yaml
default: nader
vaults:
	nader:
		path: "/Users/naderbaradar/Library/Mobile Documents/iCloud~md~obsidian/Documents/nader_obsidian_vault/nader_obsidian_vault"
		description: "Primary personal vault"
	quartz:
		path: "/Users/naderbaradar/Library/Mobile Documents/iCloud~md~obsidian/Documents/quartz-vault/quartz/content"
		description: "Blog vault. Called The Latent Space. Made using Obsidian and Quartz."
```

So now, I can just ask claude "Hey go to my quartz vault and do x" and it will know how to switch between them per session based on the allow list. And logging is robust. 

And it works!!
![[Pasted image 20251024185004.png|700]]
![[Pasted image 20251024185145.png|700]]

---

>[!warning]  TODO: Remote Server
>So that's the end of development for v1. But I still want to connect it to ChatGPT. And unfortunately to do that, I need to create a REMOTE server
>
>https://platform.openai.com/docs/mcp
>
>They only let you connect to remote servers via HTTP, but I'm using STDIO. So I still need to make this a remote server at some point.

---
# MCP Server v1.1 - Token Efficient Full Vault Search
Let's create a token efficient full-text search so we can look through the entire selected vault. 

| Approach                        | Tokens per 10 files | Speed     | Accuracy |
| ------------------------------- | ------------------- | --------- | -------- |
| Return full content             | ~50,000             | Slow      | High     |
| Return snippets (200 chars)     | ~1,500              | Fast      | High     |
| Return paths only               | ~100                | Very fast | Medium   |
| Two-phase (overview → snippets) | ~300                | Fast      | High     |

Instead of returning full files, instead just return contextual snippets around matches for the search term
**Bad approach (high tokens):**
```json
{
  "results": [
    {
      "path": "note1.md",
      "full_content": "... entire 5000 word note ..."  // 😱 ~7000 tokens
    }
  ]
}
```
**Good approach (low tokens):**
```json
{
  "results": [
    {
      "path": "note1.md",
      "match_count": 3,
      "snippets": [
        "...context before MCP server query match context after...",  // ~50 tokens
        "...another match...",
        "...third match..."
      ]
    }
  ]
}
```

Maybe I should implement both but default to snipping unless the user specifies to grab the FULL file. And that can just be two different tools. 

Okay I'm going to create two tools:
- search_content -> snippet based (fast, default)
- read_file -> full content (when needed)

Claude can choose which tool to use based on the query. 

**Natural workflow:** 
1. User: "Find notes about MCP" 
2. Claude calls `search_content("MCP")` → gets snippets 
3. Claude shows results to user 
4. If user wants more: "Can you read the full [[MCP Overview]] note?" 
5. Claude calls `read_file("Notes/MCP Overview.md")`

Alright so I implemented the search_content tool, and it works!
![[Pasted image 20251024220710.png]]

---
# MCP Server v1.2 - Enhanced File Modifications (Phase 1)

>[!tip] Realized I should use the [MCP Builder Skill](https://github.com/anthropics/skills/blob/main/mcp-builder/SKILL.md)
> 
> I'm using the web based skills (through Chat interface), but you could also just copy the skills provided officially by Anthropic [here](https://github.com/anthropics/skills/) into your codebase so ClaudeCode can access them too.

Right now I only have 1 tool to modify files. Let's update that tool to combine a bunch of related operations. 
We should combine them for better Token Efficiency:  [[MCP Overview#Token Efficiency]]

Right now we just have 1 tool: `update_file`. Let's break this up into operations. 
Remember that **Markdown is structure-based, not position-based**. This means line numbers are fragile so agents struggle with arbitrary numeric positions.

Brainstorming
- `replace_note` (which already exists as `update_file`)
- `append_to_note`
- `prepend_to_note`
- `insert_after_heading`
- `insert_before_heading`
- `rename_heading`
- `move_section`: reorder section in a note
- `replace_section`: replace content under a specific heading
- `delete_section`: remove a heading and its content
- `update_frontmatter`: dedicated YAML frontmatter handler 

After Planning
The 6 core operations
- ✅ **replace_note** - Already exists as `update_file`
- ✅ **append_to_note** - Simple, common use case
- ✅ **prepend_to_note** - Simple, common use case
- ✅ **insert_after_heading** - Key structured operation
- ✅ **replace_section** - High-value for targeted updates
- ✅ **delete_section** - Clean way to remove content

4 Advanced operations for phase 2
- ⚠️ **insert_before_heading** - Useful but less common than `insert_after_heading`
- ⚠️ **rename_heading** - Nice-to-have, but agents can read → replace
- ⚠️ **move_section** - Complex to implement correctly (what about nested headings?)
- ⚠️ **update_frontmatter** - Valuable but needs careful YAML parsing/validation

Additional considerations:
- Support markdown headings (###)
- match heading text with case insensitivity
- strip leading/trailing whitespace from headings
- Define section boundaries
	- A section ends at the next heading of EQUAL OR HIGHER VALUE
	- So this means ### ends at the next ###, ##, or #
- Error messages 
- Response formatting
- logging

Implementation complete. Now let's test it through Claude Desktop MCP Client. My tool list is getting kinda long 😅
![[Pasted image 20251025162915.png]]

Actually I'm going to create a test vault and use that just in case. Here's what my config file looks like now. Remember, this is how Claude knows which vault to pick and where they are.
```yaml
default: nader
vaults:
	nader:
		path: "/Users/naderbaradar/Library/Mobile Documents/iCloud~md~obsidian/Documents/nader_obsidian_vault/nader_obsidian_vault"
		description: "Primary personal vault"
	quartz:
		path: "/Users/naderbaradar/Library/Mobile Documents/iCloud~md~obsidian/Documents/quartz-vault/quartz/content"
		description: "Blog vault. Called The Latent Space. Made using Obsidian and Quartz."
	test:
		path: "/Users/naderbaradar/Library/Mobile Documents/iCloud~md~obsidian/Documents/test"
		description: "A test vault for trying out new MCP tools, ideas and plugins."
```

My test query. 
```text
Can you try creating a new note in my test vault called "MCP test" that includes this content? Also can you validate the markdown content I give you and fix anything that is broken before finalizing the new note?

# Heading test
I made this note through the claude desktop client with MCP. Testing out my local server capability

## Can we make multiple headings?

### I Hope so

###Let's test if it can validate markdown?
```

And the result:
I'll create a note in your test vault with validated and corrected markdown content. Let me first check your available vaults, then create the note with the fixes needed.Great! I can see your "test" vault. Now let me create the note with corrected markdown. I found one issue in your markdown:

**Issue found:** `###Let's test if it can validate markdown?` is missing a space after the `###`

Here's the corrected version I'll use:Perfect! ✓ I've successfully created the "MCP test" note in your test vault.

**Markdown validation completed:**

- **Fixed:** Added missing space in `### Let's test if it can validate markdown?` (was `###Let's...`)
- All other markdown syntax was correct

The note has been created at: `/Users/naderbaradar/Library/Mobile Documents/iCloud~md~obsidian/Documents/test/MCP test.md`

Now let's see if the note looks good
![[Pasted image 20251025164148.png|700]]

Perfect, thats exactly what we want. 

---
# MCP Server vTODO - Enhanced File Modifications (Phase 2)
I'll implement this later. 
4 Advanced operations for phase 2
- ⚠️ **insert_before_heading** - Useful but less common than `insert_after_heading`
- ⚠️ **rename_heading** - Nice-to-have, but agents can read → replace
- ⚠️ **move_section** - Complex to implement correctly (what about nested headings?)
- ⚠️ **update_frontmatter** - Valuable but needs careful YAML parsing/validation

---
# MCP Server v1.3 - Frontmatter Manipulation

---
# MCP Server v1.4 - Tagging Automation Tool
Next let's implement a tool that can automatically tag notes based on the content of the note and available tagging options. So an example query would look like
> "tag my notes about machine learning" → Claude reads notes → decides on tags → applies them. 
> "go through notes in the "obsidian" folder and make sure they are all tagged with at least 1 of the seven main tag categories" → Claude reads notes → decides on tags → applies them. 

Users should also be able to refine tags during conversation as well
> "Actually, use the deep-learning tag for the Reinforcment Learning note"

---
## TASKS FOR LATER
### ~~Add Tools to Modify a File (Token Efficiency)~~
Make sure the tool enables the model to insert if the user says "can you update right after the section on blah"
### Markdown Validation 
Use a prompt resource with system instructions on the markdown spec
### Tool Annotations
Should add [[MCP Overview#[Tool Annotations](https //modelcontextprotocol.io/specification/2025-06-18/schema toolannotations)|tool annotations]] to all your tools
### Pydantic Input Validation - Recommended
The `mcp_builder` skill strongly recommends using [[Pydantic]] models for input validation rather than plain parameters. This provides:
- Automatic validation
- Better error messages
- Schema generation for MCP
- Field constraints and descriptions
### Backlink Automation
Look inside of the Concepts folder and then automatically search through all notes and create backlinks where necessary. 
NOTE: Actually this can just be a standalone script. It doesn't need to be a tool. Tools should be like a complete task or a workflow. 
### Token Counting for Operations
Some way to indicate how many tokens an operation took. Could even be debug logs for now. (`/Users/naderbaradar/Library/Logs/Claude`)

