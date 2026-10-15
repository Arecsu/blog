<template>
  <div v-if="viewer && viewer.groups.value.length" class="recipe-controls">
    <div class="recipe-scale-stepper" role="group" aria-label="Proporción de la receta">
      <button type="button" aria-label="Reducir proporción en 0,1" :disabled="viewer.scale.value <= MIN_RECIPE_SCALE" @click="adjust(-1)">−</button>
      <span class="recipe-scale-field">
        <input v-model="factorInput" name="recipe-scale" type="number" :min="MIN_RECIPE_SCALE" :max="MAX_RECIPE_SCALE" step="any"
          inputmode="decimal" aria-label="Proporción de la receta" title="Multiplicador de la receta, entre 0,1 y 10"
          @input="applyInput" @blur="restoreInput" @keydown.enter.prevent="restoreInput"
          @keydown.up.prevent="adjust(1)" @keydown.down.prevent="adjust(-1)" />
        <span aria-hidden="true">×</span>
      </span>
      <button type="button" aria-label="Aumentar proporción en 0,1" :disabled="viewer.scale.value >= MAX_RECIPE_SCALE" @click="adjust(1)">+</button>
    </div>
    <label v-if="viewer.hasInlineAmounts.value" class="recipe-amount-toggle">
      <input v-model="viewer.showAmounts.value" name="recipe-show-amounts" type="checkbox" /><span>Cantidades en los pasos</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { MIN_RECIPE_SCALE, MAX_RECIPE_SCALE, stepRecipeScale, validRecipeScale } from '~/utils/recipe.mjs'

const viewer = useRecipeViewer()
const factorInput = ref(String(viewer?.scale.value || 1))
watch(() => viewer?.scale.value, value => { factorInput.value = String(value) })

function applyInput(event: Event) {
  const value = (event.target as HTMLInputElement).valueAsNumber
  if (validRecipeScale(value)) viewer?.setScale(value)
}
function restoreInput() { factorInput.value = String(viewer?.scale.value || 1) }
function adjust(direction: number) {
  if (!viewer) return
  viewer.setScale(stepRecipeScale(viewer.scale.value, direction))
  restoreInput()
}
</script>

<style scoped lang="scss">
.recipe-controls {
  display: flex; align-items: center; flex-wrap: wrap; gap: .5rem 1.5rem;
  margin-bottom: 1.75rem; font-size: .88rem; font-variant-numeric: tabular-nums;
}
.recipe-scale-stepper {
  display: flex; align-items: center; gap: .15rem;
  // Optically align the "−" glyph, not its hit area, with the text edge.
  margin-inline-start: -.65rem;
  button {
    width: 2rem; height: 2rem; padding: 0; border: 0; border-radius: .2em;
    background: none; color: inherit; font-size: 1.1rem; line-height: 1; cursor: pointer;
  }
  button:hover:not(:disabled) { background: var(--color-bg-quantity-subingredient); }
  button:disabled { opacity: .3; cursor: default; }
}
.recipe-scale-field {
  display: flex; align-items: baseline; font-weight: 500;
  background: var(--color-bg-quantity-subingredient); border-radius: .2em; padding: .2em .4em;
  input {
    // Fixed width (fits "0.1"–"10" and "1.2"): changing the value never moves − and +.
    appearance: textfield; width: 3ch; min-width: 0; padding: 0; border: 0; border-radius: 0;
    background: transparent; color: inherit; font: inherit; text-align: center; font-variant-numeric: tabular-nums;
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { appearance: none; margin: 0; }
  }
  // Ring the whole rounded chip (number and ×), not the bare input inside it.
  &:focus-within { outline: 2px solid var(--color-subingredient-name); outline-offset: 2px; }
}
.recipe-controls .recipe-scale-field input:focus-visible { outline: none; }
.recipe-amount-toggle {
  display: flex; align-items: center; gap: .45rem; cursor: pointer; opacity: .75;
  input { margin: 0; width: .9rem; height: .9rem; accent-color: var(--color-subingredient-name); }
}
/* Comfortable tap targets without inflating the desktop row. */
@media (pointer: coarse) {
  .recipe-scale-stepper { margin-inline-start: -15px; }
  .recipe-scale-stepper button { width: 44px; height: 44px; }
  .recipe-amount-toggle { min-height: 44px; }
}
</style>
