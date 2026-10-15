<template>
  <span class="recipe-inline-ingredient"><ContentSlot v-once :use="$slots.default" unwrap="p" /><template v-if="viewer && viewer.showAmounts.value && resolved">{{ ' ' }}<button
      type="button" class="recipe-inline-amount" :popovertarget="id"
      :aria-label="`${label}: ${amount}. Ver detalle`">{{ amount }}</button><span
      :id="id" popover class="recipe-amount-popover">
      <span class="recipe-amount-popover-heading"><strong>{{ label }}</strong><button type="button" :popovertarget="id" popovertargetaction="hide" aria-label="Cerrar detalle">×</button></span>
      <span class="recipe-amount-group">{{ resolved.group.label }}</span>
      <span v-if="resolved.allocation">{{ resolved.allocation.label }}: <strong>{{ amount }}</strong></span>
      <span v-else>Cantidad: <strong>{{ amount }}</strong></span>
      <span v-for="part in resolved.ingredient.allocations || []" :key="part.id">{{ part.label }}: {{ formatRecipeAmount(part.quantity, resolved.ingredient.unit, viewer.scale.value) }}</span>
      <span v-if="resolved.ingredient.allocations?.length">Total: {{ formatRecipeAmount(resolved.ingredient.quantity, resolved.ingredient.unit, viewer.scale.value) }}</span>
      <span v-if="note">{{ note }}</span>
      <span v-if="resolved.ingredient.prepared" class="recipe-amount-group">Es parte de una preparación anterior, no un ingrediente extra.</span>
      <span v-if="viewer.scaled.value" class="recipe-amount-group">Receta original: {{ formatRecipeAmount(resolved.quantity, resolved.ingredient.unit, 1, range) }} · Ahora {{ formatRecipeNumber(viewer.scale.value) }}×</span>
    </span></template></span>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { formatRecipeAmount, formatRecipeNumber, recipePlainLabel, recipeTextParts, resolveRecipeAmount } from '~/utils/recipe.mjs'
const props = defineProps<{ ingredient: string; allocation?: string }>()
const viewer = useRecipeViewer()
const id = `recipe-amount-${useId()}`
const resolved = computed(() => viewer ? resolveRecipeAmount(viewer.groups.value, props.ingredient, props.allocation) : undefined)
// A range ("15-20 ml") belongs to the whole ingredient, not to one of its allocations.
const range = computed(() => resolved.value?.allocation ? undefined : resolved.value?.ingredient.quantityMax)
const amount = computed(() => resolved.value ? formatRecipeAmount(resolved.value.quantity, resolved.value.ingredient.unit, viewer?.scale.value, range.value) || resolved.value.ingredient.amount : '')
const label = computed(() => resolved.value ? recipePlainLabel(resolved.value.ingredient) : '')
const note = computed(() => resolved.value?.ingredient.note
  ? recipeTextParts(resolved.value.ingredient.note, resolved.value.ingredient, viewer?.scale.value).map(part => part.value).join('') : '')
</script>

<style lang="scss">
.recipe-inline-amount {
  display: inline; font: inherit; font-size: .88em; font-weight: 500; white-space: nowrap;
  padding: .20em .35em; border: 0; border-radius: .2em; color: inherit; cursor: pointer;
  background: var(--color-bg-quantity-subingredient);
  text-decoration: underline transparent; text-underline-offset: .2em;
  &:hover { text-decoration-color: currentColor; }
}
.recipe-amount-popover {
  width: min(22rem, calc(100vw - 2rem)); padding: 1.1rem 1.25rem;
  background: var(--color-bg-0); color: var(--color-text); border: 1px solid var(--recipe-border);
  border-radius: .4rem; box-shadow: 0 8px 40px #0002; font-size: .9rem; line-height: 1.6;
  inset: 0; margin: auto; height: fit-content;
  > span { display: block; margin-top: .4rem; }
  .recipe-amount-popover-heading { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 0; }
  button { border: 0; background: none; color: inherit; min-width: 44px; min-height: 44px; font-size: 1.5rem; margin: -.5rem -.5rem -.5rem 0; }
  .recipe-amount-group { color: var(--recipe-muted); font-size: .8rem; }
}
</style>
