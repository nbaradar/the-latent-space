---
title: Site TODO List
tags:
  - meta
---
Just a quick to-do list for this site:
- [ ] Add Analytics
	- Use this free tool: https://umami.is/
	- Read config guide here: https://quartz.jzhao.xyz/configuration#general-configuration
	- Seems quite simple. Just add the analytics to `quartz.config.ts`
- [ ] Update Color Theme
	- Change from the default to a selected palette. Should be similar to ContextCore overall design language
- [ ] Remove Quartz/GitHub/Discord Links at bottom of Page
	- Remove the default links at the bottom of the site. Makes it look cheap and lame
- [ ] Create DNS entry for website name
	- Instructions to [add custom Domain](https://quartz.jzhao.xyz/hosting#custom-domain)
- [ ] Fix left pane not refreshing due to caching
	- Check if there's a configuration. 
- [ ]  Flesh out Project Pages
       * For each project in Personal Projects, create a detailed write-up. Don't just have notes. Have a
         proper project page that answers:
           * **Problem**: What problem were you trying to solve?
           * **Solution**: How did you solve it? What was the architecture?
           * **Tech Stack**: What technologies did you use?
           * **Link**: A link to the GitHub repository and, if possible, a live demo.
       * This is the single most important thing you can do. A portfolio with 2-3 well-documented projects is 
         infinitely more valuable than 100 pages of notes.
- [ ] Right now your categories are documented in Start Here, but readers will find it even easier if (for example) you:
    1. Add a collapsible “Categories” section in your Quartz sidebar (via `quartz.layout.ts` or `quartz.config.ts`), linking directly to each tag index.
    2. Generate simple index pages (e.g. `concept/index.md`, `study/index.md`) so category landing pages are one click away.
- [ ] SEO & descriptions — consider adding a brief `description:` field in the front‑matter of key pages (especially your homepage and upcoming “hire-me” page) to improve discoverability.