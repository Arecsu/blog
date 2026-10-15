<template>
  <div v-if="viewer && viewer.groups.value.length" class="recipe-controls">
    <div class="recipe-controls-section">
      <p :id="`${id}-scale-label`" class="recipe-controls-title">Proporción de la receta</p>
      <p :id="`${id}-scale-hint`" class="recipe-controls-hint">Multiplica todos los ingredientes</p>
      <div class="recipe-scale-row">
        <div class="recipe-scale-stepper" role="group" :aria-labelledby="`${id}-scale-label`">
          <button type="button" aria-label="Reducir proporción en 0,1" :disabled="viewer.scale.value <= MIN_RECIPE_SCALE" @click="adjust(-1)">−</button>
          <span class="recipe-scale-field">
            <input v-model="factorInput" name="recipe-scale" type="number" :min="MIN_RECIPE_SCALE" :max="MAX_RECIPE_SCALE" step="any"
              inputmode="decimal" :aria-labelledby="`${id}-scale-label`" :aria-describedby="`${id}-scale-hint`" title="Entre 0,1 y 10"
              @input="applyInput" @blur="restoreInput" @keydown.enter.prevent="restoreInput"
              @keydown.up.prevent="adjust(1)" @keydown.down.prevent="adjust(-1)" />
            <span class="recipe-times" aria-hidden="true">×</span>
          </span>
          <button type="button" aria-label="Aumentar proporción en 0,1" :disabled="viewer.scale.value >= MAX_RECIPE_SCALE" @click="adjust(1)">+</button>
        </div>
      </div>
      <div class="recipe-scale-presets" role="group" aria-label="Proporciones rápidas">
        <button v-for="preset in presets" :key="preset.value" type="button" :aria-pressed="viewer.scale.value === preset.value"
          :aria-label="preset.label" @click="set(preset.value)"><span :class="{ 'is-fraction': preset.text === '½' }">{{ preset.text }}</span><span
          class="recipe-times" aria-hidden="true">×</span></button>
      </div>
    </div>
    <label v-if="viewer.hasInlineAmounts.value" class="recipe-amount-toggle">
      <input v-model="viewer.showAmounts.value" name="recipe-show-amounts" type="checkbox" />
      <span>Cantidades en los pasos<small>Las muestra dentro de cada paso</small></span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { MIN_RECIPE_SCALE, MAX_RECIPE_SCALE, stepRecipeScale, validRecipeScale } from '~/utils/recipe.mjs'

const viewer = useRecipeViewer()
const id = `recipe-controls-${useId()}`
const presets = [
  { value: 0.5, text: '½', label: 'La mitad' },
  { value: 1, text: '1', label: 'Receta original' },
  { value: 2, text: '2', label: 'El doble' },
  { value: 3, text: '3', label: 'El triple' },
]
const factorInput = ref(String(viewer?.scale.value || 1))
watch(() => viewer?.scale.value, value => { factorInput.value = String(value) })

function applyInput(event: Event) {
  const value = (event.target as HTMLInputElement).valueAsNumber
  if (validRecipeScale(value)) viewer?.setScale(value)
}
function restoreInput() { factorInput.value = String(viewer?.scale.value || 1) }
function set(value: number) {
  viewer?.setScale(value)
  restoreInput()
}
function adjust(direction: number) {
  if (viewer) set(stepRecipeScale(viewer.scale.value, direction))
}
</script>

<style scoped lang="scss">
.recipe-controls {
  display: flex; flex-direction: column; gap: 1rem; width: 16.5rem;
  font-size: .88rem; line-height: 1.4; font-variant-numeric: tabular-nums;
}
.recipe-controls-section { display: flex; flex-direction: column; gap: .6rem; }
.recipe-controls-title { margin: 0; font-weight: 600; }
.recipe-controls-hint { margin: -.4rem 0 .1rem; opacity: .65; font-size: .8rem; }
// Avoid a lone last word where the browser can, without balance's ragged right edge.
.recipe-controls-hint, .recipe-amount-toggle small { text-wrap: pretty; }
.recipe-controls button { font: inherit; color: inherit; cursor: pointer; }

// One segmented control: the number between its − and +.
.recipe-scale-stepper {
  display: grid; grid-template-columns: 2.5rem 1fr 2.5rem; height: 2.5rem;
  border-radius: .5rem; background: var(--color-bg-quantity-subingredient); overflow: hidden;
  button {
    padding: 0; border: 0; background: none; font-size: 1.15rem; line-height: 1;
    &:hover:not(:disabled) { background: var(--color-bg-quantity-subingredient); }
    &:disabled { opacity: .3; cursor: default; }
    &:focus-visible { outline: 2px solid var(--color-subingredient-name); outline-offset: -2px; border-radius: .5rem; }
  }
}
.recipe-scale-field {
  display: flex; align-items: baseline; align-self: center; justify-content: center; font-size: 1.05rem; font-weight: 600;
  input {
    // Fixed width (fits "0,1"–"10"): changing the value never moves the number's ×.
    appearance: textfield; width: 3ch; min-width: 0; padding: 0; border: 0; border-radius: 0;
    background: transparent; color: inherit; font: inherit; text-align: right; font-variant-numeric: tabular-nums;
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { appearance: none; margin: 0; }
    &:focus-visible { outline: none; }
  }
  &:focus-within { box-shadow: inset 0 -2px var(--color-subingredient-name); }
}
.recipe-scale-presets {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: .35rem;
  button {
    height: 2rem; padding: 0; border: 1px solid var(--color-bg-quantity-subingredient); border-radius: .4rem;
    background: none; font-weight: 600;
    &:hover { background: var(--color-bg-quantity-subingredient); }
    &[aria-pressed='true'] { background: var(--color-bg-quantity-subingredient); border-color: var(--color-subingredient-name); }
    &:focus-visible { outline: 2px solid var(--color-subingredient-name); outline-offset: 1px; }
  }
  // Fraction glyphs use small, thin numerals: a touch larger to match the whole numbers.
  .is-fraction { font-size: 1.15em; line-height: 1; }
}
.recipe-amount-toggle {
  display: grid; grid-template-columns: auto 1fr; gap: .6rem; align-items: start; cursor: pointer;
  padding-top: 1rem; border-top: var(--sidebar-recipe-border);
  input { margin: .2rem 0 0; width: 1rem; height: 1rem; accent-color: var(--color-subingredient-name); }
  span { display: flex; flex-direction: column; gap: .15rem; font-weight: 500; }
  small { font-size: .8rem; font-weight: 400; opacity: .65; }
}
/* Comfortable tap targets on touch screens. */
@media (pointer: coarse) {
  .recipe-scale-stepper { grid-template-columns: 44px 1fr 44px; height: 44px; }
  .recipe-scale-presets button { height: 40px; }
}
</style>
