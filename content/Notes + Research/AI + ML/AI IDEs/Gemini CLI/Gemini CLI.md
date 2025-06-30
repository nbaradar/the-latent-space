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

Gemini CLI just brings the [[Gemini]] family of Models to your terminal. 

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
# Configuration
>[!info] [CLI Config Documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md#4-geminimd-files-hierarchical-instructional-context)

---
# Tooling
>[!info] [CLI Tools Documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/index.md)

---
# Additional Tips/Tricks
## Using `GEMINI.md`
You can create a markdown file in the root directory of your project (wherever you ran `gemini` cli from). When the session starts, the file it automatically ingested and used as context. 

You should aim to include the following context in the `GEMINI.md` file:
```markdown
   * **Project Overview:** A brief description of the project, its purpose, and the technologies used.
   * **Build & Run Commands:** How to build, run, and serve the application.
   * **Test Commands:** How to run the test suite.
   * **Linting & Formatting:** Commands to check and fix code style.
   * **Directory Structure:** An overview of the key directories and what they contain.
   * **Architectural Patterns:** Notes on the project's architecture (e.g., "Uses Repository Pattern," "Microservices architecture").
   * **Coding Conventions:** Specific rules or library preferences (e.g., "Always use axios for HTTP requests," "Prefer functional components in React").
```

>[!example]- Example GEMINI.md
>```
>> # Project: My Awesome App
> 
> This is a full-stack web application using React for the frontend and Node.js/Express for the backend.
> 
> ## Commands
> 
> - **Run development server:** `npm run dev`
> - **Run tests:** `npm test`
> - **Lint files:** `npm run lint`
> - **Build for production:** `npm run build`
> 
> ## Key Directories
> 
> - `src/components/`: Contains reusable React components.
> - `src/pages/`: Next.js page routes.
> - `src/server/api/`: Backend API route handlers.
> - `prisma/`: Prisma schema and database configuration.
> 
> ## Conventions
> 
> - Use TypeScript for all new code.
> - State management is handled by Zustand.
> - All API endpoints must be validated using Zod schemas.
> - Follow Material Design principles for UI.
>```

## Using ClaudeCode w/ GeminiCLI
Here's how you can [use Gemini CLIs HUGE ContextWindow within Claude Code](https://www.reddit.com/r/ChatGPTCoding/comments/1lm3fxq/gemini_cli_is_awesome_but_only_when_you_make/):

>I just added instructions to CLAUDE.md to have Claude use the Gemini CLI in non-interactive mode (passing the -p param with a prompt to just get a response back from the CLI) when it needs to gather information about a large part of the codebase.
>
>That way you get the best of both worlds, Claude doesn't waste context and Gemini doesn't waste your time.

>[!example]- Example CLAUDE.md
>```
>> # Using Gemini CLI for Large Codebase Analysis
> 
> When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
> context window. Use `gemini -p` to leverage Google Gemini's large context capacity.
> 
> ## File and Directory Inclusion Syntax
> 
> Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
>  gemini command:
> 
> ### Examples:
> 
> **Single file analysis:**
> 
> gemini -p "@src/main.py Explain this file's purpose and structure"
> 
> Multiple files:
> gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"
> 
> Entire directory:
> gemini -p "@src/ Summarize the architecture of this codebase"
> 
> Multiple directories:
> gemini -p "@src/ @tests/ Analyze test coverage for the source code"
> 
> Current directory and subdirectories:
> gemini -p "@./ Give me an overview of this entire project"
> 
> # Or use --all_files flag:
> gemini --all_files -p "Analyze the project structure and dependencies"
> 
> Implementation Verification Examples
> 
> Check if a feature is implemented:
> gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"
> 
> Verify authentication implementation:
> gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"
> 
> Check for specific patterns:
> gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"
> 
> Verify error handling:
> gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"
> 
> Check for rate limiting:
> gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"
> 
> Verify caching strategy:
> gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"
> 
> Check for specific security measures:
> gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"
> 
> Verify test coverage for features:
> gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"
> 
> When to Use Gemini CLI
> 
> Use gemini -p when:
> - Analyzing entire codebases or large directories
> - Comparing multiple large files
> - Need to understand project-wide patterns or architecture
> - Current context window is insufficient for the task
> - Working with files totaling more than 100KB
> - Verifying if specific features, patterns, or security measures are implemented
> - Checking for the presence of certain coding patterns across the entire codebase
> 
> Important Notes
> 
> - Paths in @ syntax are relative to your current working directory when invoking gemini
> - The CLI will include file contents directly in the context
> - No need for --yolo flag for read-only analysis
> - Gemini's context window can handle entire codebases that would overflow Claude's context
> - When checking implementations, be specific about what you're looking for to get accurate results
>```

---
# Use Cases
Directly from the GitHub ReadMe:
>- Query and edit large codebases in and beyond Gemini's 1M token context window.
>- Generate new apps from PDFs or sketches, using Gemini's multimodal capabilities.
>- Automate operational tasks, like querying pull requests or handling complex rebases.
>- Use tools and MCP servers to connect new capabilities, including [media generation with Imagen, Veo or Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
>- Ground your queries with the [Google Search](https://ai.google.dev/gemini-api/docs/grounding) tool, built in to Gemini.

