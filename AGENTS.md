# AGENTS.md — hey

Personal static site: Astro 7 + Svelte 5 islands, MDX content collections, SCSS
tokens, Fluent Emoji Colour subset font, unplugin-icons, ClientRouter. Deployed as
static files. No backend, CMS, or monorepo.

Read [`docs/index.md`](docs/index.md) first, every session. It routes to the document
for the task. The previous Nuxt/Vue app is archived on the `nuxt` branch; this work
lives on `hey`.

---

## Conversational style

- Keep answers short and direct. No fluff, no cheerful filler.
- No emojis in commits, issues, PR comments, or code.
- Answer the question before making edits or running commands.
- When responding to feedback, say whether you agree or disagree before describing
  what you changed.
- When there is more than one reasonable path, list the alternatives instead of
  silently picking one.

## Code quality

- Read files in full before wide changes and before editing files you have not
  inspected. Do not rely on search snippets for broad changes.
- No `any` types. Avoid unnecessary `unknown`. Do not overtype; if a return type is
  inferred correctly, do not annotate it.
- Ask before removing functionality that looks intentional, even if unused.
- Do not preserve backward compatibility unless asked.
- Inline single-use helpers at their only call site.
- For complex behavior, workarounds, or bug fixes, write a block comment explaining
  the how and why.
- Never hardcode file paths or platform-specific paths. Use the tsconfig aliases
  (`@/*`, `@components/*`, `@layouts/*`, `@styles/*`, `@scripts/*`, `@lib/*`,
  `@config/*`) or relative paths.
- pnpm only. No npm, no yarn.
- Do not leave `pnpm dev` or `pnpm preview` running. The user runs those. Playwright's
  `webServer` starts and stops its own preview.

### TypeScript

- Erasable syntax only. No `enum`, `namespace`, `module`, `import =`, `export =`.
- Svelte 5 runes and `<script lang="ts">` in `.svelte` files.
- Check `node_modules` for external types; do not guess.

## CSS and SCSS

- **Tokens:** every colour, size, timing, shadow and semantic alias is a native CSS
  custom property in `src/styles/_tokens.scss`. Components consume tokens; do not
  introduce a second palette or duplicate literals.
- **Sass variables** live in `_vars.scss` and are reserved for what CSS cannot
  express: media-query breakpoints and values used by mixins. A `$scss-var` used as
  a design value is a smell; write a custom property instead.
- **No legacy flex/grid hacks.** Do not add `min-width: 0`, `min-height: 0`,
  `minmax(0, …)` or `width: 0` to force shrinking. Use containment (`contain:
  inline-size`), `overflow`, `container-type`, or an explicit intrinsic size.
  The same applies to per-control `min-width: 0`; give the control a real width and
  hide the UA chrome instead.
- CSS lengths use `rem`/`em` (or `%`, `ch`, `vw`, `cqi`). Never `px`, except for
  borders, `filter: blur()`, tap-target minimums, or where a browser API requires it.
- Use `color-mix()` for tinted rules instead of hardcoding alpha colours.
- Scoped `<style>` is the default in Svelte and Astro. Use `:global()` only for
  slotted/child-component markup you cannot put a class on, scoped under a component
  class. The recipe prose is MDX slot content and is styled globally in the recipe
  page for exactly this reason.
- Use the device-query mixins (`@include hover`, `@include press`, `@include coarse`)
  instead of bare `:hover` for interactive controls.
- Do not use `mask-image` on the scrolling mobile drawer. It forces per-frame repaints
  on mobile GPUs. The drawer uses compositor-friendly overlay gradients.
- The document does not scroll. `.page-scroll` owns scrolling so its view-transition
  snapshot is viewport-sized. Scroll reads/listeners (`window.scrollY`, `document.scrollHeight`)
  are bugs on this site: use the `.page-scroll` element. `RecipeIngredients` locks that
  element (not `documentElement`) while the drawer is open.

## Svelte

- **`$effect` is the last resort.** Use `$derived` / `$derived.by` for derived values,
  event handlers for events, and `onMount` for browser APIs with cleanup. `$effect`
  is only acceptable for imperative observers/listeners that cannot be attached in a
  handler; comment why. Never use it as an SSR guard or an implicit trigger.
- Cross-island state (header, recipe scale, drawer) goes through nanostores in
  `src/lib/recipe-viewer-store.ts`. Do not add a second store or duplicate state.
- DOM reads (`getBoundingClientRect`, `offsetHeight`) are allowed in event handlers
  and `onMount`; avoid them in reactive derivations.
- `Icon.svelte` is the shared icon wrapper. Pass size/colour/spacing through its props
  (`size`, `width`, `height`, `color`, `marginInline`, `bottomOffset`,
  `strokeWidth`) instead of new CSS. The wrapper's `margin-inline` overrides class
  margins, so use the prop for margins.
- bits-ui is not a dependency. The drawer and popovers use native `<dialog>`,
  the Popover API, and CSS anchor positioning because the design depends on their
  top-layer behaviour. Reach for bits-ui only if a component's logic is genuinely
  not covered by a browser primitive; do not add it for a one-off.

## Astro

- Static output only. `trailingSlash: "always"` is intentional; every internal link
  ends in `/`.
- ClientRouter is mounted in `Base.astro`. The page scroll owner is `.page-scroll`, a
  `100dvh` element that is also the `route-viewport` transition piece: the enter is a
  fade + 0.99 scale centred on the visible viewport, the exit is instant. `site-header`
  is its own named piece and does not scale. Do not put the transition name back on
  `main` (a document-height snapshot scales around the middle of the page). Do not add
  `transition:persist` to the header: its active link and page title change per route
  and must come from the new HTML. `<meta name="theme-color">` is the exception and is
  persisted. See [`docs/architecture.md`](docs/architecture.md) before changing the
  wrapper or its scroll script.
- MDX is the content format. Do not reintroduce the Nuxt Content `::Component`
  syntax. Markdown plugins are **Sätteri** plugins in
  `src/config/markdown-plugins.ts`; do not add remark/rehype packages or the legacy
  `@astrojs/markdown-remark` processor.
- `<RecipeAmount>` reads the current recipe from `Astro.locals.recipe`, set by the
  recipe page before the MDX body renders. Do not thread recipe data through MDX
  props or a module-level mutable global.
- The recipe page renders `RecipeIngredients.svelte` and `RecipeProcess.svelte`
  directly. The MDX body is process prose only; intros and legacy ingredient lists
  live in the `recipeExtras` collection.
- Use `getCollection` and filter drafts in `getStaticPaths` (production only). The
  index lists always hide drafts.

## Emoji and icons

- Body emoji use the authoring syntax `:🍕:` (colour) or `;🍕;` (flat), but both render
  as the same Fluent Emoji Colour glyph. The Sätteri `emojiSyntax` plugin removes the
  delimiters. Do not add per-emoji SVG fetches, emoji scripts, or a second emoji
  system.
- Emoji in frontmatter labels/notes are cleaned once by `sanitizeRecipeGroups` before
  the islands receive them. Keep `emoji-regex` out of the client bundle.
- **Title icons use unplugin-icons, not the emoji font**: the recipe title, the
  ingredients spoon, the process bowl, the scale chevron, the theme switch, the close
  X, and the Instagram icon. Add a static import in `src/components/icons.ts`; an
  unknown recipe icon throws at build time.
- The emoji font is `src/assets/fluent-emoji-color` (COLRv1 + OpenType-SVG chunks,
  unicode-range split). Do not preload individual chunks; the browser fetches only
  the ranges used.

## Recipe viewer

- One recipe per page. `initRecipeViewer` is called by both islands with the same
  page token; the store resets when the token changes. A ClientRouter navigation
  gets a fresh token from `astro:before-swap`, so returning to a recipe resets the
  scale to 1. The `$show-amounts` preference persists; the scale does not.
- The ingredient drawer moves the existing panel DOM into a native `<dialog>` and
  inserts a same-height placeholder. Do not render a second list.
- Inline amount chips are static HTML from the Sätteri/MDX pipeline. The process
  island enhances them and owns the single shared amount popover; do not create one
  popover per amount. The space before a chip is a `.recipe-inline-space` node that
  hides with the chip. Do not replace it with a bare space or a margin: hidden
  amounts must not leave a gap before punctuation (`levadura.`).
- Scaling, amount chips, the draw/dock, section tracking, and the scale popover are
  covered by Playwright. Update the tests with behavior changes.

## Caching and deployment

- `public/_headers` (copied to `dist/_headers`) is the operational cache contract for
  Netlify and Cloudflare Pages: HTML `max-age=600, must-revalidate`; hashed
  `/_astro/*` immutable for a year; static images/favicons immutable for a week. Keep
  hashed assets under `/_astro/`. `public/netlify.toml` is only served as a file;
  Netlify reads `netlify.toml` from the repo root, so rely on `_headers` unless a root
  config is added.
- The inline module-script retry in `Base.astro` protects against a CDN caching the
  HTML fallback under a not-yet-propagated asset URL. Do not remove or reorder it.
- Display preferences that affect first paint are inline head scripts:
  `head-theme-switch.js` (theme) and `head-recipe-amounts.js` (hidden inline
  quantities). Keep the read before the body; an island-only read causes a flash and
  a layout shift.
- Fonts are preloaded with `crossorigin`; keep the preload URLs in sync with
  `inter.css` / the Noto Serif import.
- `public/CNAME` is `hey.malejandro.com`. Deploy is `pnpm deploy` (gh-pages) unless
  asked for a draft branch.

## Testing

```sh
pnpm test        # Vitest: recipe math/content/emoji
pnpm test:e2e    # builds, then Playwright against a preview server
pnpm check       # astro check + svelte-check
```

- Vitest uses `getViteConfig` from `astro/config`; tests live in `tests/`.
- Playwright uses the installed Chrome (`channel: "chrome"`) and runs desktop +
  mobile projects. If Chrome is unavailable, remove the channel and run
  `pnpm exec playwright install chromium`.
- Content tests read `src/content/**` directly, so they catch invalid ingredients,
  dead `RecipeAmount` references and leftover Nuxt syntax.
- Run `pnpm check` after Svelte/Astro changes. Fix errors before calling work done.
  Do not suppress warnings without a comment explaining why.

## Git workflow

- Current branch: `hey`. `nuxt` is the archived Nuxt/Vue history. `master` is the
  pre-migration branch.
- Never commit unless the user asks. When they do, present the proposed split (files,
  titles, descriptions) and wait for confirmation.
- Stage explicit paths only. Never `git add -A`, `git add .`, `git reset --hard`,
  `git checkout .`, `git clean -fd`, or `git stash`.
- Commit format: `Area: description` (area capitalized, description lowercase).
- Do not push to a remote unless asked.

## Documentation

- `docs/index.md` is the entry point. When a doc disagrees with the code, the code
  wins; fix the doc in the same change.
- Add a note to the relevant doc when you discover a convention or gotcha the docs
  miss. Do not read every doc “just in case”.

## Environment

- macOS or Linux. Do not assume an OS; do not hardcode paths.
- Never read `.env` files. Only `.env.example` is safe. Never print secrets.
- Node version is pinned in `.node-version` (fnm).

## User override

If the user's instructions conflict with a rule here, ask for explicit confirmation
before overriding.
