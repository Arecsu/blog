<template>
  <span v-if="viewer?.groups.value.length" class="recipe-scale-menu">
    <!-- The chip always shows the current scale; the stepper and options live in a popover
         so they take no room in the list and never move when the list reflows. -->
    <button type="button" class="recipe-scale-chip" :style="{ 'anchor-name': recipePopoverAnchor(popoverId) }" :class="`is-${placement}`"
      :popovertarget="popoverId" aria-haspopup="dialog" :aria-expanded="open" title="Ajustar cantidades"
      :aria-label="`Ajustar cantidades (${formatRecipeNumber(viewer.scale.value)}×)`">
      <span>{{ formatRecipeNumber(viewer.scale.value) }}<span class="recipe-times">×</span></span>
      <Icon name="tabler:chevron-down" aria-hidden="true" />
    </button>
    <RecipePopover :id="popoverId" :placement="placement" class="recipe-scale-popover" aria-label="Ajustar cantidades"
      @toggle="open = $event">
      <RecipeControls />
    </RecipePopover>
  </span>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { formatRecipeNumber } from '~/utils/recipe.mjs'
import { recipePopoverAnchor } from '~/utils/recipe-popover'

// `above` for the drawer's bottom bar, `below` for the list's title row.
withDefaults(defineProps<{ placement?: 'above' | 'below' }>(), { placement: 'below' })
const viewer = useRecipeViewer()
const popoverId = `recipe-scale-${useId()}`
const open = ref(false)
</script>

<style lang="scss">
.recipe-scale-menu { display: inline-flex; }
// The × after a scale ("1,5×"): spaced and lighter than the number, the same in the
// chip, the stepper and the presets.
.recipe-times { padding-left: .1em; opacity: .7; }
.recipe-scale-chip {
  display: inline-flex; align-items: center; gap: .4em;
  // Wider than tall, the same shape beside the big title and in the drawer's bar.
  border: 0; border-radius: .2em; padding: .5em .75em;
  background: var(--color-bg-quantity-subingredient); color: inherit; cursor: pointer;
  font-family: var(--font-family-base, inherit); font-size: .88rem; font-weight: 600; line-height: 1;
  font-variant-numeric: tabular-nums; letter-spacing: normal;
  // Trimmed to the digits' height, so the padding is even above and below them.
  > span { text-box: trim-both cap alphabetic; }
  svg { width: 1.15em; height: 1.15em; opacity: .7; transition: transform .2s ease; }
  // Points where the popover opens, and flips while it is open.
  &[aria-expanded='true'] svg, &.is-above svg { transform: rotate(180deg); }
  &.is-above[aria-expanded='true'] svg { transform: none; }
  &:focus-visible { outline: 2px solid var(--color-subingredient-name); outline-offset: 2px; }
}
// RecipeControls is 16.5rem wide, plus the popover's padding.
.recipe-scale-popover { --recipe-popover-width: 18.7rem; }
// On touch screens the 44px tap target is an invisible extension, so the chip keeps its
// shape instead of growing to 44px tall.
@media (pointer: coarse) {
  .recipe-scale-chip { position: relative; }
  .recipe-scale-chip::before { content: ''; position: absolute; inset: 50% 0 auto; height: 44px; translate: 0 -50%; }
}
@media print { .recipe-scale-menu { display: none !important; } }
</style>
