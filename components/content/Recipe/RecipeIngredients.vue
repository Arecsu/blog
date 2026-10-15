<template>
  <section id="ingredientes" ref="ingredientsElement" class="ingredients" :class="{ 'is-sticky': sticky }" :aria-labelledby="`${id}-title`"
    :style="viewer?.drawerOpen.value ? { minHeight: `${placeholderHeight}px` } : undefined">
    <h2 :id="`${id}-title`" class="ingredients-title">
      <Icon name="fluent-emoji:spoon" /> Ingredientes
    </h2>
    <div ref="panel" class="recipe-ingredient-panel">
      <!-- Markdown slots render once (v-once): re-invoking them on reactive updates
           makes Vue warn about slots called outside the render function. -->
      <div v-once class="recipe-ingredients-intro"><slot name="IngredientsIntro" /></div>
      <RecipeControls />
      <div v-if="viewer?.groups.value.length" class="subingredients">
          <RecipeSubingredient v-for="group in viewer.groups.value" :key="group.id" :name="group.label" :name-parts="group.labelParts" :group-id="group.id">
            <template v-if="group.note">
              <p v-if="group.noteParts"><RecipeRichText :parts="group.noteParts" /></p>
              <p v-for="(paragraph, index) in group.note.split(/\n{2,}/)" v-else :key="index">{{ paragraph }}</p>
            </template>
            <ul v-if="group.items.length">
              <li v-for="item in group.items" :key="item.id">
                <!-- The amount chip leads, unless the label places it with `{}` ("Jugo de {} naranja"). -->
                <template v-if="!hasPrimaryAmount(item.label) && (item.quantity !== undefined || item.amount)"><span
                  class="recipe-ingredient-quantity">{{ item.quantity !== undefined ? formatRecipeAmount(item.quantity, item.unit, viewer.scale.value, item.quantityMax) : item.amount }}</span>{{ ' ' }}</template>
                <RecipeRichText :text="item.label" :parts="item.labelParts" :item="item" :scale="viewer.scale.value" chips /><template
                  v-if="item.note || item.allocations?.length"> (<RecipeRichText v-if="item.note" :text="item.note" :parts="item.noteParts"
                  :item="item" :scale="viewer.scale.value" /><template v-if="item.note && item.allocations?.length">; </template><template
                  v-if="item.allocations?.length">{{ item.allocations.map(part => `${formatRecipeAmount(part.quantity, item.unit, viewer.scale.value)} ${part.label.toLowerCase()}`).join(' + ') }}</template>)</template>
              </li>
            </ul>
          </RecipeSubingredient>
      </div>
      <div v-else v-once class="subingredients"><slot /></div>
    </div>
    <div v-if="viewer" class="recipe-mobile-dock" :class="{ 'is-reading-process': readingProcess }" :inert="!readingProcess">
      <span class="recipe-dock-section"><span>Estás en</span><strong>{{ dockLabel }}</strong></span>
      <button ref="drawerTrigger" type="button" :aria-controls="`${id}-drawer`" :aria-expanded="viewer.drawerOpen.value" aria-haspopup="dialog" @click="openDrawer">Ingredientes<small v-if="viewer.scaled.value">{{ formatRecipeNumber(viewer.scale.value) }}×</small></button>
    </div>
    <dialog :id="`${id}-drawer`" ref="drawer" class="recipe-ingredient-drawer" :aria-labelledby="`${id}-drawer-title`" @close="onClose" @cancel.prevent="closeDrawer" @click="onBackdrop">
      <!-- Bottom-up, like the dock that opens it: list on top, then the tabs, then title and
           close where the "Ingredientes" button was, all within thumb reach. Anchored to the
           bottom, a height change between tabs only moves the sheet's top edge. -->
      <!-- Focus the list (not the close button) so opening by tap shows no focus ring. -->
      <div ref="drawerContent" class="recipe-drawer-content" tabindex="-1" autofocus @scroll.passive="updateFades()"></div>
      <div v-if="viewer?.activeGroup.value" class="recipe-drawer-tabs" role="group" aria-label="Ingredientes que se muestran">
        <button type="button" :aria-pressed="viewer.drawerScope.value === 'current'" @click="setScope('current')">{{ viewer.activeGroup.value.label }}</button>
        <button type="button" :aria-pressed="viewer.drawerScope.value === 'all'" @click="setScope('all')">Todos</button>
      </div>
      <footer class="recipe-drawer-header">
        <h2 :id="`${id}-drawer-title`">Ingredientes</h2>
        <button type="button" aria-label="Cerrar ingredientes y volver al procedimiento" @click="closeDrawer">×</button>
      </footer>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { formatRecipeAmount, formatRecipeNumber, hasPrimaryAmount } from '~/utils/recipe.mjs'
const viewer = useRecipeViewer()
// Scaling and the drawer need JavaScript; hide their controls otherwise.
useHead({ noscript: [{ innerHTML: '<style>.recipe-mobile-dock, .recipe-controls { display: none !important; }</style>' }] })
const id = `recipe-ingredients-${useId()}`
const ingredientsElement = ref<HTMLElement>()
const placeholderHeight = ref(0)
const drawer = ref<HTMLDialogElement>()
const drawerContent = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const drawerTrigger = ref<HTMLButtonElement>()
const sticky = ref(false)
const readingProcess = computed(() => Boolean(viewer?.currentSection.value.id || viewer?.currentSection.value.label === 'Proceso'))
// Keep the last step name while the bar slides away, instead of flashing "Ingredientes".
const dockLabel = ref('Proceso')
watch(() => viewer?.currentSection.value, section => { if (readingProcess.value && section) dockLabel.value = section.label })
let previousOverflow = ''
let previousGutter = ''
let locked = false
const drawerScrolls = new Map<string, number>()
// Must match the side-by-side breakpoint in pages/recetas/[...slug].vue.
let sideBySide: MediaQueryList | undefined
let resizeObserver: ResizeObserver | undefined

async function openDrawer() {
  if (!viewer || !drawer.value || drawer.value.open) return
  // Move the same list into the sheet (no second copy), keeping its page footprint so the
  // procedure never jumps. A plain DOM move: a <Teleport> into this component's own dialog
  // broke unmounting when navigating between recipes.
  placeholderHeight.value = ingredientsElement.value?.getBoundingClientRect().height || 0
  viewer.drawerOpen.value = true
  await nextTick()
  movePanel(true)
  previousOverflow = document.documentElement.style.overflow
  previousGutter = document.documentElement.style.scrollbarGutter
  if (window.innerWidth > document.documentElement.clientWidth) document.documentElement.style.scrollbarGutter = 'stable'
  document.documentElement.style.overflow = 'hidden'
  locked = true
  drawer.value.showModal()
  if (drawerContent.value) drawerContent.value.scrollTop = drawerScrolls.get(scopeKey()) || 0
  updateFades(true)
}
function scopeKey() {
  return viewer?.drawerScope.value === 'current' && viewer.activeGroup.value ? viewer.activeGroup.value.id : 'all'
}
function unlock() {
  if (locked) {
    document.documentElement.style.overflow = previousOverflow
    document.documentElement.style.scrollbarGutter = previousGutter
  }
  locked = false
}
// Slide the sheet out first, then really close: closing right away would also move the
// list back into the page mid-animation, leaving an empty sheet sliding down.
let closing = false
function closeDrawer() {
  const dialog = drawer.value
  if (!dialog?.open || closing) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return dialog.close()
  closing = true
  dialog.classList.add('is-closing')
  const finish = () => {
    clearTimeout(fallback)
    dialog.removeEventListener('animationend', onEnd)
    dialog.classList.remove('is-closing')
    closing = false
    dialog.close()
  }
  const onEnd = (event: AnimationEvent) => { if (event.target === dialog && !event.pseudoElement) finish() }
  dialog.addEventListener('animationend', onEnd)
  const fallback = setTimeout(finish, 450)
}
// Fade the list's edges only where there is more to scroll to. The fades ease while
// scrolling, but snap into place for new content (opening, switching tabs).
function updateFades(instant = false) {
  const content = drawerContent.value
  if (!content) return
  if (instant) content.classList.add('is-instant')
  content.classList.toggle('can-scroll-up', content.scrollTop > 1)
  content.classList.toggle('can-scroll-down', content.scrollTop + content.clientHeight < content.scrollHeight - 1)
  if (instant) {
    content.getBoundingClientRect() // commit the new fades before transitions return
    requestAnimationFrame(() => content.classList.remove('is-instant'))
  }
}
let panelHome: Comment | undefined
function movePanel(intoDrawer: boolean) {
  if (!panel.value || !drawerContent.value) return
  if (intoDrawer && panel.value.parentNode !== drawerContent.value) {
    panelHome = document.createComment('recipe-ingredient-panel')
    panel.value.before(panelHome)
    drawerContent.value.append(panel.value)
  } else if (!intoDrawer && panelHome) {
    panelHome.replaceWith(panel.value)
    panelHome = undefined
  }
}
function onClose() {
  drawerScrolls.set(scopeKey(), drawerContent.value?.scrollTop || 0)
  movePanel(false)
  if (viewer) viewer.drawerOpen.value = false
  unlock()
  drawerTrigger.value?.focus({ preventScroll: true })
}
function onBackdrop(event: MouseEvent) {
  if (event.target !== drawer.value) return
  const rect = drawer.value.getBoundingClientRect()
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDrawer()
}
async function setScope(scope: string) {
  drawerScrolls.set(scopeKey(), drawerContent.value?.scrollTop || 0)
  if (viewer) viewer.drawerScope.value = scope
  await nextTick()
  if (drawerContent.value) drawerContent.value.scrollTop = drawerScrolls.get(scopeKey()) || 0
  updateFades(true)
}
// Follow the procedure only when the whole list fits on screen; a taller list
// would hide its end, so it scrolls with the page as it always did.
function updateSticky() {
  const element = ingredientsElement.value
  if (!element || !sideBySide?.matches || viewer?.drawerOpen.value) {
    sticky.value = false
    return
  }
  const offset = parseFloat(getComputedStyle(element).scrollMarginTop) || 0
  sticky.value = element.offsetHeight + offset * 2 <= window.innerHeight
}
// The dock and drawer live in the recipe's body column (right of the sidebar title), not
// across the whole viewport. Their edge sits one page margin from the sidebar's line (the
// same blank space as on the right); the dock's text starts at that edge, while the
// drawer's list is inset to line up with the body text.
// Custom properties only: no reactive state, no re-render.
function updateColumn() {
  const element = ingredientsElement.value
  const column = element?.closest('.recipe-container')
  if (!element || !column) return
  const rect = column.getBoundingClientRect()
  const right = document.documentElement.clientWidth - rect.right
  const sidebar = column.parentElement?.querySelector<HTMLElement>('.recipe-sidebar')
  const sidebarRight = sidebar?.offsetWidth ? sidebar.getBoundingClientRect().right : undefined
  const left = sidebarRight === undefined ? rect.left : Math.min(rect.left, sidebarRight + right)
  element.style.setProperty('--recipe-column-left', `${left}px`)
  element.style.setProperty('--recipe-column-right', `${right}px`)
  element.style.setProperty('--recipe-column-inset', `${rect.left - left}px`)
}
function onBreakpoint() {
  if (sideBySide?.matches) closeDrawer()
  updateSticky()
}
onMounted(() => {
  sideBySide = window.matchMedia('(min-width: 90.001rem)')
  sideBySide.addEventListener('change', onBreakpoint)
  window.addEventListener('resize', updateSticky)
  resizeObserver = new ResizeObserver(() => { updateSticky(); updateColumn(); updateFades(true) })
  if (ingredientsElement.value) resizeObserver.observe(ingredientsElement.value)
  // The list's height changes with scaling and the group/"Todos" tabs.
  if (panel.value) resizeObserver.observe(panel.value)
  if (drawerContent.value) resizeObserver.observe(drawerContent.value)
  const column = ingredientsElement.value?.closest('.recipe-container')
  if (column) resizeObserver.observe(column)
  updateSticky()
  updateColumn()
})
onBeforeUnmount(() => {
  // Put the list back first: the dialog's close event would arrive after unmounting.
  movePanel(false)
  drawer.value?.close()
  unlock()
  sideBySide?.removeEventListener('change', onBreakpoint)
  window.removeEventListener('resize', updateSticky)
  resizeObserver?.disconnect()
})
</script>

<style lang="scss">
.ingredients {
  grid-area: two;
  // Hug the content (not the procedure's row height) so it can be measured and stick.
  align-self: start;
  padding-bottom: 1rem;
  scroll-margin-top: calc(var(--header-height) + 1.5rem);

  &.is-sticky {
    position: sticky;
    top: calc(var(--header-height) + 1.5rem);
  }
}

.ingredients-title {
  svg {
    margin-left: -.1em;
    transform: translateY(-.1em);
  }
}

.subingredients {
  width: 100%;
  columns: 16rem auto;
  gap: 2rem;

  @media (max-width: 38rem) {
    columns: unset;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: .7em;

    &:before {
      content: '- ';
      opacity: .7;
    }
  }

  code,
  .recipe-ingredient-quantity {
    font-family: inherit;
    background-color: var(--color-bg-quantity-subingredient);
    font-weight: 500;
    padding: .20em .35em;
    font-size: .88em;
    border-radius: .2em;
  }
}

.recipe-ingredients-intro { display: contents; }

.recipe-mobile-dock { display: none; }

.recipe-ingredient-drawer {
  position: fixed; inset: auto var(--recipe-column-right, 0) 0 var(--recipe-column-left, 0); margin: 0; padding: 0; width: auto; max-width: none;
  max-height: 86dvh; color: var(--color-text); background: var(--color-bg-0);
  border: 0; border-radius: 1rem 1rem 0 0; overflow: hidden;
  &[open] { display: flex; flex-direction: column; animation: recipe-drawer-in .38s cubic-bezier(.16, 1, .3, 1); }
  &.is-closing { animation: recipe-drawer-out .26s cubic-bezier(.4, 0, 1, 1) forwards; }
  &::backdrop { background: rgb(0 0 0 / .3); }
  &[open]::backdrop { animation: recipe-backdrop-in .38s ease-out; }
  &.is-closing::backdrop { animation: recipe-backdrop-out .26s ease-in forwards; }
  // Breathing room inside the sheet on both sides; on tablets the left one still lines
  // the list up with the body text.
  --recipe-sheet-padding: max(var(--recipe-column-inset, 0px), var(--padding-inline-main, 1rem));
}
.recipe-drawer-header {
  display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-shrink: 0;
  // Inset line like the dock's: blank space at both ends, title and × aligned to it.
  margin-inline: var(--recipe-sheet-padding);
  padding: .35rem 0 max(.35rem, env(safe-area-inset-bottom));
  border-top: var(--sidebar-recipe-border);
  h2 { margin: 0; font-size: 1.6rem; line-height: 44px; }
  button { background: none; border: 0; color: inherit; font-size: 2rem; line-height: 1; min-width: 44px; min-height: 44px; margin-right: -.5rem; }
}
.recipe-drawer-tabs {
  display: flex; gap: 1.25rem; padding: .25rem var(--recipe-sheet-padding); flex-shrink: 0;
  button {
    background: none; border: 0; color: inherit; min-height: 44px; padding: 0; font-size: .9rem;
    opacity: .6; text-decoration: underline transparent 2px; text-underline-offset: .4em;
  }
  button[aria-pressed='true'] { opacity: 1; text-decoration-color: var(--color-subingredient-name); }
}
.recipe-drawer-content {
  overflow-y: auto; overscroll-behavior: contain; min-height: 0;
  padding: 1.5rem var(--recipe-sheet-padding) .5rem;
  scrollbar-width: thin;
  outline: none;
  // Edge fades hint at more ingredients above/below; they ease in and out (animatable
  // thanks to @property) and vanish once the list reaches that end.
  --recipe-fade-top: 0px;
  --recipe-fade-bottom: 0px;
  mask-image: linear-gradient(to bottom, transparent 0, #000 var(--recipe-fade-top), #000 calc(100% - var(--recipe-fade-bottom)), transparent 100%);
  transition: --recipe-fade-top .25s ease, --recipe-fade-bottom .25s ease;
  &.can-scroll-up { --recipe-fade-top: 3rem; }
  &.can-scroll-down { --recipe-fade-bottom: 3rem; }
  &.is-instant { transition: none; }
  .subingredients { columns: unset; }
}

@media (max-width: 90rem) {
  // Always laid out (constant height, which the section tracking measures) and slid off
  // screen when not needed; toggling display made the reading area, and the bar, flicker.
  .recipe-mobile-dock {
    display: flex; position: fixed; z-index: 4; align-items: center; justify-content: space-between; gap: .75rem;
    inset: auto var(--recipe-column-right, 0) 0 var(--recipe-column-left, 0);
    padding: .35rem 0 max(.35rem, env(safe-area-inset-bottom));
    background: var(--color-bg-0); border-top: var(--sidebar-recipe-border);
    transform: translateY(calc(100% + 2px)); visibility: hidden;
    transition: transform .28s cubic-bezier(.4, 0, 1, 1), visibility 0s linear .28s;
    &.is-reading-process {
      transform: none; visibility: visible;
      transition: transform .38s cubic-bezier(.16, 1, .3, 1), visibility 0s;
    }
    > button {
      border: 0; border-radius: .2em; background: var(--color-bg-quantity-subingredient); color: inherit;
      min-height: 44px; padding: .4rem .8rem; white-space: nowrap; font: inherit; font-weight: 500;
    }
    small { padding-left: .5rem; font-variant-numeric: tabular-nums; }
  }
  .recipe-dock-section { display: flex; flex-direction: column; min-width: 0; font-size: .85rem; line-height: 1.3; }
  .recipe-dock-section > span { font-size: .7rem; opacity: .6; }
  .recipe-dock-section strong { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}

@property --recipe-fade-top { syntax: '<length>'; inherits: false; initial-value: 0px; }
@property --recipe-fade-bottom { syntax: '<length>'; inherits: false; initial-value: 0px; }
@keyframes recipe-drawer-in { from { transform: translateY(100%); } to { transform: none; } }
@keyframes recipe-drawer-out { from { transform: none; } to { transform: translateY(100%); } }
@keyframes recipe-backdrop-in { from { opacity: 0; } }
@keyframes recipe-backdrop-out { to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .recipe-ingredient-drawer[open], .recipe-ingredient-drawer[open]::backdrop { animation: none; }
  .recipe-drawer-content { transition: none; }
  .recipe-mobile-dock, .recipe-mobile-dock.is-reading-process { transition: none; }
}
@media print {
  .recipe-mobile-dock, .recipe-ingredient-drawer, .recipe-controls { display: none !important; }
  .ingredients.is-sticky { position: static; }
}
</style>
