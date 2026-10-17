<script lang="ts">
	import { onMount } from "svelte"
	import {
		MAX_RECIPE_SCALE,
		MIN_RECIPE_SCALE,
		stepRecipeScale,
		validRecipeScale,
	} from "@lib/recipe.ts"
	import {
		persistShowAmounts,
		scale,
		setScale,
		showAmounts,
		stepScale,
	} from "@lib/recipe-viewer-store.ts"

	interface Props {
		id: string
		hasInlineAmounts?: boolean
	}

	let { id, hasInlineAmounts = false }: Props = $props()

	let factorInput = $state(String(scale.get()))
	const presets = [
		{ value: 0.5, text: "½", label: "La mitad" },
		{ value: 1, text: "1", label: "Receta original" },
		{ value: 2, text: "2", label: "El doble" },
		{ value: 3, text: "3", label: "El triple" },
	]

	onMount(() =>
		scale.subscribe((value) => {
			factorInput = String(value)
		}),
	)

	function applyInput(event: Event) {
		const input = event.currentTarget as HTMLInputElement
		factorInput = input.value
		if (validRecipeScale(input.valueAsNumber)) setScale(input.valueAsNumber)
	}

	function restoreInput() {
		factorInput = String(scale.get())
	}

	function set(value: number) {
		setScale(value)
		restoreInput()
	}

	function adjust(direction: number) {
		set(stepRecipeScale(scale.get(), direction))
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault()
			restoreInput()
		} else if (event.key === "ArrowUp") {
			event.preventDefault()
			adjust(1)
		} else if (event.key === "ArrowDown") {
			event.preventDefault()
			adjust(-1)
		}
	}
</script>

<div class="recipe-controls">
	<div class="recipe-controls-section">
		<p id={`${id}-scale-label`} class="recipe-controls-title">Proporción de la receta</p>
		<p id={`${id}-scale-hint`} class="recipe-controls-hint">Multiplica todos los ingredientes</p>
		<div class="recipe-scale-row">
			<div class="recipe-scale-stepper" role="group" aria-labelledby={`${id}-scale-label`}>
				<button
					type="button"
					aria-label="Reducir proporción en 0,1"
					disabled={$scale <= MIN_RECIPE_SCALE}
					onclick={() => adjust(-1)}>−</button
				>
				<span class="recipe-scale-field">
					<input
						name="recipe-scale"
						type="number"
						min={MIN_RECIPE_SCALE}
						max={MAX_RECIPE_SCALE}
						step="any"
						inputmode="decimal"
						aria-labelledby={`${id}-scale-label`}
						aria-describedby={`${id}-scale-hint`}
						title="Entre 0,1 y 10"
						value={factorInput}
						oninput={applyInput}
						onblur={restoreInput}
						onkeydown={onKeyDown}
					/>
					<span class="recipe-times" aria-hidden="true">×</span>
				</span>
				<button
					type="button"
					aria-label="Aumentar proporción en 0,1"
					disabled={$scale >= MAX_RECIPE_SCALE}
					onclick={() => adjust(1)}>+</button
				>
			</div>
		</div>
		<div class="recipe-scale-presets" role="group" aria-label="Proporciones rápidas">
			{#each presets as preset (preset.value)}
				<button
					type="button"
					aria-pressed={$scale === preset.value}
					aria-label={preset.label}
					onclick={() => set(preset.value)}
				>
					<span class:is-fraction={preset.text === "½"}>{preset.text}</span>
					<span class="recipe-times" aria-hidden="true">×</span>
				</button>
			{/each}
		</div>
	</div>
	{#if hasInlineAmounts}
		<label class="recipe-amount-toggle">
			<input
				name="recipe-show-amounts"
				type="checkbox"
				checked={$showAmounts}
				onchange={(event) => persistShowAmounts(event.currentTarget.checked)}
			/>
			<span>Cantidades en los pasos<small>Las muestra dentro de cada paso</small></span>
		</label>
	{/if}
</div>

<style lang="scss">
	.recipe-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 16.5rem;
		font-size: 0.88rem;
		line-height: 1.4;
		font-variant-numeric: tabular-nums;
	}

	.recipe-controls-section {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.recipe-controls-title {
		margin: 0;
		font-weight: 600;
	}

	.recipe-controls-hint {
		margin: -0.4rem 0 0.1rem;
		opacity: 0.65;
		font-size: 0.8rem;
	}

	.recipe-controls-hint,
	.recipe-amount-toggle small {
		text-wrap: pretty;
	}

	.recipe-controls button {
		font: inherit;
		color: inherit;
		cursor: pointer;
	}

	.recipe-scale-stepper {
		display: grid;
		grid-template-columns: 2.5rem 1fr 2.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		background: var(--color-bg-quantity-subingredient);
		overflow: hidden;

		button {
			padding: 0;
			border: 0;
			background: none;
			font-size: 1.15rem;
			line-height: 1;

			&:hover:not(:disabled) {
				background: var(--color-bg-quantity-subingredient);
			}

			&:disabled {
				opacity: 0.3;
				cursor: default;
			}

			&:focus-visible {
				outline: 2px solid var(--color-subingredient-name);
				outline-offset: -2px;
				border-radius: 0.5rem;
			}
		}
	}

	.recipe-scale-field {
		display: flex;
		align-items: baseline;
		align-self: center;
		justify-content: center;
		font-size: 1.05rem;
		font-weight: 600;

		input {
			appearance: textfield;
			width: 3ch;
			padding: 0;
			border: 0;
			border-radius: 0;
			background: transparent;
			color: inherit;
			font: inherit;
			text-align: right;
			font-variant-numeric: tabular-nums;

			&::-webkit-inner-spin-button,
			&::-webkit-outer-spin-button {
				appearance: none;
				margin: 0;
			}

			&:focus-visible {
				outline: none;
			}
		}

		&:focus-within {
			box-shadow: inset 0 -2px var(--color-subingredient-name);
		}
	}

	.recipe-scale-presets {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.35rem;

		button {
			height: 2rem;
			padding: 0;
			border: 1px solid var(--color-bg-quantity-subingredient);
			border-radius: 0.4rem;
			background: none;
			font-weight: 600;

			&:hover {
				background: var(--color-bg-quantity-subingredient);
			}

			&[aria-pressed="true"] {
				background: var(--color-bg-quantity-subingredient);
				border-color: var(--color-subingredient-name);
			}

			&:focus-visible {
				outline: 2px solid var(--color-subingredient-name);
				outline-offset: 1px;
			}
		}

		.is-fraction {
			font-size: 1.15em;
			line-height: 1;
		}
	}

	.recipe-amount-toggle {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.6rem;
		align-items: start;
		cursor: pointer;
		padding-top: 1rem;
		border-top: var(--sidebar-recipe-border);

		input {
			margin: 0.2rem 0 0;
			width: 1rem;
			height: 1rem;
			accent-color: var(--color-subingredient-name);
		}

		span {
			display: flex;
			flex-direction: column;
			gap: 0.15rem;
			font-weight: 500;
		}

		small {
			font-size: 0.8rem;
			font-weight: 400;
			opacity: 0.65;
		}
	}

	@media (pointer: coarse) {
		.recipe-scale-stepper {
			grid-template-columns: 44px 1fr 44px;
			height: 44px;
		}

		.recipe-scale-presets button {
			height: 40px;
		}
	}
</style>
