<template>
  <span v-if="viewer?.groups.value.length" class="recipe-scale-menu">
    <!-- The chip always shows the current scale; the stepper and options live in a popover
         so they take no room in the list and never move when the list reflows. -->
    <button ref="trigger" type="button" class="recipe-scale-chip" :class="[`is-${placement}`, { 'is-scaled': viewer.scaled.value }]"
      :popovertarget="popoverId" aria-haspopup="dialog" :aria-expanded="open" title="Ajustar cantidades"
      :aria-label="`Ajustar cantidades (${formatRecipeNumber(viewer.scale.value)}×)`">
      <span>{{ formatRecipeNumber(viewer.scale.value) }}<span class="recipe-times">×</span></span>
      <Icon name="tabler:chevron-down" aria-hidden="true" />
    </button>
    <div :id="popoverId" ref="popover" popover class="recipe-scale-popover" :class="`is-${placement}`" role="dialog"
      aria-label="Ajustar cantidades" @toggle="onToggle">
      <RecipeControls />
    </div>
  </span>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { formatRecipeNumber } from '~/utils/recipe.mjs'

// `above` for the drawer's bottom bar, `below` for the list's title row.
const props = withDefaults(defineProps<{ placement?: 'above' | 'below' }>(), { placement: 'below' })
const viewer = useRecipeViewer()
const popoverId = `recipe-scale-${useId()}`
const trigger = ref<HTMLButtonElement>()
const popover = ref<HTMLElement>()
const open = ref(false)

// The popover lives in the top layer (above the open drawer), so place it by hand next to
// the chip, right edges aligned. CSS anchor positioning isn't everywhere yet.
function position() {
  const button = trigger.value, element = popover.value
  if (!button || !element) return
  const rect = button.getBoundingClientRect()
  const gap = 8
  const right = document.documentElement.clientWidth - rect.right
  element.style.right = `${Math.max(right, 8)}px`
  if (props.placement === 'above') {
    element.style.top = 'auto'
    element.style.bottom = `${window.innerHeight - rect.top + gap}px`
  } else {
    element.style.bottom = 'auto'
    element.style.top = `${rect.bottom + gap}px`
  }
}
function onToggle(event: Event) {
  open.value = (event as ToggleEvent).newState === 'open'
  if (open.value) {
    position()
    window.addEventListener('scroll', position, { passive: true })
    window.addEventListener('resize', position)
  } else {
    window.removeEventListener('scroll', position)
    window.removeEventListener('resize', position)
  }
}
onBeforeUnmount(() => {
  window.removeEventListener('scroll', position)
  window.removeEventListener('resize', position)
})
</script>

<style lang="scss">
.recipe-scale-menu { display: inline-flex; }
// The × after a scale ("1,5×"): spaced and lighter than the number, the same in the
// chip, the stepper and the presets.
.recipe-times { padding-left: .1em; opacity: .7; }
.recipe-scale-chip {
  display: inline-flex; align-items: center; gap: .4em;
  border: 0; border-radius: .2em; padding: .3em .55em; min-height: 2rem;
  background: none; color: inherit; cursor: pointer;
  font-family: var(--font-family-base, inherit); font-size: .88rem; font-weight: 600; line-height: 1;
  font-variant-numeric: tabular-nums; letter-spacing: normal;
  // Trimmed to the digits' height, so the padding is even above and below them.
  > span { text-box: trim-both cap alphabetic; }
  svg { width: 1.15em; height: 1.15em; opacity: .7; transition: transform .2s ease; }
  // Points where the popover opens, and flips while it is open.
  &[aria-expanded='true'] svg, &.is-above svg { transform: rotate(180deg); }
  &.is-above[aria-expanded='true'] svg { transform: none; }
  &:hover, &[aria-expanded='true'] { background: var(--color-bg-quantity-subingredient); }
  // Scaled: highlighted like the amounts it changes, so it can't go unnoticed.
  &.is-scaled { background: var(--color-bg-quantity-subingredient); }
  &:focus-visible { outline: 2px solid var(--color-subingredient-name); outline-offset: 2px; }
}
.recipe-scale-popover {
  // Undo the UA's centered popover; position() sets top/bottom and right.
  inset: auto; margin: 0; width: max-content; max-width: calc(100vw - 1rem);
  padding: 1rem 1.1rem 1.1rem; border: 0; border-radius: .75rem;
  color: var(--color-text); background: var(--color-bg-0);
  box-shadow: 0 0 0 1px rgb(0 0 0 / .06), 0 .5rem 1.5rem rgb(0 0 0 / .14), 0 .125rem .375rem rgb(0 0 0 / .08);
  &:popover-open { animation: recipe-scale-pop-in .18s cubic-bezier(.16, 1, .3, 1); }
  &.is-above { transform-origin: bottom right; }
  &.is-below { transform-origin: top right; }
}
@media (pointer: coarse) { .recipe-scale-chip { min-height: 44px; } }
@keyframes recipe-scale-pop-in { from { opacity: 0; transform: scale(.94); } }
@media (prefers-reduced-motion: reduce) { .recipe-scale-popover:popover-open { animation: none; } }
@media print { .recipe-scale-menu { display: none !important; } }
</style>
