import { computed, inject, provide, ref, watch, onMounted, type InjectionKey, type Ref } from 'vue'
import { legacyRecipeGroups, recipeSectionId, validateRecipeIngredients, validRecipeScale } from '~/utils/recipe.mjs'

export interface RecipeIngredient {
  id: string
  label: string
  quantity?: number
  unit?: string
  amount?: string
  note?: string
  whole?: boolean
  prepared?: boolean
  allocations?: { id: string; label: string; quantity: number }[]
}

export interface RecipeIngredientGroup {
  id: string
  label: string
  sections?: string[]
  items: RecipeIngredient[]
}

export function createRecipeViewer(recipe: Ref<any>) {
  const groups = computed<RecipeIngredientGroup[]>(() => validateRecipeIngredients(recipe.value.ingredientGroups || []))
  const groupLabels = computed<{ id: string; label: string; sections?: string[] }[]>(() =>
    groups.value.length ? groups.value : legacyRecipeGroups(recipe.value.body))
  const scale = ref(1)
  const showAmounts = ref(true)
  const currentSection = ref({ id: '', label: '' })
  const drawerOpen = ref(false)
  const drawerScope = ref('current')
  // Sections without a matching group (e.g. "Armado final") have no active group, so the
  // drawer shows every ingredient: the full list is always right, a guessed group may not be.
  const activeGroup = computed(() => currentSection.value.id ? groupLabels.value.find(group =>
    group.id === currentSection.value.id || recipeSectionId(group.label) === currentSection.value.id ||
    group.sections?.includes(currentSection.value.id)) : undefined)
  const scaled = computed(() => Math.abs(scale.value - 1) > 0.000001)
  const hasInlineAmounts = computed(() => Boolean(recipe.value.inlineAmounts))

  // Persist only a display preference. A new recipe always starts at its original quantity.
  onMounted(() => {
    try { showAmounts.value = localStorage.getItem('recipe-show-amounts') !== 'false' } catch {}
    watch(showAmounts, value => {
      try { localStorage.setItem('recipe-show-amounts', String(value)) } catch {}
    })
  })

  function setScale(value: number) {
    if (validRecipeScale(value)) scale.value = value
  }

  const viewer = { groups, groupLabels, scale, scaled, showAmounts, hasInlineAmounts,
    currentSection, activeGroup, drawerOpen, drawerScope, setScale }
  provide(recipeViewerKey, viewer)
  return viewer
}

type RecipeViewer = ReturnType<typeof createRecipeViewer>
const recipeViewerKey: InjectionKey<RecipeViewer> = Symbol('recipe-viewer')

export function useRecipeViewer() {
  return inject(recipeViewerKey, undefined)
}
