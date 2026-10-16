<template>
  <span v-if="viewer?.groups.value.length" class="recipe-scale-menu">
    <!-- The chip always shows the current scale; the stepper and options live in a popover
         so they take no room in the list and never move when the list reflows. -->
    <button type="button" class="recipe-scale-chip" :style="{ 'anchor-name': anchorName }" :class="`is-${placement}`"
      :popovertarget="popoverId" aria-haspopup="dialog" :aria-expanded="open" title="Ajustar cantidades"
      :aria-label="`Ajustar cantidades (${formatRecipeNumber(viewer.scale.value)}×)`">
      <span>{{ formatRecipeNumber(viewer.scale.value) }}<span class="recipe-times">×</span></span>
      <Icon name="tabler:chevron-down" aria-hidden="true" />
    </button>
    <div :id="popoverId" popover class="recipe-scale-popover" :class="`is-${placement}`" :style="{ 'position-anchor': anchorName }" role="dialog"
      aria-label="Ajustar cantidades" @toggle="onToggle">
      <RecipeControls />
    </div>
  </span>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { formatRecipeNumber } from '~/utils/recipe.mjs'

// `above` for the drawer's bottom bar, `below` for the list's title row.
withDefaults(defineProps<{ placement?: 'above' | 'below' }>(), { placement: 'below' })
const viewer = useRecipeViewer()
const popoverId = `recipe-scale-${useId()}`
// Named, not the implicit anchor of `popovertarget`, which not every browser resolves.
const anchorName = `--${popoverId}`
const open = ref(false)

function onToggle(event: Event) {
  open.value = (event as ToggleEvent).newState === 'open'
}
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
.recipe-scale-popover {
  // In the top layer (above the open drawer), tethered with anchor() to its chip
  // (position-anchor, set inline): right edges aligned, never closer than .5rem to
  // the viewport's edge. Placed in CSS, so it's in place from its first frame and follows
  // the chip while scrolling. `inset: auto` and `margin: 0` undo the UA's centering.
  inset: auto; margin: 0; width: max-content; max-width: calc(100vw - 1rem);
  right: max(anchor(right), .5rem);
  padding: 1rem 1.1rem 1.1rem; border: 0; border-radius: .75rem;
  color: var(--color-text); background: var(--color-bg-raised); box-shadow: var(--shadow-popover);
  &:popover-open { animation: recipe-scale-pop-in .18s cubic-bezier(.16, 1, .3, 1); }
  &.is-above { bottom: calc(anchor(top) + .5rem); transform-origin: bottom right; }
  &.is-below { top: calc(anchor(bottom) + .5rem); transform-origin: top right; }
  // On phones the popover takes most of the width: centered on screen it looks balanced.
  // But never apart from its chip: clamp() keeps the chip within the popover's span,
  // so as the screen widens it slides from the center to the chip, then stays aligned to
  // it. In `right`, anchor(left|right) measure from the screen's right edge to the chip's
  // edges. The width is fixed (RecipeControls' 16.5rem + padding) so the clamp can use it.
  @media (max-width: 40rem) {
    --recipe-popover-width: min(18.7rem, 100% - 1rem);
    width: var(--recipe-popover-width);
    right: max(.5rem, clamp(anchor(left) - var(--recipe-popover-width), (100% - var(--recipe-popover-width)) / 2, anchor(right)));
    &.is-above { transform-origin: bottom center; }
    &.is-below { transform-origin: top center; }
  }
}
// On touch screens the 44px tap target is an invisible extension, so the chip keeps its
// shape instead of growing to 44px tall.
@media (pointer: coarse) {
  .recipe-scale-chip { position: relative; }
  .recipe-scale-chip::before { content: ''; position: absolute; inset: 50% 0 auto; height: 44px; translate: 0 -50%; }
}
@keyframes recipe-scale-pop-in { from { opacity: 0; transform: scale(.94); } }
@media (prefers-reduced-motion: reduce) { .recipe-scale-popover:popover-open { animation: none; } }
@media print { .recipe-scale-menu { display: none !important; } }
</style>
