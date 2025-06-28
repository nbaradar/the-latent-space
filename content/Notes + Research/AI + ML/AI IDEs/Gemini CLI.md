---
title: Gemini CLI
tags:
  - lab
  - gemini
  - google
  - ai/ml
draft:
---
>[!important] Relevant Links 
>- [Announcement Blog](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/)
>- [GitHub Repo](https://github.com/google-gemini/gemini-cli)
>- [Gemini CLI Docs](https://cloud.google.com/gemini/docs/codeassist/gemini-cli)
# Overview
Gemini CLI just brings the Gemini family of Models to your terminal. 

It's similar to [[Useful Tools|Warp]] in a lot of ways, which you already use every day (by the way if someone random is reading this, I highly recommend Warp).  **BUT the biggest difference is the AI usage requests per month.**

Warp allows for:
- 150 AI requests / MONTH
- Choice between Claude Sonnet 4, OpenAI o3, and Gemini 2.5 Pro

Whereas Gemini CLI: 
- 1,000 AI requests / DAY
- 60 AI requests / MINUTE
- 1 million token Context Window

---
# Install
Very easy, first ensure you have [Node.js version 18](https://nodejs.org/en/download) or higher installed.

From here you have 2 options. Either you can run the terminal by running the remote package with `npx` OR you can install the package locally with `npm install`

1. Run the CLI: Execute this command in your terminal
	```bash
	npx https://github.com/google-gemini/gemini-cli
	```
2. Install the CLI: Execute these commands in your terminal
	```
	npm install -g @google/gemini-cli
	gemini
	```

I choose to install it locally. Verify that the install worked by listing all your packages globally:
```bash
npm list -g

/Users/naderbaradar/.nvm/versions/node/v22.16.0/lib
├── @google/gemini-cli@0.1.7
├── corepack@0.32.0
└── npm@10.9.2
```

Once done, just type `gemini` into the terminal and you'll see the app start up:
![[Pasted image 20250628151907.png]]

Pick your theme (I went with `Dracula Dark`) and then either log into your Google account or Use an API key. I choose to use an API key. To do this, go to [Google AI Studio](https://aistudio.google.com/)


---
# Use Cases?
Directly from the GitHub ReadMe:
>- Query and edit large codebases in and beyond Gemini's 1M token context window.
>- Generate new apps from PDFs or sketches, using Gemini's multimodal capabilities.
>- Automate operational tasks, like querying pull requests or handling complex rebases.
>- Use tools and MCP servers to connect new capabilities, including [media generation with Imagen, Veo or Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
>- Ground your queries with the [Google Search](https://ai.google.dev/gemini-api/docs/grounding) tool, built in to Gemini.

