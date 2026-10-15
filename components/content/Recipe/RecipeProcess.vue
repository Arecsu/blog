<template>
  <section id="procedimiento" ref="processElement" class="recipe-process">
    <h2 v-if="process" class="recipe-process-title"><Icon class="recipe-process-icon" name="fluent-emoji:bowl-with-spoon" /> Proceso</h2>
    <p v-if="viewer?.scaled.value" class="recipe-scaled-notice" role="status">Cantidades ajustadas a <strong>{{ formatRecipeNumber(viewer.scale.value) }}×</strong>. Los tiempos y la temperatura son los de la receta original.<template v-if="!viewer.showAmounts.value"> Las cantidades en los pasos están ocultas.</template></p>
    <!-- Static Markdown: render once so scale/section updates don't re-invoke the slot. -->
    <div v-once class="recipe-process-content"><slot /></div>
  </section>
</template>

<script setup lang="ts">
import { formatRecipeNumber, recipeSectionId } from '~/utils/recipe.mjs'
defineProps({ process: Boolean })
const viewer = useRecipeViewer()
const processElement = ref<HTMLElement>()
let headings: HTMLElement[] = []
let frame = 0
interface Section { top: number; id: string; label: string }

// The current section is the one crossing a reading line a third of the way down the
// visible area (below the header, above the mobile dock). The tail of a section left at
// the top of the screen doesn't count; neither does one that only just appeared below.
function updateSection() {
  frame = 0
  const process = processElement.value
  if (!viewer || !process || viewer.drawerOpen.value) return
  const top = parseFloat(getComputedStyle(process).scrollMarginTop) || 0
  // The dock's height is constant whether shown or not (it slides away), so showing it
  // never moves the reading line and can't flip the section back and forth.
  const dock = document.querySelector<HTMLElement>('.recipe-mobile-dock')
  const bottom = window.innerHeight - (dock?.offsetHeight || 0)
  // Over the last half screen of scrolling the line slides down to the bottom, so short
  // sections at the end of a recipe each get their turn instead of being skipped.
  const span = bottom - top
  const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
  const progress = Math.min(1, Math.max(0, 1 - remaining / (span / 2)))
  const readingLine = top + span * (1 / 3 + (2 / 3) * progress) - 1

  // Above the procedure (title, ingredients) the reader isn't following the steps yet.
  let current: Section = { top: -Infinity, id: '', label: 'Ingredientes' }
  const sections: Section[] = [{ top: process.getBoundingClientRect().top, id: '', label: 'Proceso' }]
  for (const heading of headings) {
    const label = heading.textContent?.trim() || ''
    sections.push({ top: heading.getBoundingClientRect().top, id: recipeSectionId(label), label })
  }
  for (const section of sections) {
    if (section.top <= readingLine) current = section
  }
  viewer.currentSection.value = { id: current.id, label: current.label }
}
function onScroll() { if (!frame) frame = requestAnimationFrame(updateSection) }
onMounted(async () => {
  await nextTick()
  headings = Array.from(processElement.value?.querySelectorAll<HTMLElement>('h3, h4') || [])
  // First update on the next frame, like scrolling: updating synchronously here flushes
  // while the lazy content components are still hydrating, and Vue then warns that their
  // Markdown slots were "invoked outside of the render function".
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<style lang="scss">
.recipe-process-icon { transform: translateY(-0.1em); }
.recipe-process {
  min-width: 0; max-width: 40em; grid-area: three; scroll-margin-top: calc(var(--header-height) + 1rem);
  h3, h4 { scroll-margin-top: calc(var(--header-height) + 1rem); }
  ul { list-style: none; }
  ul li { text-indent: -0.7em; }
  ul li:before { content: '- '; }
  ul li, ol li { margin-bottom: 0.8em; }
  .recipe-process-content { display: contents; }
  .recipe-scaled-notice { font-size: .82rem; border-left: 2px solid var(--color-subingredient-name); padding: .6rem .9rem; background: var(--color-bg-quantity-subingredient); margin-block: 0 1.5rem; }
}
</style>
