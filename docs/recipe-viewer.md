# Recipe viewer

All recipes keep their existing Markdown, ingredient notes, tools, and look. When ingredients and procedure sit side by side (wider than 90rem), the ingredient list follows the procedure, but only while the whole list fits on screen; otherwise it scrolls with the page as before. Narrower layouts get a bottom bar that opens an ingredient drawer. The drawer moves the original content rather than rendering a second copy; closing it preserves the procedure's position. The bottom bar names the step being read: the section crossing a line a third of the way down the screen (sliding to the bottom over the last half screen so the final sections are reachable). If that section's heading matches an ingredient group, the drawer opens on that group, with a "Todos" tab; otherwise it shows the full list. Sections are never guessed from their parent heading. The drawer is laid out bottom-up for thumb reach: the list on top, then the group tabs, then the title and close button in the same row as the bar's "Ingredientes" button. Because it is anchored to the bottom, switching tabs only moves its top edge. It slides up on open and back down on close (close button, Escape, or tapping outside), and the list fades at its top/bottom edge only while there is more to scroll that way. The bar slides in from the bottom while reading the steps and slides back out above them; it stays laid out (just off screen) so its height never shifts the reading line. The bar and the drawer span the recipe's body column (right of the sidebar title on tablets), measured from `.recipe-container`, so the page margins stay blank on both sides.

## Opting into scaling and inline quantities

Every recipe with real quantities uses this format. Three stay as plain Markdown because scaling doesn't apply: `masa-madre` (a guide, proportions taught in prose), `pochoclos-salados` (no amounts) and `pakoras` (ratios). `brownies`, `pan-de-papas`, `rosca-rellena` and `polvorones` have procedures copied from other recipes, so their lists scale but nothing is linked in their steps until those are rewritten. `mermelada-frutillas` has no procedure. Yield lines ("Para 2 panes") are free text and don't scale.

`npm test` validates every structured recipe (`tests/recipe-content.test.mjs`): known fields only (an unquoted comma inside a YAML `{ … }` silently splits a value into a stray key, so quote values with commas), and every `:RecipeAmount` must point at an existing ingredient and allocation.

For a linked recipe, add `ingredientGroups` to frontmatter and use an empty `RecipeIngredients` component instead of its legacy ingredient slots. IDs must be unique within the recipe. Quantities are positive numbers; units are display labels, never automatically converted. Use `amount: A ojo` instead of `quantity` for non-numeric amounts.

```yaml
inlineAmounts: true
ingredientGroups:
  - id: masa
    label: Masa
    # Optional aliases for procedure headings, normalized without accents/emoji:
    sections: [preparar-la-masa]
    items:
      - id: sugar
        label: ';🍬; Azúcar'  # optional leading emoji, same syntax as the Markdown body
        quantity: 500
        unit: g
        allocations:
          - { id: batter, label: Para la masa, quantity: 300 }
          - { id: meringue, label: Para el merengue, quantity: 200 }
      - { id: vanilla, label: Esencia de vainilla, amount: A ojo }
```

```mdc
::RecipeIngredients
::

::RecipeProcess{:process="true"}
### Masa

1. Incorporar :RecipeAmount[el azúcar]{ingredient="sugar" allocation="batter"}.
2. Reservar :RecipeAmount[el azúcar para el merengue]{ingredient="sugar" allocation="meringue"}.
::
```

Beyond `quantity`/`unit`/`amount`, items support:

- No amount at all, for tools and "a gusto" items: `{ id: film, label: Papel film }`.
- `;🧈;` / `:🍫:` emoji anywhere in `label`, `note` or a group `label`.
- `{}` in the label to place the item's own amount chip mid-text (`'Jugo de {} ;🍊; naranja'`), and `{13 g}`, `{1.5 cucharada}` or `{15-20 ml}` for extra amounts in labels or notes that scale too (`'Sal marina, o {13 g} sal común'`).
- `quantityMax` for ranges (`quantity: 15, quantityMax: 20, unit: ml` → `15-20ml`).
- Groups: `note` (plain text, blank line between paragraphs), `items: []` for text-only groups, and no `label` when a recipe has a single plain list.

Spoons, pinches and counts render as fractions with Spanish plurals (`1 ½ cucharaditas`); weights and volumes stay decimal (`16,5g`). Only unit words pluralize: "Jugo de 2 naranja" stays as written.

Allocations must add up to the ingredient total. Each reference uses its explicit allocation; no inference from the instruction text is performed. At 2×, this example shows `1.000g` in the ingredient list, `600g` for the batter, and `400g` for the meringue. Unit symbols (`g`, `kg`, `ml`, `l`, …) attach to the number like the hand-written recipes; unit words (`cucharada`) keep a space. The default `es-AR` formatting displays thousands as `1.000`.

Keep the ingredient name inside the component slot. Hiding inline quantities then leaves natural, complete prose. Do not leave a second hard-coded copy of a scalable amount in the instruction.

### Prepared mixtures and other caveats

- Mark reused preparations with `prepared: true` and explain the source in `note`. They are not additional raw ingredients. Matilda's reserved 300 g of chocolate cream is shared by both relevant instructions, not counted twice.
- Use `whole: true` for eggs. Fractional eggs remain fractional instead of being silently rounded.
- Notes stay inline in the ingredient list. If a note contains a numerical sub-recipe, do not leave those quantities hard-coded when enabling scaling; author that preparation as a separate group first.
- The compact multiplier input updates ingredients and linked instructions immediately. Minus/plus buttons and the input's up/down keys change it by 0.1; the field has a fixed width so the buttons never move; manual entries can use any factor between 0.1× and 10×. Invalid or empty entries revert to the last valid factor on blur or Enter. The multiplier and inline-quantity checkbox share one row.
- Times, temperatures, dimensions, and cooking instructions do not scale. The viewer explicitly warns about this when a multiplier is active.
- Only the inline-quantity visibility preference persists locally. Switching recipes resets the multiplier to avoid accidentally cooking a newly opened recipe at the previous recipe's scale.

## Checks

Run `pnpm test` for quantity math, split allocations, validation, and legacy section metadata. Run `pnpm generate` to check SSR and static rendering of every recipe. Browser-check the drawer, Escape/focus return, scroll preservation, and sticky panel in both themes when changing viewer components, and keep the browser console free of Vue warnings.

Components that render Markdown slots (`RecipeIngredients`, `RecipeSubingredient`, `RecipeProcess`, `RecipeAmount`) render those slots once with `v-once`; their reactive parts update around them. Re-invoking a Markdown slot on a reactive update makes Vue warn that the slot was "invoked outside of the render function".
