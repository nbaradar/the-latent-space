---
title: Gemini CLI
tags:
  - lab
  - gemini
  - google
  - ai/ml
draft:
---
>[!info]- Relevant Links 
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
# [[Gemini CLI Install|Installation]]

# [[Gemini CLI Commands|Commands]]

---
# Using `GEMINI.md`
You can create a markdown file in the root directory of your project (wherever you ran `gemini` cli from). When the session starts, the file it automatically ingested and used as context. 

You should put the following in the file:
```markdown
   * **Project Overview:** A brief description of the project, its purpose, and the technologies used.
   * **Build & Run Commands:** How to build, run, and serve the application.
   * **Test Commands:** How to run the test suite.
   * **Linting & Formatting:** Commands to check and fix code style.
   * **Directory Structure:** An overview of the key directories and what they contain.
   * **Architectural Patterns:** Notes on the project's architecture (e.g., "Uses Repository Pattern," "Microservices architecture").
   * **Coding Conventions:** Specific rules or library preferences (e.g., "Always use axios for HTTP requests," "Prefer functional components in React").
```

## Example
```
# Project: My Awesome App

This is a full-stack web application using React for the frontend and Node.js/Express for the backend.

## Commands

- **Run development server:** `npm run dev`
- **Run tests:** `npm test`
- **Lint files:** `npm run lint`
- **Build for production:** `npm run build`

## Key Directories

- `src/components/`: Contains reusable React components.
- `src/pages/`: Next.js page routes.
- `src/server/api/`: Backend API route handlers.
- `prisma/`: Prisma schema and database configuration.

## Conventions

- Use TypeScript for all new code.
- State management is handled by Zustand.
- All API endpoints must be validated using Zod schemas.
- Follow Material Design principles for UI.
```


---
# Configuration
>[!info] [CLI Config Documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md#4-geminimd-files-hierarchical-instructional-context)

# Tooling
>[!info] [CLI Tools Documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/index.md)

---
# Use Cases?
Directly from the GitHub ReadMe:
>- Query and edit large codebases in and beyond Gemini's 1M token context window.
>- Generate new apps from PDFs or sketches, using Gemini's multimodal capabilities.
>- Automate operational tasks, like querying pull requests or handling complex rebases.
>- Use tools and MCP servers to connect new capabilities, including [media generation with Imagen, Veo or Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
>- Ground your queries with the [Google Search](https://ai.google.dev/gemini-api/docs/grounding) tool, built in to Gemini.

