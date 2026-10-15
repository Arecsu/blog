import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatRecipeAmount, recipeTextParts, recipePlainLabel, stepRecipeScale, validRecipeScale, recipeSectionId, legacyRecipeGroups,
  validateRecipeIngredients, resolveRecipeAmount, recipeTitleWidth } from '../utils/recipe.mjs'
import titleMetrics from '../utils/recipe-title-metrics.json' with { type: 'json' }

const splitRecipe = () => [{ id: 'masa', label: 'Masa', items: [
  { id: 'sugar', label: 'Azúcar', quantity: 500, unit: 'g', allocations: [
    { id: 'batter', label: 'Para la masa', quantity: 300 },
    { id: 'meringue', label: 'Para el merengue', quantity: 200 },
  ] },
  { id: 'vanilla', label: 'Vainilla', amount: 'A ojo' },
] }]

test('scales amounts without rounding whole ingredients or changing units', () => {
  assert.equal(formatRecipeAmount(200, 'g', .75), '150g')
  assert.equal(formatRecipeAmount(3, '', .5), '1 ½')
  assert.equal(formatRecipeAmount(4, '', 1.1), '4,4')
  assert.equal(formatRecipeAmount(1, 'cucharada', .5), '½ cucharada')
  assert.equal(formatRecipeAmount(undefined, 'g', 2), '')
  assert.equal(formatRecipeAmount(15, 'g', 1 / 3), '5g')
})

test('attaches unit symbols but keeps a space before unit words', () => {
  assert.equal(formatRecipeAmount(1000, 'g'), '1.000g')
  assert.equal(formatRecipeAmount(2, 'cucharadas'), '2 cucharadas')
})

test('reads spoons as fractions with Spanish plurals, and weights as decimals', () => {
  assert.equal(formatRecipeAmount(1.5, 'cucharadita'), '1 ½ cucharaditas')
  assert.equal(formatRecipeAmount(1.25, 'cucharadita'), '1 ¼ cucharaditas')
  assert.equal(formatRecipeAmount(1, 'cdta', 2), '2 cdtas')
  assert.equal(formatRecipeAmount(1, 'pizca'), '1 pizca')
  assert.equal(formatRecipeAmount(1.25, 'cucharadita', 1.1), '1,38 cucharaditas')
  assert.equal(formatRecipeAmount(15, 'g', 1.1), '16,5g')
  assert.equal(formatRecipeAmount(15, 'ml', 2, 20), '30-40ml')
})

test('scales amounts written inside labels and notes', () => {
  const item = { label: 'Jugo de {} naranja', quantity: 1 }
  assert.deepEqual(recipeTextParts(item.label, item, 2).map(part => part.value), ['Jugo de ', '2', ' naranja'])
  const salt = { label: 'Sal marina, o {13 g} sal común', quantity: 10, unit: 'g' }
  assert.deepEqual(recipeTextParts(salt.label, salt, 2).map(part => part.value), ['Sal marina, o ', '26g', ' sal común'])
  assert.equal(recipePlainLabel({ label: 'Ralladura de {} naranja', quantity: .5 }), 'Ralladura de ½ naranja')
})

test('allows tools without amounts but not a `{}` placeholder without one', () => {
  assert.doesNotThrow(() => validateRecipeIngredients([{ id: 'g', items: [{ id: 'film', label: 'Papel film' }] }]))
  assert.throws(() => validateRecipeIngredients([{ id: 'g', items: [{ id: 'j', label: 'Jugo de {} naranja' }] }]))
  assert.throws(() => validateRecipeIngredients([{ id: 'a', items: [] }, { id: 'b', items: [] }]), /group/)
  assert.throws(() => validateRecipeIngredients([{ id: 'g', label: 'G', items: [{ id: 'x', label: 'X', quantity: 20, quantityMax: 15 }] }]))
})

test('rejects invalid, zero, negative, infinite, or out-of-range factors', () => {
  for (const value of [0, -1, Infinity, NaN, .099, 10.01, '2']) assert.equal(validRecipeScale(value), false)
  for (const value of [.1, .75, 1, 10]) assert.equal(validRecipeScale(value), true)
})

test('steps by 0.1 without floating-point drift or snapping manual values', () => {
  assert.equal(stepRecipeScale(1, -1), .9)
  assert.equal(stepRecipeScale(.3, -1), .2)
  assert.equal(stepRecipeScale(.7, 1), .8)
  assert.equal(stepRecipeScale(1.1, 1), 1.2)
  assert.equal(stepRecipeScale(.75, 1), .85)
  assert.equal(stepRecipeScale(.75, -1), .65)
  assert.equal(stepRecipeScale(.2, -1), .1)
  assert.equal(stepRecipeScale(.1, -1), .1)
  assert.equal(stepRecipeScale(9.95, 1), 10)
  assert.equal(stepRecipeScale(10, 1), 10)
})

test('resolves explicitly split quantities and scales each allocation, not the total', () => {
  const groups = validateRecipeIngredients(splitRecipe())
  const batter = resolveRecipeAmount(groups, 'sugar', 'batter')
  const meringue = resolveRecipeAmount(groups, 'sugar', 'meringue')
  assert.equal(formatRecipeAmount(batter.quantity, batter.ingredient.unit, 2), '600g')
  assert.equal(formatRecipeAmount(meringue.quantity, meringue.ingredient.unit, 2), '400g')
  assert.equal(resolveRecipeAmount(groups, 'sugar').quantity, 500)
  assert.equal(resolveRecipeAmount(groups, 'vanilla').ingredient.amount, 'A ojo')
})

test('rejects allocations that do not add up and duplicate identifiers', () => {
  const groups = splitRecipe()
  groups[0].items[0].allocations[0].quantity = 500
  assert.throws(() => validateRecipeIngredients(groups), /add up/)
  assert.throws(() => validateRecipeIngredients([...splitRecipe(), ...splitRecipe()]), /group/)
  const duplicate = splitRecipe()
  duplicate[0].items.push({ id: 'sugar', label: 'Otro azúcar', quantity: 20 })
  assert.throws(() => validateRecipeIngredients(duplicate), /Duplicate/)
  const duplicatedPart = splitRecipe()
  duplicatedPart[0].items[0].allocations[1].id = 'batter'
  assert.throws(() => validateRecipeIngredients(duplicatedPart), /allocation/)
})

test('unknown ingredient and allocation references fail instead of guessing', () => {
  assert.throws(() => resolveRecipeAmount(splitRecipe(), 'missing'), /Unknown recipe ingredient/)
  assert.throws(() => resolveRecipeAmount(splitRecipe(), 'sugar', 'missing'), /Unknown allocation/)
})

test('prepared ingredients retain their authored amount, not a sum of raw ingredients', () => {
  const groups = [{ id: 'mousse', label: 'Mousse', items: [
    { id: 'reserved', label: 'Crema de chocolate', quantity: 300, unit: 'g', prepared: true },
  ] }]
  assert.equal(formatRecipeAmount(resolveRecipeAmount(groups, 'reserved').quantity, 'g', .5), '150g')
})

test('matches accented and emoji-decorated section labels', () => {
  assert.equal(recipeSectionId('🍫 Crema de Chocolate'), 'crema-de-chocolate')
  assert.equal(recipeSectionId('Almíbar de entremets'), 'almibar-de-entremets')
})

test('reads legacy group names without reinterpreting or dropping ingredient content', () => {
  const text = value => ({ type: 'text', value })
  const body = { children: [
    { tag: 'recipe-subingredient', props: { name: 'Flan' }, children: [] },
    { tag: 'recipe-subingredient', children: [
      { tag: 'template', props: { 'v-slot:title': '' }, children: [{ tag: 'p', children: [text('🍫 Relleno')] }] },
      { tag: 'p', children: [text('This note is not an ingredient and must stay intact.')] },
    ] },
  ] }
  const snapshot = JSON.stringify(body)
  assert.deepEqual(legacyRecipeGroups(body), [{ id: 'flan', label: 'Flan' }, { id: 'relleno', label: '🍫 Relleno' }])
  assert.equal(JSON.stringify(body), snapshot)
})

test('recipe title width matches the browser measurement of Noto Serif', () => {
  // Chrome measures this text at 11.748em (letter-spacing -.05em); the emoji adds 1.017em.
  assert.equal(recipeTitleWidth('Galletas de avena con chips', false, titleMetrics), Math.round(11.748 * 1.01 * 1000) / 1000)
  assert.equal(recipeTitleWidth('Galletas de avena con chips', true, titleMetrics), Math.round(12.765 * 1.01 * 1000) / 1000)
  // Accented letters and Spanish punctuation are in the table (no fallback guesses).
  assert.ok([...'¡Ñandú, crème brûlée?'].every(char => char in titleMetrics))
})
