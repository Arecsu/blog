# Recipe viewer

The viewer preserves the old Nuxt behaviour with a lighter implementation.

## Scaling

- The scale chip in the ingredients heading shows the current factor (`1×`). It opens
  a popover with a stepper (`−` / number / `+`), presets (½, 1, 2, 3), and the
  “Cantidades en los pasos” checkbox.
- `0.1×`–`10×`; steppers move by `0.1`; manual entries accept any valid factor.
  Invalid/empty entries revert on blur or Enter.
- Scales ingredient amounts, `{}` amounts inside labels/notes, and linked
  `<RecipeAmount>` chips in the process. Times, temperatures and dimensions do not
  scale; the notice says so when a factor is active.
- The multiplier resets to 1 for each recipe page instance, including ClientRouter
  navigations back to the same recipe. The “show amounts” preference persists in
  `localStorage` (`recipe-show-amounts`).
- The visibility preference is applied before first paint: the inline
  `head-recipe-amounts.js` head script sets `html[data-recipe-amounts="hidden"]`
  from `localStorage`, and CSS hides `.recipe-inline-amount` from that attribute. The
  process island keeps the attribute and the store in sync. Do not move this read
  after hydration: the chips would flash in and reflow the steps.

## Amount chips

`<RecipeAmount>` renders static server HTML:

```html
<span class="recipe-inline-ingredient">agua <button class="recipe-inline-amount" …>300g</button></span>
```

The separating space before the chip is its own `.recipe-inline-space` node (a
non-breaking space) and hides with the chip. Hiding the amounts therefore leaves
`levadura.`, not `levadura .`; keeping the space as a margin or a bare text node would
leave a gap before punctuation.

The process island owns **one** shared popover. A click sets the selected ingredient
and the popover's anchor name, then opens the popover. The popover shows the group,
the amount (or allocation), all allocations, the total, notes, prepared state, and
the original amount when scaled. The scale store updates the button text and
`aria-label` through a nanostore subscription; the chips are not separate islands.

## Ingredients panel and drawer

- On wide screens (≥ 90rem) the ingredient column sits beside the process. It is
  sticky only while the whole list fits on screen; otherwise it scrolls normally.
- Below 90rem a bottom dock appears while reading the process. It names the current
  section and opens the ingredient drawer (“Ingredientes”).
- The dock slides in when the reading line enters the process and slides out above it.
  It stays laid out (just off screen) so its height never shifts the reading line.
- The drawer is a native `<dialog>` shown with `showModal()`:
  - the existing `.recipe-ingredient-panel` is moved into the dialog (one list in
    the DOM, never a copy);
  - a same-height placeholder stays in the page so the procedure does not move;
  - `.page-scroll` (the inner viewport scrollport) locks while open; the document is
    already non-scrolling;
  - `Escape`, the close button, or a backdrop press close it;
  - the panel returns to its home and focus returns to the dock button.
- The drawer is bottom-up for thumb reach: list, then group tabs, then the title,
  scale chip and close button.
- If the current process section matches an ingredient group, the drawer opens on
  that group with a “Todos” tab. Otherwise it shows every ingredient. Legacy groups
  are read from the rendered `.subingredient` titles.
- The drawer fades its top/bottom edge only when there is more to scroll that way,
  using overlay gradients with opacity transitions (not `mask-image`).

## Section tracking

The current section is the heading crossing a reading line a third of the way down
the visible area (below the header, above the dock). Over the last half screen of
scrolling the line slides to the bottom so the final short sections are reachable.
Sections are never guessed from a parent heading. The dock label keeps the last step
while the bar slides away.

## State

`src/lib/recipe-viewer-store.ts` (nanostores):

- `recipe` — `{ id, title, groups, inlineAmounts }`.
- `scale`, `showAmounts`, `scaled`.
- `drawerOpen`, `drawerScope` (`current`/`all`), `currentSection`.
- `pageToken` + `navigationToken`: both islands on a page call
  `initRecipeViewer(recipe, token)`. A new token resets scale/drawer/section state.
  `astro:before-swap` creates a new client token so a ClientRouter navigation resets
  the scale even when returning to the same slug. The build-time token keeps the two
  islands in sync on the first page load.

The ingredients island seeds the store synchronously before hydration with the
initial props (`// svelte-ignore state_referenced_locally` with a comment). This
prevents a ClientRouter navigation from briefly painting the previous recipe's scale.

## DOM ownership

- The process prose and amount chips are Astro/MDX output. The process island only
  queries and enhances them; it does not re-render the prose.
- Structured ingredient lists are Svelte-rendered and update with `$scale`.
- Legacy ingredient lists are MDX slot content; the Svelte island reads their group
  titles and toggles `hidden` on `.subingredient` elements.
- The drawer panel is moved, not cloned. `RecipePopover` is a shared Svelte component
  using the native Popover API and CSS anchor positioning; opening one closes the
  previous.

## Accessibility

- The ingredients section is labelled by its title; the process section by its
  “Proceso” title (or unlabelled when `process: false`).
- The drawer is a labelled modal dialog; its list gets focus on open (no visible focus
  ring for taps); the close button has a full label; focus returns to the dock.
- The dock is `inert` and visually hidden outside the process.
- Amount buttons have `aria-haspopup="dialog"`, `aria-expanded`, and an
  `aria-label` with the ingredient and current amount.
- Popovers are `role="dialog"`; Escape closes the popover only and returns focus to
  its button.
- The scaled notice is `role="status"`.
- Touch targets are at least 44px (scale stepper, presets, close, dock button).
- `prefers-reduced-motion` disables the page transition, drawer animation, popover
  transitions, and dock transitions.

## Testing

`e2e/site.spec.ts` covers the scale menu, presets, list and inline amount updates,
amount popover content, Escape, notes/emoji, theme switch, and ClientRouter scale
reset. `e2e/mobile.spec.ts` covers the dock, drawer open/filter/fades/close, and the
single-panel invariant. Unit/content tests cover the math and data.

## Constraints

- Side-by-side layout and sticky ingredients: ≥ 90rem. The mobile dock/drawer exists
  below 90rem.
- Scaling does not touch times, temperatures, or free-text yields.
- Legacy recipes (no `ingredientGroups`) have no scaling controls.
- The recipe title's fitted size depends on the Noto Serif metrics JSON; regenerate
  it if the title font changes.
