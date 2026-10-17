# Styles

## Files

```
src/styles/
  _tokens.scss    CSS custom properties: palette, spacing, type, shadows, timings
  _vars.scss      Sass variables: breakpoints only
  _mixins.scss    device queries, hit area, visually-hidden, icon mixins
  _shadows.scss   layered-shadow() function used by the token file
  reset.scss      Josh Comeau reset
  base.scss       element defaults, links, lists, pre, emoji fallback
  inter.css       InterVariable @font-face
  _tooltip.scss   theme-switch tooltip
```

`src/assets/fluent-emoji-color/FluentEmojiColor.css` is imported by `Base.astro` and
is generated separately (COLRv1 + OpenType-SVG chunks with `unicode-range`).

## Import order

`src/layouts/Base.astro` imports, in order:

```
inter.css → reset.scss → _tokens.scss → base.scss → _tooltip.scss → emoji font CSS
```

Component styles are scoped by Astro/Svelte. Recipe prose is MDX slot content and is
styled globally by the recipe page.

## Tokens vs Sass variables

- **Tokens** are native CSS custom properties in `_tokens.scss`. They are inspectable
  in DevTools, themeable, and overrideable at runtime. Add new colours, sizes,
  spacing, radii, shadows, and transition values here.
- **Sass variables** are only for what CSS cannot express: media-query breakpoints
  and values consumed by mixins. `_vars.scss` currently contains:

```scss
$recipe-side-by-side: 90rem;   // stacked → ingredients beside process
$recipe-sidebar-hide: 50rem;   // vertical recipe title hidden below this
$recipe-popover-mobile: 40rem; // amount/scale popover centres on phones
$recipe-subingredients-narrow: 38rem; // ingredient columns collapse
```

Use `$recipe-side-by-side` in media queries, not a repeated literal. Do not write
`:root { --x: #{$scss-var} }`; use the native value directly.

## No legacy layout hacks

Do not add:

- `min-width: 0` / `min-height: 0` to flex/grid items,
- `minmax(0, …)` grid tracks,
- `width: 0` + overflow to force shrinking.

Use the primitives that replaced them:

- `container-type: inline-size` for the recipe column (the title uses `cqi`);
- `contain: inline-size` for the dock label that must truncate;
- `overflow`/`overflow-y: auto` for scroll containers (the automatic minimum size is
  already zero when overflow is not `visible`);
- explicit widths, `text-box`, `overflow-wrap`, or a different layout.

The old CSS used these hacks because it was written for older engines. They are not
needed here. The only `min-width` values left are explicit tap targets (`44px`) and
the JS media-query string.

## Device queries

Use the mixins, not bare media queries, for interaction:

```scss
@include hover { … }   // (hover: hover) and (pointer: fine)
@include coarse { … }  // (pointer: coarse)
@include press { … }   // hover for mouse, :active for touch
```

A bare `:hover` sticks on touch devices. Use `@include press` for links/buttons.
`expanded-hit-area` adds a transparent pseudo-element hit target without growing the
painted control.

## Icons

`Icon.svelte` exposes `--i-s--*` variables:

```svelte
<Icon size="1.15em" marginInline="-0.1em 0"><Spoon /></Icon>
```

- `size`/`width`/`height`, `color`, `marginInline`, `bottomOffset`, `strokeWidth`.
- The wrapper's `margin-inline` comes from the mixin, so pass margins through
  `marginInline`; a class margin is overridden.
- The inner SVG is 100% of the wrapper and uses `fill/stroke: currentColor`; coloured
  Fluent icons keep their explicit fills.
- Icons are static unplugin-icons imports. Do not fetch icon SVGs at runtime, and do
  not use the emoji font for title/control icons.

## Typography

- `--font-sans`: `"InterVariable", "Fluent Emoji Color", sans-serif`.
- `--font-serif`: `"Noto Serif", "Fluent Emoji Color", serif`.
- `--font-mono`: `"Fira Mono", "Fluent Emoji Color", monospace`.
- The emoji font is appended to every stack so a stray glyph falls through.
- Recipe prose headings use Noto Serif; notes and the home use Inter.
- The title uses `text-wrap: balance` and the fitted `100cqi / var(--recipe-title-width)`.

## Browser features in use

- CSS custom properties, `color-mix()`, `text-box: trim-both cap alphabetic`,
  `@starting-style`, `:popover-open`, `anchor()`/`position-anchor`,
  `position-try-fallbacks`, `inert`, `dialog`, view transitions, `dvh`/`cqi`,
  `text-wrap: balance/pretty`, `scrollbar-color` for hiding scrollbar paint during a
  transition, and the Navigation API for inner-scroll restoration.
- The page scroll owner is `.page-scroll` (100dvh), not the document. It is also the
  `route-viewport` transition piece, so the route scale is centred on the visible
  viewport. Route enter tokens: `--transition-enter-duration`, `-delay`, `-ease`,
  `-blur`, `-scale` (250ms, 40ms, cubic-bezier, 1.5px, 0.99).
- Reduced motion is honoured in every animation.

## Adding a token

1. Add the custom property to `:root, html[theme="light"]` in `_tokens.scss`.
2. Override it in `html[theme="dark"]` if it is theme-dependent.
3. Consume it with `var(--token)`; do not repeat the literal.
4. If it is a breakpoint or a value used inside a mixin, put it in `_vars.scss`
   instead and document it here.
