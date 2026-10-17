# Content authoring

## Files

```
src/content/recetas/<slug>.mdx          recipe page
src/content/recipe-extras/<slug>.mdx    optional intro / legacy ingredient list
src/content/notes/<slug>.mdx            note page
```

Slugs are file names without `.mdx`. Routes are `/recetas/<slug>/` and
`/notes/<slug>/`.

## Recipe frontmatter

```yaml
---
title: Pizza
description: Una pizza clásica con 72 horas de fermentación ⏲️
alt: Pizza
icon: fluent-emoji:pizza
cover:
  file: pizza.webp
  width: 1152
  height: 768
draft: false
process: true
inlineAmounts: true
ingredientGroups:
  - id: masa
    label: Masa
    sections: [preparar-la-masa] # optional aliases for process headings
    note: Optional plain text, blank line between paragraphs
    items:
      - { id: flour, label: Harina 000, quantity: 500, unit: g }
      - { id: water, label: Agua, quantity: 300, unit: g }
      - { id: salt, label: 'Sal marina, o {13 g} sal común', quantity: 10, unit: g }
      - id: sugar
        label: Azúcar
        quantity: 500
        unit: g
        allocations:
          - { id: batter, label: Para la masa, quantity: 300 }
          - { id: meringue, label: Para el merengue, quantity: 200 }
      - { id: vanilla, label: Esencia de vainilla, amount: A ojo }
      - { id: film, label: Papel film } # tools/no amount
---
```

Fields:

| Field | Meaning |
| --- | --- |
| `title` | Required. Lowercased for the `<title>` and header title. |
| `description`, `alt` | Optional metadata. |
| `icon` | Optional unplugin-icons recipe icon, e.g. `fluent-emoji:pizza`. Must exist in `src/components/icons.ts`. |
| `cover` | Optional legacy metadata; not rendered on the page. |
| `draft` | Production builds and index lists omit it. Dev can preview it by URL. |
| `process` | Shows the “Proceso” heading. The prose renders either way. |
| `inlineAmounts` | Enables the “Cantidades en los pasos” checkbox. Set it when the process uses `<RecipeAmount>`. |
| `ingredientGroups` | Structured ingredient list. Omit it for a legacy list in the extras file. |

Ingredient groups:

- `id` unique within the recipe; `label` optional only for a single-group recipe.
- `items` unique `id`s. `quantity` is a positive number; `unit` is a display label
  (never converted). Use `amount: A ojo` for non-numeric amounts.
- `quantityMax` makes a range (`quantity: 15, quantityMax: 20, unit: ml` →
  `15-20ml`).
- `allocations` split a total; they must add up to `quantity`. Each allocation has an
  `id`, `label` and `quantity`.
- `prepared: true` marks a reused preparation (not an extra raw ingredient). Explain
  the source in `note`.
- `whole: true` for eggs (fractional eggs stay fractional).
- `{}` in a label places the item's own amount chip mid-text
  (`'Jugo de {} naranja'`). `{13 g}`, `{1.5 cucharada}` and `{15-20 ml}` are extra
  amounts that scale too.
- `sections` on a group aliases process headings (normalized without accents/emoji)
  so the drawer can open on that group.

## Process body

The MDX body is the process prose only. Do **not** wrap it in `RecipeIngredients` or
`RecipeProcess`; the page owns those sections. Link a quantity from an instruction
with the static `<RecipeAmount>` component:

```mdx
1. Mezclar <RecipeAmount ingredient="water">agua</RecipeAmount> +
   <RecipeAmount ingredient="salt">sal</RecipeAmount>.
2. Incorporar <RecipeAmount ingredient="sugar" allocation="batter">el azúcar</RecipeAmount>.
```

The slot text is the instruction prose. The component resolves the ingredient from
`Astro.locals.recipe` and renders the amount chip immediately on the server; the
process island only enhances the chip's popover. Keep the ingredient name in the slot
so hiding quantities still leaves natural prose.

Amounts are formatted with `es-AR`: weights/volumes attach the symbol (`200g`,
`16,5g`); unit words pluralize (`1 ½ cucharaditas`). Only authored quantities scale;
times, temperatures and dimensions do not.

## Recipe extras

`src/content/recipe-extras/<slug>.mdx` holds content the ingredients island renders
inside its panel:

- **Structured recipes:** the optional intro, e.g.
  `*Para **2 pizzas** :🍕: grandes*`. It appears above the groups.
- **Legacy recipes:** the whole ingredient list using `RecipeSubingredient`. The
  island reads the group titles from the rendered DOM and supports the drawer's
  group tabs.

```mdx
<RecipeSubingredient name="Masa">

- ;🌾; Harina integral
- ;💧; Agua mineral

</RecipeSubingredient>
```

Legacy recipes (`masa-madre`, `pakoras`, `pochoclos-salados`) have no structured
groups and therefore no scaling controls. The drawer and dock still work.

## Emoji

Author emoji with `:🍕:` (colour) or `;🍕;` (flat). Both render as the same Fluent
Emoji Colour glyph. The Sätteri `emojiSyntax` plugin removes the delimiters in body
text; `sanitizeRecipeGroups` removes them from frontmatter labels/notes. Do not add
emoji images or per-emoji scripts.

Smart punctuation is disabled. `...` stays three dots and `""piedra""` stays straight
quotes, exactly like the Nuxt site; do not rely on the processor to curl quotes or
replace ellipses.

## Notes

```yaml
---
title: Links
description: Optional
draft: false
---
```

Notes render in `.nota-container article` with the notes typography. External links
get `target="_blank" rel="nofollow noopener"` from the Sätteri plugin. `<RopaLink>`
is available for the draft clothing-brands note; it is rendered as an Astro component
in the notes `components` map.

## Adding a recipe

1. Create `src/content/recetas/<slug>.mdx` with frontmatter and process prose.
2. Add `ingredientGroups` and replace quantities in the process with
   `<RecipeAmount ingredient="…">…</RecipeAmount>`.
3. If the recipe has an intro or a legacy list, create
   `src/content/recipe-extras/<slug>.mdx`.
4. If it uses a new title icon, add the static unplugin-icons import to
   `src/components/icons.ts`.
5. Run `pnpm test` (content validation) and `pnpm build`.
6. Check the page and the mobile drawer with `pnpm dev` or `pnpm preview`.

## Title metrics

Recipe titles are sized to fit their column using per-character advance widths from
Noto Serif 400: `src/lib/recipe-title-metrics.json`. If the title font changes, run
`pnpm generate:title-metrics` and commit the regenerated JSON.

## Validation

`tests/content.test.ts` reads the MDX source and verifies:

- every structured recipe validates (unique IDs, positive quantities, allocations sum,
  no unknown fields);
- every `<RecipeAmount>` points at an existing ingredient/allocation;
- every `inlineAmounts: true` recipe has at least one reference;
- no Nuxt `::Component` / `:RecipeAmount[...]` syntax remains;
- every extras file belongs to a recipe.

`tests/recipe.test.ts` covers quantity math, fractions/plurals, label tokens,
validation errors, scale stepping, section IDs and title width.
