---
title: Obsidian MCP Server
tags:
  - obsidian
  - mcp
  - lab
  - ai/ml
  - projects
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
# Open AI MCP Client
At the moment they [only support local MCP Server for business plan users](https://help.openai.com/en/articles/12584461-developer-mode-and-full-mcp-connectors-in-chatgpt-beta). Otherwise you have to connect to a Remote MCP Server
Also try looking into [Google CloudRun](https://cloud.google.com/run?e=48754805&hl=en) for hosting? 

>[!warning]  TODO: Remote Server
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

>[!question] [[v1.2 Testing]]
## MCP Server v1.2.1 - Enhanced File Modifications (Phase 2)
I'll implement this later. 
4 Advanced operations for phase 2
- ⚠️ **insert_before_heading** - Useful but less common than `insert_after_heading`
- ⚠️ **rename_heading** - Nice-to-have, but agents can read → replace
- ⚠️ **move_section** - Complex to implement correctly (what about nested headings?)
- ⚠️ **update_frontmatter** - Valuable but needs careful YAML parsing/validation

Fix issues found from previous testing:
- [x] [[v1.2 Testing#Issue 1 Missing Newline After `replace_section`]]
- [x] [[v1.2 Testing#Issue 2 Extra Content in Nested Heading Test]]

>[!question] [[v1.2 Testing#v1.2.1 Testing, after fixing issues 1 and 2]]

Everything else is basically already implemented through fixing the issues. Frontmatter will be implemented separately 

## MCP Server v1.2.2 - Minor Updates
- Improve Internal Documentation (Comments and Docstrings)
- Improve MCP Tool Calling 
	- Add this text to tools that need a vault param: `If `vault` is omitted the active vault is used (see `set_active_vault`). Use `list_vaults` to discover names.`
	- **Without this text, Claude might:
		- Call tools with wrong vault repeatedly
		- Not understand the active vault concept
		- Need to retrieve internal code to understand behavior
- Fix Minor issue with Inconsistent Spacing in `append_to_section`. Details in [[v1.2 Testing#Minor Issue Found Inconsistent Spacing in `append_to_section`]]
## MCP Server v1.2.3 - Tooling Doc Update
Tool calling is still somewhat busted, I need to update Tool Docstrings.

I realized this during some testing. I tried testing this process to follow the workflow and track token usage:
```text
Find the most recent note i wrote in my Mental Health folder in my personal vault
```

| Step | Tool Call                                         | Tokens Used | Running Total |
| ---- | ------------------------------------------------- | ----------- | ------------- |
| 1    | `list_vaults()`                                   | ~115        | 115           |
| 2    | `set_active_vault()`                              | ~115        | 230           |
| 3    | `list_obsidian_notes()`                           | ~936        | 1,166         |
| 4    | `search_obsidian_notes()`                         | ~283        | 1,449         |
| 5    | `retrieve_obsidian_note()` (Reflections)          | ~5,841      | 7,290         |
| 6    | `retrieve_obsidian_note()` (Personal Integration) | ~2,753      | **10,043**    |
But then I realized why not just use `search_obsidian_notes()` sooner?
- ✅ `list_vaults()`
- ✅ `set_active_vault()`
- ❌ `list_obsidian_notes()` - **UNNECESSARY** (936 tokens wasted)
- ✅ `search_obsidian_notes()` - **Should have been step 3!**
- ✅ `retrieve_obsidian_note()` (Reflections)
- ✅ `retrieve_obsidian_note()` (Personal Integration)

So I realized I had to update my tool docstrings so the calls would make more sense.

According to the mcp_builder skill (official by Anthropic) tool calls should have around ~500 tokens of docstring per tool.
After doing some extensive research and rewrites and caluclations here's where I've landed
### Final Token Counts

| Version             | Total Tokens | Per Tool | Assessment       |
| ------------------- | ------------ | -------- | ---------------- |
| Current (minimal)   | 580          | 39       | ❌ Too minimal    |
| My first attempt    | 10,114       | 674      | ❌ Too verbose    |
| MCP-Builder target  | 8,160        | 544      | ✅ Good benchmark |
| **✅ Final version** | **3,970**    | **265**  | **✅ Optimal!**   |
>[!example]- What the docstrings look like if you're curious
>```
> MCP-Compliant Tool Docstrings for Obsidian Vault Server
> Following MCP-Builder recommended verbosity: ~500 tokens per tool
> 
> Format follows MCP best practices:
> 1. One-line summary
> 2. 2-3 sentence detailed explanation
> 3. Clear parameter descriptions with examples
> 4. Return schema
> 5. Use-when / Don't-use-when (2-3 examples each)
> 6. Error handling guidance
> 
> # ==============================================================================
> # VAULT MANAGEMENT
> # ==============================================================================
> 
> @mcp.tool()
> async def list_vaults(ctx: Context | None = None) -> dict[str, Any]:
> 	"""List configured Obsidian vaults and current session state.
> 
> Returns metadata for all configured vaults including the default vault
> 
> and currently active vault for this session. Primary entry point for
> 
> vault discovery.
> 
> Returns:
> 
> {
> 
> "default": str, # System default vault name
> 
> "active": str, # Currently active vault (or None)
> 
> "vaults": [
> 
> {
> 
> "name": str,
> 
> "path": str,
> 
> "description": str,
> 
> "exists": bool
> 
> }
> 
> ]
> 
> }
> 
> Examples:
> 
> - Use when: Starting conversation, need to see available vaults
> 
> - Use when: User mentions vault by name, verify it exists
> 
> - Don't use: Already know vault name and just need to switch
> 
> Error Handling:
> 
> - Config file missing â†’ Error with expected config path
> 
> - Invalid config format â†’ Error describing expected YAML structure
> 
> """
> 
> @mcp.tool()
> 
> async def set_active_vault(vault: str, ctx: Context) -> dict[str, Any]:
> 
> """Set the active vault for this conversation session.
> 
> All subsequent tool calls that omit the vault parameter will use the
> 
> active vault. Session state persists for the conversation lifetime.
> 
> Args:
> 
> vault (str): Friendly vault name from vaults.yaml
> 
> Examples: "nader", "work", "personal"
> 
> Use list_vaults() to discover valid names
> 
> Returns:
> 
> {"vault": str, "path": str, "status": "active"}
> 
> Examples:
> 
> - Use when: User says "switch to my work vault"
> 
> - Use when: Starting multi-operation workflow in one vault
> 
> - Don't use: Single operation in another vault (pass vault param directly)
> 
> Error Handling:
> 
> - Unknown vault â†’ Error listing available vaults, suggest list_vaults()
> 
> - Vault path inaccessible â†’ Error with specific path that failed
> 
> """
> 
> # ==============================================================================
> 
> # DISCOVERY & SEARCH
> 
> # ==============================================================================
> 
> @mcp.tool()
> 
> async def list_obsidian_notes(
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """List ALL notes in vault (complete inventory, high token cost).
> 
> Returns every note path in the vault as a sorted flat list. For large
> 
> vaults (100+ notes), this consumes 1000+ tokens. Use search_obsidian_notes()
> 
> for filtered results instead.
> 
> Args:
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {
> 
> "vault": str,
> 
> "notes": [str, ...] # Paths without .md, forward-slash separated
> 
> }
> 
> Token Cost: Small vault (10 notes) ~200 tokens, Large vault (200 notes) ~2000+ tokens
> 
> Examples:
> 
> - Use when: Need complete vault overview, vault is small (<50 notes)
> 
> - Don't use: Looking for specific notes â†’ Use search_obsidian_notes("query")
> 
> - Don't use: Need timestamps/metadata â†’ Coming in future version
> 
> - Don't use: Large vault â†’ Use search_obsidian_notes() to filter first
> 
> Error Handling:
> 
> - Vault not accessible â†’ Error with vault path, use list_vaults()
> 
> - Empty vault â†’ Returns {"vault": "...", "notes": []}
> 
> """
> 
> @mcp.tool()
> 
> async def search_obsidian_notes(
> 
> query: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Find notes matching search pattern (efficient, token-optimized).
> 
> Case-insensitive substring search across note paths/titles. Returns only
> 
> matching notes, making this 70-90% more token-efficient than listing all
> 
> notes when you have search criteria.
> 
> Args:
> 
> query (str): Search string (case-insensitive)
> 
> Examples: "Mental Health", "2025", "Project"
> 
> Searches full path including folders
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "query": str, "matches": [str, ...]}
> 
> Token Cost: ~200-500 tokens (scales with matches, not vault size)
> 
> Examples:
> 
> - Use when: Looking for notes in folder â†’ query="Mental Health"
> 
> - Use when: Finding notes with keywords â†’ query="2025"
> 
> - Use FIRST before list_obsidian_notes() to avoid unnecessary tokens
> 
> - Don't use: Searching note content â†’ Use search_obsidian_content()
> 
> - Don't use: Need metadata (timestamps, size) â†’ Coming in future version
> 
> Error Handling:
> 
> - Empty query â†’ Error: "Search query cannot be empty"
> 
> - No matches â†’ Returns {"matches": []}
> 
> - Vault not accessible â†’ Error with vault path
> 
> """
> 
> @mcp.tool()
> 
> async def search_obsidian_content(
> 
> query: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Search note contents and return contextual snippets (token-efficient).
> 
> Searches inside note files and returns up to 3 snippets per file (200 chars
> 
> each, 100 chars context on each side). Returns top 10 files by match count.
> 
> Designed for preview before full retrieval.
> 
> Args:
> 
> query (str): Search string (case-insensitive)
> 
> Examples: "machine learning", "API design"
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {
> 
> "vault": str,
> 
> "query": str,
> 
> "results": [
> 
> {
> 
> "path": str,
> 
> "match_count": int,
> 
> "snippets": [str, str, str] # Up to 3 snippets
> 
> }
> 
> ] # Up to 10 files, sorted by match_count
> 
> }
> 
> Token Cost: ~800-1500 tokens (vs ~30,000+ to retrieve all matches)
> 
> Examples:
> 
> - Use when: Searching for concepts/topics in notes
> 
> - Use when: Preview before retrieval (saves 90%+ tokens)
> 
> - Workflow: search_obsidian_content() â†’ review snippets â†’ retrieve_obsidian_note()
> 
> - Don't use: Searching titles/paths â†’ Use search_obsidian_notes()
> 
> - Don't use: Need complete text â†’ Use retrieve_obsidian_note() after finding
> 
> Error Handling:
> 
> - Empty query â†’ Error: "Search query cannot be empty"
> 
> - No matches â†’ Returns {"results": []}
> 
> - File read errors â†’ Skips file, continues with others
> 
> """
> 
> # ==============================================================================
> 
> # READ OPERATIONS
> 
> # ==============================================================================
> 
> @mcp.tool()
> 
> async def retrieve_obsidian_note(
> 
> title: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Retrieve complete note content (full markdown).
> 
> Returns entire markdown content of a note. Can be expensive for large
> 
> notes (5000+ tokens). Consider search_obsidian_content() first for preview.
> 
> Args:
> 
> title (str): Note identifier (path without .md extension)
> 
> Examples: "Daily Notes/2025-10-26"
> 
> "Mental Health/Reflections Oct 26 2025"
> 
> Forward slashes for folders, case-sensitive
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {
> 
> "vault": str,
> 
> "note": str,
> 
> "path": str,
> 
> "content": str # Complete markdown content
> 
> }
> 
> Token Cost: Small (500 words) ~1000 tokens, Large (5000+ words) ~8000+ tokens
> 
> Examples:
> 
> - Use when: Need to read full note content
> 
> - Use when: After search to get complete details
> 
> - Workflow: search_obsidian_notes() â†’ retrieve_obsidian_note()
> 
> - Don't use: Just checking if note exists â†’ Use search_obsidian_notes()
> 
> - Don't use: Preview only â†’ Use search_obsidian_content() for snippets
> 
> Error Handling:
> 
> - Note not found â†’ Error with note path, use search_obsidian_notes()
> 
> - Invalid title (../) â†’ Error: "Note title cannot contain '..'"
> 
> - Vault not accessible â†’ Error with vault path
> 
> """
> 
> # ==============================================================================
> 
> # CREATE OPERATIONS
> 
> # ==============================================================================
> 
> @mcp.tool()
> 
> async def create_obsidian_note(
> 
> title: str,
> 
> content: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Create new note with markdown content (fails if exists).
> 
> Creates markdown file in vault. Automatically creates parent folders if
> 
> needed. Fails if note already exists.
> 
> Args:
> 
> title (str): Note identifier (path without .md extension)
> 
> Examples: "Daily Notes/2025-10-27", "Projects/New Project"
> 
> Folders created automatically
> 
> content (str): Full markdown content
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "status": "created"}
> 
> Examples:
> 
> - Use when: Creating new note from scratch
> 
> - Use when: User asks to "create", "make", or "start" a note
> 
> - Don't use: Updating existing â†’ Use replace/append_to_obsidian_note()
> 
> - Don't use: Note might exist â†’ Check with search_obsidian_notes() first
> 
> Error Handling:
> 
> - Note exists â†’ Error, suggest retrieve_obsidian_note() or replace_obsidian_note()
> 
> - Invalid title â†’ Error describing issue
> 
> - Filesystem permission error â†’ Error with details
> 
> """
> 
> # ==============================================================================
> 
> # UPDATE OPERATIONS
> 
> # ==============================================================================
> 
> @mcp.tool()
> 
> async def replace_obsidian_note(
> 
> title: str,
> 
> content: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Replace entire note content (overwrites everything).
> 
> Completely replaces note content with new markdown. Use for rewriting or
> 
> major restructuring. For adding content, use append/prepend instead.
> 
> Args:
> 
> title (str): Note identifier (path without .md extension)
> 
> content (str): New complete markdown content
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "status": "replaced"}
> 
> Examples:
> 
> - Use when: Rewriting entire note from scratch
> 
> - Use when: Major restructuring of note
> 
> - Don't use: Adding content â†’ Use append_to_obsidian_note()
> 
> - Don't use: Editing specific section â†’ Use replace_section_obsidian_note()
> 
> - Don't use: Note doesn't exist â†’ Use create_obsidian_note()
> 
> Error Handling:
> 
> - Note not found â†’ Error, suggest create_obsidian_note() instead
> 
> - Invalid title â†’ Error describing issue
> 
> """
> 
> @mcp.tool()
> 
> async def append_to_obsidian_note(
> 
> title: str,
> 
> content: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Append content to end of note (most efficient for additions).
> 
> Adds content to note end, automatically inserting newline separator if
> 
> needed. Most token-efficient way to add content without reading entire note.
> 
> Args:
> 
> title (str): Note identifier
> 
> content (str): Markdown to append
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "status": "appended"}
> 
> Token Cost: ~200-400 tokens (scales with appended content only)
> 
> Examples:
> 
> - Use when: Adding entries to logs/journals
> 
> - Use when: Appending tasks to lists
> 
> - Efficiency: append = ~300 tokens vs retrieve-modify-replace = ~8000+ tokens
> 
> - Don't use: Adding to beginning â†’ Use prepend_to_obsidian_note()
> 
> - Don't use: Inserting at specific location â†’ Use insert_after_heading
> 
> Error Handling:
> 
> - Note not found â†’ Error, suggest create_obsidian_note() instead
> 
> """
> 
> @mcp.tool()
> 
> async def prepend_to_obsidian_note(
> 
> title: str,
> 
> content: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Prepend content to beginning of note.
> 
> Adds content before existing note content with automatic newline handling.
> 
> Useful for frontmatter, summaries, or reverse chronological entries.
> 
> Args:
> 
> title (str): Note identifier
> 
> content (str): Markdown to prepend
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "status": "prepended"}
> 
> Examples:
> 
> - Use when: Adding frontmatter/metadata at top
> 
> - Use when: Latest entries at top (reverse chronological)
> 
> - Don't use: Adding to end â†’ Use append_to_obsidian_note()
> 
> - Don't use: Most cases (append is more common)
> 
> Error Handling:
> 
> - Note not found â†’ Error, suggest create_obsidian_note()
> 
> """
> 
> # ==============================================================================
> 
> # STRUCTURED EDITING (HEADING-BASED)
> 
> # ==============================================================================
> 
> @mcp.tool()
> 
> async def insert_after_heading_obsidian_note(
> 
> title: str,
> 
> content: str,
> 
> heading: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Insert content immediately after a heading.
> 
> Finds heading (case-insensitive) and inserts content right after it,
> 
> before any existing content or subsections.
> 
> Args:
> 
> title (str): Note identifier
> 
> content (str): Markdown to insert
> 
> heading (str): Heading text (case-insensitive, without # markers)
> 
> Examples: "Tasks", "Meeting Notes", "Summary"
> 
> Matches first occurrence at any level
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "heading": str, "status": "inserted_after_heading"}
> 
> Examples:
> 
> - Use when: Adding content right after heading
> 
> - Use when: Adding intro text to section
> 
> - Don't use: Adding at end of section â†’ Use append_to_section_obsidian_note()
> 
> - Don't use: Replacing section â†’ Use replace_section_obsidian_note()
> 
> Error Handling:
> 
> - Note not found â†’ Error with note path
> 
> - Heading not found â†’ Error, suggest retrieve_obsidian_note() to see structure
> 
> """
> 
> @mcp.tool()
> 
> async def append_to_section_obsidian_note(
> 
> title: str,
> 
> content: str,
> 
> heading: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Append content to end of section (before subsections).
> 
> Adds content to end of heading's direct section content, placing it right
> 
> before any subsections. Different from insert_after_heading which puts
> 
> content immediately after heading line.
> 
> Args:
> 
> title (str): Note identifier
> 
> content (str): Markdown to append
> 
> heading (str): Heading text (case-insensitive, without # markers)
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "heading": str, "status": "section_appended"}
> 
> Examples:
> 
> - Use when: Adding to end of section content
> 
> - Use when: Building up section content incrementally
> 
> - Don't use: Adding right after heading â†’ Use insert_after_heading
> 
> - Don't use: Replacing section â†’ Use replace_section_obsidian_note()
> 
> Error Handling:
> 
> - Note not found â†’ Error with note path
> 
> - Heading not found â†’ Error with heading name
> 
> """
> 
> @mcp.tool()
> 
> async def replace_section_obsidian_note(
> 
> title: str,
> 
> content: str,
> 
> heading: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Replace content under heading (until next same-level heading).
> 
> Replaces everything under a heading until next heading of equal or higher
> 
> level. Preserves the heading itself. Use for rewriting entire sections.
> 
> Args:
> 
> title (str): Note identifier
> 
> content (str): New content for section body
> 
> heading (str): Heading text (case-insensitive, without # markers)
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "heading": str, "status": "section_replaced"}
> 
> Examples:
> 
> - Use when: Rewriting entire section content
> 
> - Use when: Updating outdated section
> 
> - Don't use: Adding to section â†’ Use append_to_section_obsidian_note()
> 
> - Don't use: Removing section â†’ Use delete_section_obsidian_note()
> 
> Error Handling:
> 
> - Note not found â†’ Error with note path
> 
> - Heading not found â†’ Error, use retrieve_obsidian_note() to see structure
> 
> """
> 
> @mcp.tool()
> 
> async def delete_section_obsidian_note(
> 
> title: str,
> 
> heading: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Delete heading and its section (removes heading and all content).
> 
> Removes heading and everything under it until next heading of equal or
> 
> higher level. Heading itself is also deleted.
> 
> Args:
> 
> title (str): Note identifier
> 
> heading (str): Heading text (case-insensitive, without # markers)
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "heading": str, "status": "section_deleted"}
> 
> Examples:
> 
> - Use when: Removing obsolete sections
> 
> - Use when: Cleaning up outdated content
> 
> - Don't use: Clearing content but keeping heading â†’ Use replace_section with empty content
> 
> - Don't use: Deleting entire note â†’ Use delete_obsidian_note()
> 
> Error Handling:
> 
> - Note not found â†’ Error with note path
> 
> - Heading not found â†’ Error with heading name
> 
> """
> 
> # ==============================================================================
> 
> # DELETE OPERATIONS
> 
> # ==============================================================================
> 
> @mcp.tool()
> 
> async def delete_obsidian_note(
> 
> title: str,
> 
> vault: Optional[str] = None,
> 
> ctx: Context | None = None,
> 
> ) -> dict[str, Any]:
> 
> """Delete note completely (permanently removes file).
> 
> Permanently removes note file from vault. Cannot be undone through this
> 
> tool. Always confirm with user before calling.
> 
> Args:
> 
> title (str): Note identifier (path without .md extension)
> 
> vault (str, optional): Vault name (omit to use active vault)
> 
> Returns:
> 
> {"vault": str, "note": str, "path": str, "status": "deleted"}
> 
> Examples:
> 
> - Use when: User explicitly asks to delete note
> 
> - Always confirm with user before deleting
> 
> - Don't use: Removing section â†’ Use delete_section_obsidian_note()
> 
> - Don't use: Clearing content â†’ Use replace_obsidian_note() with minimal content
> 
> Error Handling:
> 
> - Note not found â†’ Error, use search_obsidian_notes() to find correct title
> 
> - Filesystem permission error â†’ Error with details
> 
> """
> 
> # ==============================================================================
> 
> # TOKEN ESTIMATES FOR REFERENCE
> 
> # ==============================================================================
> 
> """
> 
> APPROXIMATE TOKEN COSTS (for documentation):
> 
> Tool Docstrings (sent once per session):
> 
> - Current minimal: ~580 tokens total
>     
> - MCP-recommended: ~7,500 tokens total (~500 per tool)
>     
> - This implementation: ~7,200 tokens total (~480 per tool)
>     
> 
> Common Operations:
> 
> - list_obsidian_notes(): 200-2000+ tokens (vault size dependent)
>     
> - search_obsidian_notes(): 200-500 tokens
>     
> - search_obsidian_content(): 800-1500 tokens
>     
> - retrieve_obsidian_note(): 1000-8000+ tokens (note size dependent)
>     
> - append_to_obsidian_note(): 200-400 tokens
>     
> - Structured edits: 300-600 tokens
>     
> 
> Efficiency Examples:
> 
> - Find + retrieve note: search (300) + retrieve (6000) = 6,300 tokens âœ“
>     
> - List all + retrieve: list (1000) + retrieve (6000) = 7,000 tokens âœ—
>     
> - Content search + retrieve: search (1500) + retrieve (6000) = 7,500 tokens âœ“
>     
> - Retrieve + modify + replace: (6000 + 3000) = 9,000 tokens âœ—
>     
> - Direct append: 300 tokens âœ“
>     
>     """
>
>```

---
# MCP Server v1.3 - Improve Vault Navigation
Currently theres no way to navigate the vault efficiently. Token usage is awful. 
Can we improve navigation by adding new tools for spatial navigation (whats in this folder) and temporal filtering (recent notes). Also how do we explore vault structure?
1. add `include_metadata` flag to existing `list_obsidian_notes()`
2. add `list_notes_in_folder()` with metada
3. add `list_folders()` for browsing
4. add `get_folder_stats()` summary without full listing
##### Token Impact Analysis
**Scenario: 1,000 note vault, 50 notes in "Mental Health" folder**
```text
Find the most recent note i wrote in my Mental Health folder in my personal vault
```

|Approach|Tool Calls|Tokens Transferred|Notes|
|---|---|---|---|
|**Current**|1 + N|~15,000+|List entire vault (1000 paths × ~15 tokens) + retrieve N candidates|
|**With Folders**|3|~800|List folders (~200) + List 50 notes with metadata (~500) + Retrieve 1 note (~100)|
**Savings: ~95% token reduction for targeted queries**
##### Current Implementation Costs
Here's an actual test with the following query and how many tokens it cost:
```text
Find the most recent note i wrote in my Mental Health folder in my personal vault
```

| Step | Tool Call                                         | Tokens Used | Running Total |
| ---- | ------------------------------------------------- | ----------- | ------------- |
| 1    | `list_vaults()`                                   | ~115        | 115           |
| 2    | `set_active_vault()`                              | ~115        | 230           |
| 3    | `list_obsidian_notes()`                           | ~936        | 1,166         |
| 4    | `search_obsidian_notes()`                         | ~283        | 1,449         |
| 5    | `retrieve_obsidian_note()` (Reflections)          | ~5,841      | 7,290         |
| 6    | `retrieve_obsidian_note()` (Personal Integration) | ~2,753      | **10,043**    |
##### Key Problems Exposed
1. **No timestamp data**: I had to retrieve full note contents to determine "most recent"
2. **Inefficient filtering**: Got all 54 notes in vault when I only needed 10
3. **Must retrieve multiple files**: Without metadata, I'd need to check all 10 Mental Health notes (~30,000+ tokens total)
4. **No native "most recent" operation**: Have to fetch everything and sort client-side



---
# MCP Server v1.4 - Frontmatter Manipulation
## MCP Server 1.4.1 - Tagging Automation Tool
Next let's implement a tool that can automatically tag notes based on the content of the note and available tagging options. So an example query would look like
> "tag my notes about machine learning" → Claude reads notes → decides on tags → applies them. 
> "go through notes in the "obsidian" folder and make sure they are all tagged with at least 1 of the seven main tag categories" → Claude reads notes → decides on tags → applies them. 

Users should also be able to refine tags during conversation as well
> "Actually, use the deep-learning tag for the Reinforcment Learning note"

---
# MCP Server 1.5 - Pydantic Input Validation
The `mcp_builder` skill strongly recommends using [[Pydantic]] models for input validation rather than plain parameters. This provides:
- Automatic validation
- Better error messages
- Schema generation for MCP
- Field constraints and descriptions

---
# MCP Server 1.6 - Vault-Aware Prompt Resources

## MCP Server 1.6.1 - Vault-Specific Templates

---
# Brainstorming Features 
### Markdown Validation 
Use a prompt resource with system instructions on the markdown spec
### Tool Annotations
Should add [[MCP Overview#[Tool Annotations](https //modelcontextprotocol.io/specification/2025-06-18/schema toolannotations)|tool annotations]] to all your tools
### Backlink Automation
Look inside of the Concepts folder and then automatically search through all notes and create backlinks where necessary. 
NOTE: Actually this can just be a standalone script. It doesn't need to be a tool. Tools should be like a complete task or a workflow. 
### Token Counting for Operations
Some way to indicate how many tokens an operation took. Could even be debug logs for now. (`/Users/naderbaradar/Library/Logs/Claude`)
[tiktoken](https://github.com/openai/tiktoken?tab=readme-ov-file)
### SQLite indexing

### Cross-vault search

### Vault comparison tools 

### Auto-detect Vaults / Register and Remove Vaults
Script could just check for vaults based on patterns (could expose through tool call). Then ask user if they are vaults or not. 
User then decides which are vaults and which arent. Then update the vault.yaml with the vaults based on the users descriptions. 
Maybe make multiple helper functions and 1 tool call? Not sure.

---
# Additional Notes
**Your Gaps vs. ObsidianPilot:**
- ❌ No SQLite indexing (your search is slower)
- ❌ No regex search
- ❌ No property/frontmatter advanced search
- ❌ No link management (backlinks, broken links)
- ❌ No image support
- ❌ Not published on PyPI
- ❌ No hierarchical tag support
- ❌ Smaller feature set overall

**Your Gaps vs. Enterprise Servers:**
- ❌ No HTTP transport (only STDIO)
- ❌ No auth mechanisms
- ❌ No TypeScript option

**Your Strengths:**
- ✅ Multi-vault session management (unique!)
- ✅ Clean YAML config (vaults.yaml)
- ✅ Heading-aware section operations
- ✅ Token-efficient snippet search
- ✅ FastMCP (Python, modern)
- ✅ Direct filesystem access


