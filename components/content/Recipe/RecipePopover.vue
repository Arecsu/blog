<template>
  <component :is="tag" :id="id" ref="popover" popover class="recipe-popover" :class="`is-${placement}`"
    :style="{ 'position-anchor': recipePopoverAnchor(id) }" role="dialog" @toggle="onToggle">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { recipePopoverAnchor } from '~/utils/recipe-popover'

// The recipe's floating panels (scale controls, an amount's detail), tethered with CSS
// anchor positioning to the button that opens them. That button needs
// `:popovertarget="id"` and `:style="{ 'anchor-name': recipePopoverAnchor(id) }"`.
// `tag`: a <span> when it lives inside a paragraph, where a <div> isn't allowed.
const props = withDefaults(defineProps<{ id: string; placement?: 'above' | 'below'; tag?: 'div' | 'span' }>(),
  { placement: 'below', tag: 'div' })
const emit = defineEmits<{ toggle: [open: boolean] }>()
const popover = ref<HTMLElement>()

// Scrolling away closes it, past a small distance so a stray touch doesn't. Measured per
// scroll container (the page, the drawer's list…); the popover's own content is ignored.
const SCROLL_CLOSE_DISTANCE = 48
let scrollStarts = new Map<EventTarget, [number, number]>()
function scrollPosition(target: EventTarget): [number, number] {
  if (target === document) return [window.scrollX, window.scrollY]
  const element = target as Element
  return [element.scrollLeft, element.scrollTop]
}
function onScroll(event: Event) {
  const target = event.target
  if (!target || popover.value?.contains(target as Node)) return
  const start = scrollStarts.get(target)
  // A container first seen mid-scroll counts from there: its position at opening is gone.
  if (!start) return void scrollStarts.set(target, scrollPosition(target))
  const [x, y] = scrollPosition(target)
  if (Math.hypot(x - start[0], y - start[1]) > SCROLL_CLOSE_DISTANCE) popover.value?.hidePopover()
}
function stopWatching() {
  document.removeEventListener('scroll', onScroll, { capture: true })
}
function onToggle(event: Event) {
  const open = (event as ToggleEvent).newState === 'open'
  if (open) {
    scrollStarts = new Map([[document, scrollPosition(document)]])
    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
  } else stopWatching()
  emit('toggle', open)
}
onBeforeUnmount(stopWatching)
</script>

<style lang="scss">
.recipe-popover {
  // In the top layer (above the open drawer), placed with anchor() next to its button:
  // right edges aligned, within .5rem of the screen's edges. Placed in CSS, so it's in
  // place from its first frame and follows the button while scrolling. Without room
  // below (or above), it flips to the other side. `inset: auto` and `margin: 0` undo
  // the UA's centering.
  // The width is fixed (--recipe-popover-width, set by each use) so the placement can
  // account for it.
  --recipe-popover-width-used: min(var(--recipe-popover-width, 20rem), 100% - 1rem);
  inset: auto; margin: 0; width: var(--recipe-popover-width-used);
  right: clamp(.5rem, anchor(right), 100% - var(--recipe-popover-width-used) - .5rem);
  position-try-fallbacks: flip-block;
  padding: 1rem 1.1rem 1.1rem; border: 0; border-radius: .75rem;
  color: var(--color-text); background: var(--color-bg-raised); box-shadow: var(--shadow-popover);
  &:popover-open { animation: recipe-popover-in .18s cubic-bezier(.16, 1, .3, 1); }
  &.is-above { bottom: calc(anchor(top) + .5rem); transform-origin: bottom right; }
  &.is-below { top: calc(anchor(bottom) + .5rem); transform-origin: top right; }
  // On phones the popover takes most of the width: centered on screen it looks balanced.
  // But never apart from its button: the inner clamp keeps the button within the
  // popover's span, so as the screen widens it slides from the center to the button,
  // then stays aligned to it. In `right`, anchor(left|right) measure from the screen's
  // right edge to the button's edges.
  @media (max-width: 40rem) {
    right: clamp(.5rem,
      clamp(anchor(left) - var(--recipe-popover-width-used), (100% - var(--recipe-popover-width-used)) / 2, anchor(right)),
      100% - var(--recipe-popover-width-used) - .5rem);
    &.is-above { transform-origin: bottom center; }
    &.is-below { transform-origin: top center; }
  }
}
@keyframes recipe-popover-in { from { opacity: 0; transform: scale(.94); } }
@media (prefers-reduced-motion: reduce) { .recipe-popover:popover-open { animation: none; } }
</style>
