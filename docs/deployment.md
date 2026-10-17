# Deployment and caching

## Build

```sh
pnpm build       # astro check + static output to dist/
pnpm preview     # serve dist/ locally
```

The site is fully static. There is no server, adapter, or runtime cache API.
`astro.config.mjs` sets `site: "https://hey.malejandro.com"` and
`trailingSlash: "always"`. Internal links use trailing slashes; the static output is
directory-style (`recetas/pizza/index.html`).

`.node-version` pins Node 24.14.0 for fnm. Use pnpm only.

## Cache contract

`public/_headers` and `public/netlify.toml` declare the same policy for hosts that
read those formats (Netlify, Cloudflare Pages):

| Path | Cache-Control |
| --- | --- |
| `/*` | `public, max-age=600, must-revalidate` |
| `/_astro/*` | `public, max-age=31536000, immutable` |
| `/*.{svg,ico,png}` | `public, max-age=604800, immutable` |

Hashed build assets — JS, CSS, Inter/Noto Serif, and the emoji COLRv1/SVG chunks —
live under `/_astro/`, so their URL changes with content and the immutable rule is
safe. HTML is short-lived so a deploy is visible within ten minutes (or immediately
after a purge). GitHub Pages ignores `_headers`/`netlify.toml`; its own caching
applies. If the site moves to a host with configurable headers, keep this table in
sync and put it in that host's format.

The old `/inter-4.0`, `/inter-4.1` public font paths from `../www` are not used; fonts
are hashed in `_astro`.

## Script retry guard

`Base.astro` registers a capture-phase `error` listener before any module script:

- A not-yet-propagated hashed asset can be answered by the CDN with the site's HTML
  fallback and a `200`; the edge then caches that under the asset's immutable headers.
- The browser refuses to execute the HTML as a module (“blocked because of a
  disallowed MIME type”) and the page silently loses the script.
- The guard retries the same URL once with `?retry=<timestamp>`; cache keys include
  the query, so the request reaches the real file. The retry carries
  `data-script-retried` so a genuinely missing file cannot loop.
- It is inline and first in the head, before the bundled modules. Do not remove or
  reorder it.

## Fonts

`Base.astro` preloads:

- `InterVariable.woff2` (body/UI), imported with `?url`;
- `noto-serif-latin-400-normal.woff2` (recipes), imported from
  `@fontsource/noto-serif` with `?url`.

Both use `crossorigin="anonymous"`. Without it, the browser fetches the font twice
with different cache keys. The emoji font chunks are **not** preloaded; the
`unicode-range` split lets the browser fetch only the chunks for the emoji on the
page.

## Trailing slash and host

The old Nuxt site canonicalised `/recetas/pizza` → `/recetas/pizza/`. Astro keeps
`trailingSlash: "always"` and the links end in `/`. `public/CNAME` is
`hey.malejandro.com` for GitHub Pages. If the host has a different canonicalisation
rule, update the config and that host's redirect rules together.

## gh-pages

```sh
pnpm deploy        # astro check + build + gh-pages -d dist
pnpm deploy-draft  # same, pushes to the deploy-draft branch
```

The scripts use `--dotfiles --nojekyll`. `public/.nojekyll` is also present.
`dist/` is gitignored; never commit it.

## Netlify / Cloudflare Pages

- Build command: `pnpm build`; publish directory: `dist`.
- `public/_headers` is the operational header file for **both** Cloudflare Pages and
  Netlify: Astro copies it to `dist/_headers`, where both hosts read it.
- `public/netlify.toml` is copied to `dist/netlify.toml` and served as a file; Netlify
  reads `netlify.toml` from the repository root (or the configured base directory),
  not from the publish directory. Either rely on `_headers` (recommended) or move a
  Netlify-specific config to the repo root when connecting the site.
- The `CNAME` file is harmless on Netlify/Cloudflare; configure the custom domain in
  the host as well.
- Set the Node version for the host (`NODE_VERSION=24.14.0` or `.nvmrc`); keep
  `.node-version` for local fnm. Install with pnpm.

## Analytics

There is no analytics dependency in this project. If Umami (or another tracker that
patches `history.pushState`) is added, mount it in `Base.astro` and verify that
ClientRouter's per-navigation `pushState` is counted once. Keep local/preview hosts
out of production stats and exclude share/search parameters if the tracker supports
it.
