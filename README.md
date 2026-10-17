# hey

Source for [hey.malejandro.com](https://hey.malejandro.com), a static personal site:
home, notes, and a recipe collection with scaled ingredients and an inline amount
detail popover.

- **Astro 7** static output, **ClientRouter** view transitions, content collections.
- **Svelte 5** islands for the interactive header, theme switch, and recipe viewer.
- **SCSS** with native CSS custom-property tokens; Sass only for breakpoints/mixins.
- **Fluent Emoji Colour** subset font for body emoji; **unplugin-icons** for inline
  title/ingredient/process icons.
- **Sätteri** Markdown/MDX plugins (emoji syntax and external links).
- **Vitest** unit/content tests and **Playwright** end-to-end tests.

## Commands

```sh
pnpm dev                 # Astro dev server on :4321
pnpm build               # astro check + static build to dist/
pnpm preview             # preview the built site
pnpm check               # astro check + svelte-check
pnpm test                # Vitest (recipe math, content, emoji)
pnpm test:e2e            # build + Playwright (uses installed Chrome)
pnpm generate:title-metrics  # regenerate src/lib/recipe-title-metrics.json
pnpm deploy              # build + gh-pages
```

Use pnpm only. The Node version is pinned in `.node-version`.

## Documentation

Read [`AGENTS.md`](AGENTS.md) for working rules, then
[`docs/index.md`](docs/index.md) to find the document that matches your task.

- [`docs/architecture.md`](docs/architecture.md) — rendering, islands, state, caching.
- [`docs/content.md`](docs/content.md) — recipe/notes authoring and MDX components.
- [`docs/recipes.md`](docs/recipes.md) — scaling, drawer, popovers, accessibility.
- [`docs/styles.md`](docs/styles.md) — SCSS tokens, breakpoints, conventions.
- [`docs/deployment.md`](docs/deployment.md) — cache headers, trailing slash, deploy.
- [`docs/performance.md`](docs/performance.md) — mobile drawer notes and measurements.

## History

The previous Nuxt/Vue implementation is archived on the `nuxt` branch. The current
work lives on `hey`.
