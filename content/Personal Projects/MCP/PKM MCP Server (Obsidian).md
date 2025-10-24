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

>[!tip] Update: [GitHub Repo for this MCP Server](https://github.com/nbaradar/obsidian-mcp-server) 

Notes I take while I create an MCP server that can hook up to my personal obsidian vault (`nader_obsidian_vault`). This is just a general vault with random notes in it. Going to use Claude Desktop as the client for now.

Later I will make more sophisticated MCP servers that connected to themed vaults like "mental health." Sort of like a "Project" in ChatGPT but more powerful/dynamic. Will need to build my own client most likely, unless OpenAI has released a client. 

---
# MCP Server v1
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
![[Pasted image 20251024175607.png]]

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

And it works!
![[Pasted image 20251024185004.png]]
![[Pasted image 20251024185145.png]]

---
## Remote v1 Server
So that's the end of development for v1. But I still want to connect it to ChatGPT. And unfortunately to do that, I need to create a REMOTE server

https://platform.openai.com/docs/mcp

They only let you connect to remote servers via HTTP, but I'm using STDIO. So let's make this a remotely accessible server.

