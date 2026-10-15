<template>
  <div v-show="!hidden" ref="groupElement" class="subingredient" :data-recipe-group="groupId || recipeSectionId(title)">
    <h5 class="recipe-subingredient-title" v-if="name"><RecipeRichText :text="name" :parts="nameParts" /></h5>
    <h5 class="recipe-subingredient-title" v-else-if="$slots.title" v-once>
      <ContentSlot :use="$slots.title" unwrap="p" />
    </h5>
    <!-- Structured lists are reactive (scaling). Legacy Markdown is static: render it
         once so class/visibility updates don't re-invoke the slot (Vue warns). -->
    <slot v-if="groupId" />
    <ContentSlot v-else v-once :use="$slots.default" />
  </div>
</template>

<script setup>
import { recipeSectionId } from '~/utils/recipe.mjs'
// `groupId` is set by structured recipes; legacy Markdown groups are matched by title.
const props = defineProps(["name", "nameParts", "groupId"])
const viewer = useRecipeViewer()
const groupElement = ref()
const title = ref(props.name || '')
onMounted(() => { title.value = groupElement.value?.querySelector('h5')?.textContent || title.value })
const current = computed(() => {
  const active = viewer?.activeGroup.value
  if (!active) return false
  return props.groupId ? props.groupId === active.id : recipeSectionId(title.value) === recipeSectionId(active.label)
})
const hidden = computed(() => viewer?.drawerOpen.value && viewer.drawerScope.value === 'current' && viewer.activeGroup.value && !current.value)
</script>

<style scoped>
h5.recipe-subingredient-title {
  margin-block: 0 0.4em;
  color: var(--color-subingredient-name);
  /* font-style: italic; */
  /* text-transform: lowercase; */
}

.subingredient {
  break-inside: avoid;
  margin-bottom: 2rem;
}
</style>
