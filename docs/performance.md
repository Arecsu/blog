# Performance notes

The mobile ingredient drawer was reported as stuttery in the Nuxt/Vue version even
though it is visually a simple bottom sheet. This page records what was wrong and
what the Astro/Svelte port does differently. It is context, not a promise that every
phone is fast.

## What was heavy in the Nuxt version

- The drawer content used `mask-image` with animated custom properties (`@property`)
  for the top/bottom scroll fades. A mask on a large, scrolling, moving sheet forces
  a repaint of the whole list on each frame; mobile GPUs notice.
- Every inline amount rendered its own Vue `RecipeAmount` component and its own
  `RecipePopover` instance, including a hidden popover element. A long recipe had
  hundreds of extra components/DOM nodes.
- Opening the drawer changed Vue state and awaited `nextTick()` before moving the
  panel and calling `showModal()`. The sequence included layout reads, a reactive
  min-height update, a DOM move, a scroll lock, `showModal()`, and fade bookkeeping
  in one interaction.
- Vue's virtual DOM re-rendered the ingredient component tree on drawer state changes.

## What the port does

- **Native `<dialog>` + `showModal()`**, opened synchronously in the store
  subscription. There is no `nextTick` before opening. The dialog renders its own
  list from the same groups, so the page keeps its panel and does not jump.
- **One shared amount popover** for every inline amount, anchored with CSS
  `position-anchor` + `anchor()`. Buttons are static server HTML; the process island
  only updates their text/`aria-label` and opens the one popover.
- **Svelte fine-grained updates**: opening the drawer toggles group `hidden`
  attributes and a dialog; it does not re-render the ingredient list. Scaling updates
  only the amount text/attributes.
- **Overlay gradient fades** (opacity transitions) instead of `mask-image` and
  animated custom properties. No mask layer, no per-frame repaint.
- **Native dock/panel measurement** is done once per open in the event handler, not
  in a reactive render.
- The recipe page has three islands and no Vue/Nuxt runtime. The header theme switch
  is idle-hydrated; the recipe islands load immediately.

## Measurements

iPhone 13 emulation (390×664 CSS px, DPR 3), Chromium, preview build, CPU throttled
4×. The live Nuxt site (`hey.malejandro.com`) was measured in the same run.

| Page | DOM nodes (port) | DOM nodes (Nuxt) |
| --- | --- | --- |
| Pizza | 470 | 585 |
| Torta Matilda | 744 | 953 |

Drawer on Torta Matilda, open → “Todos” → scroll → close:

| Metric | Port | Nuxt |
| --- | --- | --- |
| Click → dialog `open` | ~16 ms | ~20 ms |
| Frame median during open/scroll | 16.7 ms | 16.6 ms |
| Frames over 32 ms | 0 | 0 |
| Long tasks during the interaction | 0 | 0 |
| Drawer content `mask-image` | `none` | `linear-gradient(…)` |

The port opens slightly sooner because the panel move and `showModal()` are synchronous;
both implementations held 60 fps in this emulation and produced no long task during the
drawer interaction. The structural difference is the mask: Nuxt still puts an animated
`mask-image` on the scrolling list, while the port uses two overlay gradients whose
opacity is the only animated property.

These numbers are from desktop Chrome mobile emulation, not a physical phone. Use the
Chrome DevTools Performance panel on the target phone before drawing conclusions
about a specific device. The inner viewport scrollport is part of this measurement:
the drawer, dock, popovers and scroll restoration all run with the document itself
not scrolling.

## Re-measuring

- Open `/recetas/torta-matilda/`, scroll to the process, open the dock, switch to
  “Todos”, and record a Performance trace while opening and scrolling the drawer.
- Compare against the archived Nuxt implementation on the `nuxt` branch if needed.
- Playwright's mobile project (`e2e/mobile.spec.ts`) asserts behaviour, not frame
  timing; keep performance measurements manual/DevTools-based.

## Future levers

If a low-end device still drops frames:

- Reduce the layered `--shadow-sheet` (five shadow layers + ambient + inset
  highlight) to a simpler two-layer shadow for the sheet only.
- Cache the panel height on open instead of measuring it (the measurement is a
  synchronous layout read).
- Consider `content-visibility`/containment on the drawer list if the list grows much
  larger.
- Do not add a permanent `will-change: transform`; it costs memory and the transform
  animation is already compositable.
