<script lang="ts">
	import { recipeTextParts, type RecipeIngredient } from "@lib/recipe.ts"

	interface Props {
		text?: string
		item?: Partial<RecipeIngredient>
		scale?: number
		chips?: boolean
	}

	let { text = "", item = {}, scale = 1, chips = false }: Props = $props()
	const parts = $derived(recipeTextParts(text, item, scale))
</script>

{#each parts as part}{#if part.type === "amount" && chips}<span
			class="recipe-ingredient-quantity">{part.value}</span
		>{:else}{part.value}{/if}{/each}
