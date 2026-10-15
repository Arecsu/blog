import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { resolveRecipeAmount, validateRecipeIngredients } from '../utils/recipe.mjs'

// Every structured recipe must validate, use only known fields (an unquoted comma in a
// YAML `{ … }` silently turns the rest of a label into a stray key), and every inline
// amount in its procedure must point at a real ingredient (and allocation).
const GROUP_KEYS = new Set(['id', 'label', 'note', 'sections', 'items'])
const ITEM_KEYS = new Set(['id', 'label', 'quantity', 'quantityMax', 'unit', 'amount', 'note', 'whole', 'prepared', 'allocations'])
const directory = new URL('../content/recetas/', import.meta.url)

for (const file of readdirSync(directory).filter(name => name.endsWith('.md'))) {
  const source = readFileSync(new URL(file, directory), 'utf8')
  const [, front = '', body = ''] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) || []
  const meta = parse(front) || {}
  if (!meta.ingredientGroups) continue

  test(`${file}: ingredient data is valid and complete`, () => {
    const groups = validateRecipeIngredients(meta.ingredientGroups)
    for (const group of groups) {
      assert.deepEqual(Object.keys(group).filter(key => !GROUP_KEYS.has(key)), [], `group ${group.id}`)
      for (const item of group.items) {
        assert.deepEqual(Object.keys(item).filter(key => !ITEM_KEYS.has(key)), [], `item ${item.id}`)
        assert.equal(typeof item.label, 'string', `item ${item.id} label`)
      }
    }
  })

  test(`${file}: inline amounts reference existing ingredients`, () => {
    const references = [...body.matchAll(/:RecipeAmount\[[^\]]*\]\{([^}]*)\}/g)]
    if (meta.inlineAmounts) assert.ok(references.length > 0, 'inlineAmounts is set but nothing is linked')
    for (const [, attributes] of references) {
      const ingredient = attributes.match(/ingredient="([^"]+)"/)?.[1]
      const allocation = attributes.match(/allocation="([^"]+)"/)?.[1]
      const resolved = resolveRecipeAmount(meta.ingredientGroups, ingredient, allocation)
      assert.ok(resolved.quantity !== undefined || resolved.ingredient.amount, `${ingredient} has no amount to show`)
    }
  })
}
