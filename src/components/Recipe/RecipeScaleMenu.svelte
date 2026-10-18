<script lang="ts">
	import Icon from "@components/Icon.svelte"
	import { ChevronDown } from "@components/icons.ts"
	import { formatRecipeNumber } from "@lib/recipe.ts"
	import { recipePopoverAnchor } from "@lib/recipe-popover.ts"
	import { scale } from "@lib/recipe-viewer-store.ts"
	import RecipeControls from "./RecipeControls.svelte"
	import RecipePopover from "./RecipePopover.svelte"

	interface Props {
		id: string
		placement?: "above" | "below"
		hasInlineAmounts?: boolean
	}

	let { id, placement = "below", hasInlineAmounts = false }: Props = $props()

	let popover: { toggle: (event?: Event) => void } | undefined
	let open = $state(false)
</script>

<span class="recipe-scale-menu">
	<button
		type="button"
		class="recipe-scale-chip"
		class:is-above={placement === "above"}
		style:anchor-name={recipePopoverAnchor(id)}
		aria-haspopup="dialog"
		aria-expanded={open}
		title="Ajustar cantidades"
		aria-label={`Ajustar cantidades (${formatRecipeNumber($scale)}×)`}
		onclick={(event) => popover?.toggle(event)}
	>
		<span>{formatRecipeNumber($scale)}<span class="recipe-times">×</span></span>
		<Icon size="1.15em" class="recipe-scale-chevron"><ChevronDown /></Icon>
	</button>
	<RecipePopover
		bind:this={popover}
		{id}
		{placement}
		class="recipe-scale-popover"
		label="Ajustar cantidades"
		style="--recipe-popover-width: 18.7rem"
		bind:open
	>
		<RecipeControls id={`${id}-controls`} {hasInlineAmounts} />
	</RecipePopover>
</span>

<style lang="scss">
	.recipe-scale-menu {
		display: inline-flex;
	}

	.recipe-times {
		padding-left: 0.1em;
		opacity: 0.7;
	}

	.recipe-scale-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		border: 0;
		border-radius: 0.2em;
		padding: 0.5em 0.75em;
		background: var(--color-bg-quantity-subingredient);
		color: inherit;
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 0.88rem;
		font-weight: 600;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		letter-spacing: normal;

		> span {
			text-box: trim-both cap alphabetic;
			// The popover is anchored to the chip's right edge, so a label that grows
			// ("1×" becomes "1,1×") would drag the open popover sideways under the
			// pointer. Reserve the widest label — three tabular digits, the comma and
			// the × — so the chip keeps its width for every scale from 0,1 to 10.
			min-inline-size: 3.6ch;
		}

		:global(.recipe-scale-chevron) {
			opacity: 0.7;
			transition: transform 0.2s ease;
		}

		&[aria-expanded="true"] :global(.recipe-scale-chevron),
		&.is-above :global(.recipe-scale-chevron) {
			transform: rotate(180deg);
		}

		&.is-above[aria-expanded="true"] :global(.recipe-scale-chevron) {
			transform: none;
		}

		&:focus-visible {
			outline: 2px solid var(--color-subingredient-name);
			outline-offset: 2px;
		}
	}

	@media (pointer: coarse) {
		.recipe-scale-chip {
			position: relative;

			&::before {
				content: "";
				position: absolute;
				inset: 50% 0 auto;
				height: 44px;
				translate: 0 -50%;
			}
		}
	}

	@media print {
		.recipe-scale-menu {
			display: none !important;
		}
	}
</style>
