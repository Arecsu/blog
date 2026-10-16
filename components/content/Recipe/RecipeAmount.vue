<template>
  <span class="recipe-inline-ingredient"><ContentSlot v-once :use="$slots.default" unwrap="p" /><template v-if="viewer && viewer.showAmounts.value && resolved">{{ ' ' }}<button
      type="button" class="recipe-inline-amount" :popovertarget="id" :style="{ 'anchor-name': recipePopoverAnchor(id) }"
      aria-haspopup="dialog" :aria-expanded="open" :aria-label="`${label}: ${amount}. Ver detalle`">{{ amount }}</button><RecipePopover
      :id="id" tag="span" class="recipe-amount-popover" :aria-label="label" @toggle="open = $event">
      <span class="recipe-amount-popover-heading"><strong>{{ label }}</strong><button type="button" :popovertarget="id" popovertargetaction="hide" aria-label="Cerrar detalle"><Icon name="tabler:x" aria-hidden="true" /></button></span>
      <span class="recipe-amount-group">{{ resolved.group.label }}</span>
      <span v-if="resolved.allocation">{{ resolved.allocation.label }}: <strong>{{ amount }}</strong></span>
      <span v-else>Cantidad: <strong>{{ amount }}</strong></span>
      <span v-for="part in resolved.ingredient.allocations || []" :key="part.id">{{ part.label }}: {{ formatRecipeAmount(part.quantity, resolved.ingredient.unit, viewer.scale.value) }}</span>
      <span v-if="resolved.ingredient.allocations?.length">Total: {{ formatRecipeAmount(resolved.ingredient.quantity, resolved.ingredient.unit, viewer.scale.value) }}</span>
      <span v-if="note">{{ note }}</span>
      <span v-if="resolved.ingredient.prepared" class="recipe-amount-group">Es parte de una preparación anterior, no un ingrediente extra.</span>
      <span v-if="viewer.scaled.value" class="recipe-amount-group">Receta original: {{ formatRecipeAmount(resolved.quantity, resolved.ingredient.unit, 1, range) }} · Ahora {{ formatRecipeNumber(viewer.scale.value) }}×</span>
    </RecipePopover></template></span>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { formatRecipeAmount, formatRecipeNumber, recipePlainLabel, recipeTextParts, resolveRecipeAmount } from '~/utils/recipe.mjs'
import { recipePopoverAnchor } from '~/utils/recipe-popover'
const props = defineProps<{ ingredient: string; allocation?: string }>()
const viewer = useRecipeViewer()
const id = `recipe-amount-${useId()}`
const open = ref(false)
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
  // Little block padding: chips on consecutive lines of a paragraph must not touch.
  padding: .1em .35em; border: 0; border-radius: .2em; color: inherit; cursor: pointer;
  background: var(--color-bg-quantity-subingredient);
  text-decoration: underline transparent; text-underline-offset: .2em;
  &:hover { text-decoration-color: currentColor; }
}
// Placement, surface and shadow come from RecipePopover; this is only its content.
.recipe-amount-popover {
  --recipe-popover-width: 20rem;
  font-size: .9rem; line-height: 1.6;
  > span { display: block; margin-top: .4rem; }
  .recipe-amount-popover-heading { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin: 0; }
  button {
    display: grid; place-items: center; border: 0; background: none; color: inherit;
    min-width: 44px; min-height: 44px; padding: 0; font-size: 1.4rem; margin: -.6rem -.75rem -.6rem 0;
  }
  .recipe-amount-group { color: var(--recipe-muted); font-size: .8rem; }
}
</style>
