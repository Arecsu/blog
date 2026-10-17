# Project documentation

Read this first every session. It says which document to read for the task.

## Source-of-truth boundaries

- [`../AGENTS.md`](../AGENTS.md) — working rules, commands, CSS/Svelte/Astro policy,
  caching and Git rules. Read it before editing.
- This directory — architecture and conventions. When a doc disagrees with the code,
  **the code wins**; fix the doc in the same change.
- `node_modules` and the installed package versions are the final word on APIs.

## Where to go

| Task | Read |
| --- | --- |
| Pages, islands, content collections, MDX pipeline, state, caching | [`architecture.md`](architecture.md) |
| Writing a recipe or note, frontmatter, `<RecipeAmount>`, extras | [`content.md`](content.md) |
| Recipe scaling, mobile drawer, amount popover, accessibility | [`recipes.md`](recipes.md) |
| SCSS tokens, breakpoints, conventions, global prose | [`styles.md`](styles.md) |
| Cache headers, trailing slash, gh-pages/Netlify, script retry | [`deployment.md`](deployment.md) |
| Why the drawer was reworked and measured | [`performance.md`](performance.md) |

## How to use these docs

1. Pick the one or two docs that match the task; do not read every doc “just in case”.
2. Read `AGENTS.md` first for rules; the docs explain the system.
3. If you discover a convention or gotcha the docs miss, add it to the relevant doc in
   the same change.
