<template>
  <template v-for="(part, index) in parts" :key="index"><img v-if="part.type === 'emoji'" class="emoji-inline" width="64"
    height="64" :src="part.src" :alt="part.alt" /><span v-else-if="part.type === 'amount' && chips"
    class="recipe-ingredient-quantity">{{ part.value }}</span><template v-else>{{ part.value }}</template></template>
</template>

<script setup lang="ts">
import { recipeTextParts } from '~/utils/recipe.mjs'

// A structured label, note or group title: plain text with emoji images (resolved on
// the server into `parts`) and `{…}` amounts that follow the recipe's scale.
const props = defineProps<{
  text?: string
  parts?: { text?: string; emoji?: { src: string; alt: string } }[]
  item?: Record<string, any>
  scale?: number
  // Amounts as ingredient chips (labels) or as plain text (notes).
  chips?: boolean
}>()

const parts = computed(() => (props.parts || [{ text: props.text || '' }]).flatMap(part => part.emoji
  ? [{ type: 'emoji', ...part.emoji }]
  : recipeTextParts(part.text, props.item, props.scale)))
</script>
