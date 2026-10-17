<script lang="ts">
	import { onDestroy, onMount, type Snippet } from "svelte"
	import Icon from "@components/Icon.svelte"
	import { BowlWithSpoon, X } from "@components/icons.ts"
	import {
		formatRecipeAmount,
		formatRecipeNumber,
		recipePlainLabel,
		recipeSectionId,
		recipeTextParts,
		resolveRecipeAmount,
	} from "@lib/recipe.ts"
	import { recipePopoverAnchor } from "@lib/recipe-popover.ts"
	import {
		currentSection,
		drawerOpen,
		initRecipeViewer,
		recipeDomId,
		scale,
		scaled,
		showAmounts,
		type RecipeViewerData,
	} from "@lib/recipe-viewer-store.ts"
	import RecipePopover from "./RecipePopover.svelte"

	interface Props {
		recipe: RecipeViewerData
		token: string
		process?: boolean
		children: Snippet
	}

	let { recipe: data, token, process = false, children }: Props = $props()

	const recipeData = $derived(data)
	const recipeToken = $derived(token)
	// The store is deliberately seeded with the initial props before hydration: a
	// ClientRouter navigation must not briefly paint the previous recipe's scale.
	// svelte-ignore state_referenced_locally
	initRecipeViewer(recipeData, recipeToken)

	const drawerId = $derived(`${recipeDomId(recipeData.id)}-drawer`)
	let processElement: HTMLElement | undefined
	let contentElement: HTMLElement | undefined
	let scrollport: HTMLElement | undefined
	let headings: HTMLElement[] = []
	let frame = 0
	let dockLabel = $state("Proceso")
	let selected = $state<{ ingredientId: string; allocationId?: string } | undefined>()
	let selectedButton: HTMLButtonElement | undefined
	let amountPopover: { toggle: (event?: Event) => void } | undefined
	let amountOpen = $state(false)
	let amountAnchor = $state("")

	const readingProcess = $derived(
		Boolean($currentSection.id || $currentSection.label === "Proceso"),
	)

	const selectedData = $derived.by(() => {
		if (!selected) return undefined
		const resolved = resolveRecipeAmount(
			recipeData.groups,
			selected.ingredientId,
			selected.allocationId,
		)
		const range = selected.allocationId ? undefined : resolved.ingredient.quantityMax
		const amount =
			formatRecipeAmount(
				resolved.quantity,
				resolved.ingredient.unit,
				$scale,
				range,
			) ||
			resolved.ingredient.amount ||
			""
		const label = recipePlainLabel(resolved.ingredient)
		const note = resolved.ingredient.note
			? recipeTextParts(resolved.ingredient.note, resolved.ingredient, $scale)
					.map((part) => part.value)
					.join("")
			: ""
		return { resolved, range, amount, label, note }
	})

	function buttonAmount(button: HTMLButtonElement) {
		const ingredientId = button.dataset.ingredient
		if (!ingredientId) return ""
		const allocationId = button.dataset.allocation
		const resolved = resolveRecipeAmount(recipeData.groups, ingredientId, allocationId)
		const range = allocationId ? undefined : resolved.ingredient.quantityMax
		return (
			formatRecipeAmount(
				resolved.quantity,
				resolved.ingredient.unit,
				scale.get(),
				range,
			) ||
			resolved.ingredient.amount ||
			""
		)
	}

	function updateAmounts() {
		if (!contentElement) return
		for (const button of contentElement.querySelectorAll<HTMLButtonElement>(
			".recipe-inline-amount",
		)) {
			const amount = buttonAmount(button)
			button.textContent = amount
			const ingredientId = button.dataset.ingredient
			if (!ingredientId) continue
			const resolved = resolveRecipeAmount(
				recipeData.groups,
				ingredientId,
				button.dataset.allocation,
			)
			button.setAttribute(
				"aria-label",
				`${recipePlainLabel(resolved.ingredient)}: ${amount}. Ver detalle`,
			)
		}
	}

	function updateVisibility() {
		if (!contentElement) return
		for (const button of contentElement.querySelectorAll<HTMLButtonElement>(
			".recipe-inline-amount",
		)) {
			button.hidden = !showAmounts.get()
			const space = button.previousElementSibling
			if (space instanceof HTMLElement && space.classList.contains("recipe-inline-space")) {
				space.hidden = button.hidden
			}
		}
	}

	function onContentClick(event: MouseEvent) {
		const target = event.target
		if (!(target instanceof Element)) return
		const button = target.closest<HTMLButtonElement>(".recipe-inline-amount")
		if (!button || !contentElement?.contains(button)) return
		event.preventDefault()
		const ingredientId = button.dataset.ingredient
		if (!ingredientId) return
		const wasOpen = amountOpen
		selected = { ingredientId, allocationId: button.dataset.allocation }
		amountAnchor = button.style.anchorName || recipePopoverAnchor(`${recipeData.id}-amount`)
		selectedButton?.setAttribute("aria-expanded", "false")
		selectedButton = button
		if (wasOpen) selectedButton.setAttribute("aria-expanded", "true")
		else amountPopover?.toggle(event)
	}

	function onAmountToggle(open: boolean) {
		amountOpen = open
		if (open && selectedButton) selectedButton.setAttribute("aria-expanded", "true")
		if (!open && selectedButton) {
			selectedButton.setAttribute("aria-expanded", "false")
			selectedButton = undefined
		}
	}

	function setupAmountButtons() {
		if (!contentElement) return
		let index = 0
		for (const button of contentElement.querySelectorAll<HTMLButtonElement>(
			".recipe-inline-amount",
		)) {
			button.style.anchorName = recipePopoverAnchor(`amount-${recipeData.id}-${index++}`)
			button.setAttribute("aria-haspopup", "dialog")
			button.setAttribute("aria-expanded", "false")
		}
		contentElement.addEventListener("click", onContentClick)
	}

	// The current section is the one crossing a reading line a third of the way down the
	// visible area (below the header, above the mobile dock). The tail of a section left at
	// the top of the screen doesn't count; neither does one that only just appeared below.
	function updateSection() {
		frame = 0
		if (!processElement || !scrollport || $drawerOpen) return
		const top = parseFloat(getComputedStyle(processElement).scrollMarginTop) || 0
		// The dock's height is constant whether shown or not (it slides away), so showing it
		// never moves the reading line and can't flip the section back and forth.
		const dock = document.querySelector<HTMLElement>(".recipe-mobile-dock")
		const bottom = scrollport.clientHeight - (dock?.offsetHeight || 0)
		// Over the last half screen of scrolling the line slides down to the bottom, so short
		// sections at the end of a recipe each get their turn instead of being skipped.
		const span = bottom - top
		const remaining =
			scrollport.scrollHeight - (scrollport.scrollTop + scrollport.clientHeight)
		const progress = Math.min(1, Math.max(0, 1 - remaining / (span / 2)))
		const readingLine = top + span * (1 / 3 + (2 / 3) * progress) - 1

		// Above the procedure (title, ingredients) the reader isn't following the steps yet.
		let current = { top: -Infinity, id: "", label: "Ingredientes" }
		const sections = [
			{ top: processElement.getBoundingClientRect().top, id: "", label: "Proceso" },
			...headings.map((heading) => ({
				top: heading.getBoundingClientRect().top,
				id: recipeSectionId(heading.textContent ?? ""),
				label: heading.textContent?.trim() || "",
			})),
		]
		for (const section of sections) {
			if (section.top <= readingLine) current = section
		}
		currentSection.set({ id: current.id, label: current.label })
	}

	function onScroll() {
		if (!frame) frame = requestAnimationFrame(updateSection)
	}

	onMount(() => {
		scrollport = processElement?.closest<HTMLElement>(".page-scroll") ?? undefined
		headings = Array.from(
			processElement?.querySelectorAll<HTMLElement>("h3, h4") ?? [],
		)
		setupAmountButtons()
		updateAmounts()
		updateVisibility()
		onScroll()

		window.addEventListener("resize", onScroll)
		scrollport?.addEventListener("scroll", onScroll, { passive: true })
		const unsubscribers = [
			scale.subscribe(updateAmounts),
			showAmounts.subscribe(updateVisibility),
			currentSection.subscribe((section) => {
				if (section.id || section.label === "Proceso") dockLabel = section.label
			}),
		]

		return () => {
			cancelAnimationFrame(frame)
			for (const unsubscribe of unsubscribers) unsubscribe()
			scrollport?.removeEventListener("scroll", onScroll)
			window.removeEventListener("resize", onScroll)
			contentElement?.removeEventListener("click", onContentClick)
		}
	})

	onDestroy(() => {
		if (typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(frame)
	})
</script>

<section
	id="procedimiento"
	bind:this={processElement}
	class="recipe-process"
	aria-labelledby={process ? "recipe-process-title" : undefined}
	aria-label={!process ? "Proceso" : undefined}
>
	{#if process}
		<h2 id="recipe-process-title" class="recipe-process-title">
			<Icon class="recipe-process-icon"><BowlWithSpoon /></Icon> Proceso
		</h2>
	{/if}
	{#if $scaled}
		<p class="recipe-scaled-notice" role="status">
			Cantidades ajustadas a <strong>{formatRecipeNumber($scale)}×</strong>. Los tiempos y la
			temperatura son los de la receta original.{#if !$showAmounts}
				Las cantidades en los pasos están ocultas.{/if}
		</p>
	{/if}
	<div bind:this={contentElement} class="recipe-process-content">
		{@render children()}
	</div>

	<RecipePopover
		bind:this={amountPopover}
		id={`${recipeData.id}-amount-popover`}
		anchor={amountAnchor}
		class="recipe-amount-popover"
		label={selectedData?.label}
		style="--recipe-popover-width: 20rem"
		bind:open={amountOpen}
		onToggle={onAmountToggle}
	>
		{#if selectedData}
			<div class="recipe-amount-popover-heading">
				<strong>{selectedData.label}</strong>
				<button
					type="button"
					aria-label="Cerrar detalle"
					onclick={() => amountPopover?.toggle()}
				><Icon><X /></Icon></button
				>
			</div>
			<span class="recipe-amount-group">{selectedData.resolved.group.label}</span>
			{#if selectedData.resolved.allocation}
				<span
					>{selectedData.resolved.allocation.label}: <strong
						>{selectedData.amount}</strong
					></span
				>
			{:else}
				<span>Cantidad: <strong>{selectedData.amount}</strong></span>
			{/if}
			{#each selectedData.resolved.ingredient.allocations ?? [] as part (part.id)}
				<span
					>{part.label}: {formatRecipeAmount(
						part.quantity,
						selectedData.resolved.ingredient.unit,
						$scale,
					)}</span
				>
			{/each}
			{#if selectedData.resolved.ingredient.allocations?.length}
				<span
					>Total: {formatRecipeAmount(
						selectedData.resolved.ingredient.quantity,
						selectedData.resolved.ingredient.unit,
						$scale,
					)}</span
				>
			{/if}
			{#if selectedData.note}<span>{selectedData.note}</span>{/if}
			{#if selectedData.resolved.ingredient.prepared}
				<span class="recipe-amount-group"
					>Es parte de una preparación anterior, no un ingrediente extra.</span
				>
			{/if}
			{#if $scaled}
				<span class="recipe-amount-group"
					>Receta original: {formatRecipeAmount(
						selectedData.resolved.quantity,
						selectedData.resolved.ingredient.unit,
						1,
						selectedData.range,
					)} · Ahora {formatRecipeNumber($scale)}×</span
				>
			{/if}
		{/if}
	</RecipePopover>

	<div
		class="recipe-mobile-dock"
		class:is-reading-process={readingProcess}
		inert={!readingProcess}
	>
		<span class="recipe-dock-section">
			<span>Estás en</span>
			<strong>{dockLabel}</strong>
		</span>
		<button
			type="button"
			aria-controls={drawerId}
			aria-expanded={$drawerOpen}
			aria-haspopup="dialog"
			onclick={() => drawerOpen.set(true)}
		>
			Ingredientes{#if $scaled}<small>{formatRecipeNumber($scale)}×</small>{/if}
		</button>
	</div>
</section>

<style lang="scss">
	.recipe-process {
		max-width: 40em;
		grid-area: three;
		scroll-margin-top: calc(var(--header-height) + 1rem);
	}

	/* The Svelte island root is the section: the page's `.recipe > * > :first-child`
	   cannot reach through it, so the title owns its own zero top margin. */
	.recipe-process-title {
		margin-top: 0;
	}

	.recipe-scaled-notice {
		font-size: 0.82rem;
		border-left: 2px solid var(--color-subingredient-name);
		padding: 0.6rem 0.9rem;
		background: var(--color-bg-quantity-subingredient);
		margin-block: 0 1.5rem;
	}

	.recipe-process-content {
		display: contents;
	}

	.recipe-mobile-dock {
		display: none;
	}

	@media (max-width: $recipe-side-by-side) {
		// Always laid out (constant height, which the section tracking measures) and slid
		// off screen when not needed; toggling display made the reading area, and the bar,
		// flicker.
		.recipe-mobile-dock {
			display: flex;
			position: fixed;
			z-index: 4;
			align-items: center;
			justify-content: space-between;
			gap: 0.75rem;
			inset: auto var(--recipe-column-right, 0) 0 var(--recipe-column-left, 0);
			padding: 0.75rem 0 max(0.75rem, env(safe-area-inset-bottom));
			background: var(--color-bg-0);
			border-top: var(--sidebar-recipe-border);
			transform: translateY(calc(100% + 2px));
			visibility: hidden;
			transition: transform 0.28s cubic-bezier(0.4, 0, 1, 1), visibility 0s linear 0.28s;

			&.is-reading-process {
				transform: none;
				visibility: visible;
				transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s;
			}

			> button {
				position: relative;
				border: 0;
				border-radius: 0.35em;
				background: var(--color-bg-quantity-subingredient);
				color: inherit;
				padding: 0.8em 1.1em;
				white-space: nowrap;
				font: inherit;
				font-weight: 500;
				line-height: 1;
				text-box: trim-both cap alphabetic;

				&::before {
					content: "";
					position: absolute;
					inset: 50% 0 auto;
					height: 44px;
					translate: 0 -50%;
				}
			}

			small {
				padding-left: 0.5rem;
				font-variant-numeric: tabular-nums;
			}
		}

		.recipe-dock-section {
			display: flex;
			flex-direction: column;
			gap: 0.4rem;
			/* A flex item with non-visible overflow has an automatic minimum size of
			   zero, so the nowrap label can ellipsize without a `min-width: 0` hack.
			   `contain: inline-size` collapsed this to 0px and hid the section name. */
			overflow: hidden;
			font-size: 0.85rem;
			line-height: 1;
		}

		.recipe-dock-section > * {
			text-box: trim-both cap alphabetic;
		}

		.recipe-dock-section > span {
			font-size: 0.7rem;
			opacity: 0.6;
		}

		.recipe-dock-section strong {
			font-weight: 500;
			overflow-x: clip;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.recipe-mobile-dock,
		.recipe-mobile-dock.is-reading-process {
			transition: none;
		}
	}

	@media print {
		.recipe-mobile-dock {
			display: none !important;
		}
	}
</style>
