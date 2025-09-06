---
title: MCP Overview
tags:
  - mcp
  - ai/ml
  - reference
draft:
---
>[!info] Relevant Links
>[MCP Documentation](https://modelcontextprotocol.io/introduction)
>[Official MCP Github Servers and Libraries](https://github.com/modelcontextprotocol)
## Overview 
The **[[Model Context Protocol]]**, created by [[Anthropic]], is a **protocol** that enables an LLM to communicate with/leverage external data and tools. 

[From their site:](https://www.anthropic.com/news/model-context-protocol):
> It provides a universal, open standard for connecting AI systems with data sources, replacing fragmented integrations with a single protocol. It follows client/server patterns.
> The architecture is straightforward: developers can either expose their data through MCP servers or build AI applications (MCP clients) that connect to these servers.

You can also think of this analogy:
> **MCP like a USB-C port for AI applications.** 
> Just as USB-C provides a standardized way to connect your devices to various peripherals and accessories, MCP provides a standardized way to connect AI models to different data sources and tools.

---
## Main Components
There are 2 main components 
- **MCP Clients:** These are like the AI app that want to access custom date. So Claude Desktop comes with it's own MCP client that can access servers. If you create your own custom chatbot for a company you'd need to also implement an MCP client for that custom chatbot
- **MCP Servers:** These are the custom resources themselves. But more than that, these servers are basically a way to interact with different data/apps. 

MCP Servers contain:
- Resources: data, filesystem, database, etc
- Tools: function, API, image processing, etc
- Custom Prompts: templates

---
## Example Use Case
So think of having a local workflow where you want to use MCP to accomplish email tasks through Claude Desktop.
You already have an MCP client via Claude Desktop, but you'll need to create your own MCP server. 

What will your MCP server contain?
- Custom prompt 
	- "Virtual Assistant Global Prompt": A system prompt for your email assistant. 
- Resources
	- Email outlines in the form of Markdown files
		- `3-way-into.md`
		- `call-follow-up.md`
		- `schedule-meeting.md`
	- A directory of contacts in the form of CSV files
		- `directory.csv`
- Tools
	- Access to gmail API
		- Will save a draft to gmail using a tool call `write-email-draft`

Then once you go into Claude Desktop and configure it to use your custom MCP server, it will list the tools and resources it sees. You can add those to your prompt.

---
