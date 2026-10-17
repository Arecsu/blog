<script lang="ts">
	import { onDestroy, onMount, tick, type Snippet } from "svelte"
	import Icon from "@components/Icon.svelte"
	import { Spoon, X } from "@components/icons.ts"
	import {
		formatRecipeAmount,
		formatRecipeNumber,
		hasPrimaryAmount,
		recipeSectionId,
		type RecipeIngredientGroup,
	} from "@lib/recipe.ts"
	import {
		currentSection,
		drawerOpen,
		drawerScope,
		initRecipeViewer,
		scale,
		recipeDomId,
		type RecipeViewerData,
	} from "@lib/recipe-viewer-store.ts"
	import RecipeRichText from "./RecipeRichText.svelte"
	import RecipeScaleMenu from "./RecipeScaleMenu.svelte"

	interface Props {
		recipe: RecipeViewerData
		token: string
		hasExtra?: boolean
		children?: Snippet
	}

	let { recipe: data, token, hasExtra = false, children }: Props = $props()

	const recipeData = $derived(data)
	const recipeToken = $derived(token)
	// The store is deliberately seeded with the initial props before hydration: a
	// ClientRouter navigation must not briefly paint the previous recipe's scale.
	// svelte-ignore state_referenced_locally
	initRecipeViewer(recipeData, recipeToken)

	const groups = $derived(recipeData.groups)
	const hasGroups = $derived(groups.length > 0)
	const id = $derived(recipeDomId(recipeData.id))

	let ingredientsElement: HTMLElement | undefined
	let panel: HTMLElement | undefined
	let drawer: HTMLDialogElement | undefined
	let drawerContent: HTMLElement | undefined
	let legacyGroups = $state<{ id: string; label: string; sections?: string[] }[]>([])
	let sticky = $state(false)
	let fadeUp = $state(false)
	let fadeDown = $state(false)
	let closing = false
	let closingClass = $state(false)
	let locked = false
	let previousOverflow = ""
	let previousGutter = ""
	let scrollport: HTMLElement | undefined
	let lockedScroll = 0
	let placeholder: HTMLElement | undefined
	let panelHome: Comment | undefined
	const drawerScrolls = new Map<string, number>()

	const groupLabels = $derived(
		hasGroups
			? groups.map((group) => ({ id: group.id, label: group.label ?? "", sections: group.sections }))
			: legacyGroups,
	)

	// Sections without a matching group (e.g. "Armado final") have no active group, so the
	// drawer shows every ingredient: the full list is always right, a guessed group may not be.
	const activeGroup = $derived.by(() => {
		const section = $currentSection
		if (!section.id) return undefined
		return groupLabels.find(
			(group) =>
				group.id === section.id ||
				recipeSectionId(group.label) === section.id ||
				group.sections?.includes(section.id),
		)
	})

	function isGroupHidden(group: RecipeIngredientGroup) {
		return Boolean(
			$drawerOpen &&
				$drawerScope === "current" &&
				activeGroup &&
				group.id !== activeGroup.id,
		)
	}

	function readLegacyGroups() {
		if (hasGroups || !panel) return
		legacyGroups = Array.from(panel.querySelectorAll<HTMLElement>(".subingredient"))
			.map((element) => {
				const title = element.querySelector(".recipe-subingredient-title")?.textContent?.trim() ?? ""
				return {
					id: element.dataset.recipeGroup || recipeSectionId(title),
					label: title,
				}
			})
			.filter((group) => group.label)
	}

	function updateLegacyVisibility() {
		if (hasGroups || !panel) return
		// Read the store imperatively: this also runs from drawerOpen.subscribe, where
		// the component's `$drawerOpen` auto-subscription has not updated yet.
		const open = drawerOpen.get()
		const active = activeGroup
		const onlyCurrent = open && drawerScope.get() === "current" && active
		for (const element of panel.querySelectorAll<HTMLElement>(".subingredient")) {
			const groupId =
				element.dataset.recipeGroup ||
				recipeSectionId(element.querySelector(".recipe-subingredient-title")?.textContent ?? "")
			element.hidden = Boolean(onlyCurrent && active && groupId !== active.id)
		}
	}

	function scopeKey() {
		return drawerScope.get() === "current" && activeGroup ? activeGroup.id : "all"
	}

	function movePanel(intoDrawer: boolean) {
		if (!panel || !drawerContent) return
		if (intoDrawer && panel.parentNode !== drawerContent) {
			panelHome = document.createComment("recipe-ingredient-panel")
			panel.before(panelHome)
			drawerContent.append(panel)
		} else if (!intoDrawer && panelHome) {
			panelHome.replaceWith(panel)
			panelHome = undefined
		}
	}

	function addPlaceholder() {
		if (!panel || placeholder) return
		placeholder = document.createElement("div")
		placeholder.className = "recipe-ingredient-placeholder"
		placeholder.style.height = `${panel.getBoundingClientRect().height}px`
		panel.before(placeholder)
	}

	function removePlaceholder() {
		placeholder?.remove()
		placeholder = undefined
	}

	function openDrawer() {
		if (!drawer || drawer.open) return
		addPlaceholder()
		movePanel(true)
		// The page scroll owner is the inner viewport scrollport, not the document.
		// Locking `documentElement` would leave the list scrolling behind the sheet.
		scrollport = ingredientsElement?.closest<HTMLElement>(".page-scroll") ?? undefined
		previousOverflow = scrollport?.style.overflowY ?? ""
		previousGutter = scrollport?.style.scrollbarGutter ?? ""
		if (scrollport && scrollport.offsetWidth > scrollport.clientWidth) {
			scrollport.style.scrollbarGutter = "stable"
		}
		lockedScroll = scrollport?.scrollTop ?? 0
		if (scrollport) scrollport.style.overflowY = "hidden"
		locked = true
		drawer.showModal()
		drawerContent?.focus({ preventScroll: true })
		if (drawerContent) drawerContent.scrollTop = drawerScrolls.get(scopeKey()) || 0
		updateFades()
	}

	function unlock() {
		if (locked && scrollport) {
			scrollport.style.overflowY = previousOverflow
			scrollport.style.scrollbarGutter = previousGutter
			scrollport.scrollTop = lockedScroll
		}
		locked = false
	}

	// Slide the sheet out first, then really close: closing right away would also move the
	// list back into the page mid-animation, leaving an empty sheet sliding down.
	function closeDrawer() {
		const dialog = drawer
		if (!dialog?.open || closing) return
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			dialog.close()
			return
		}
		closing = true
		closingClass = true
		const finish = () => {
			clearTimeout(fallback)
			dialog.removeEventListener("animationend", onEnd)
			closingClass = false
			closing = false
			dialog.close()
		}
		const onEnd = (event: AnimationEvent) => {
			if (event.target === dialog && !event.pseudoElement) finish()
		}
		dialog.addEventListener("animationend", onEnd)
		const fallback = setTimeout(finish, 450)
	}

	function onClose() {
		drawerScrolls.set(scopeKey(), drawerContent?.scrollTop || 0)
		movePanel(false)
		removePlaceholder()
		drawerOpen.set(false)
		unlock()
		document
			.querySelector<HTMLButtonElement>(".recipe-mobile-dock button")
			?.focus({ preventScroll: true })
	}

	function onBackdrop(event: MouseEvent) {
		if (!drawer || event.target !== drawer) return
		const rect = drawer.getBoundingClientRect()
		if (
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom
		) {
			closeDrawer()
		}
	}

	async function setScope(scope: "current" | "all") {
		drawerScrolls.set(scopeKey(), drawerContent?.scrollTop || 0)
		drawerScope.set(scope)
		await tick()
		if (drawerContent) drawerContent.scrollTop = drawerScrolls.get(scopeKey()) || 0
		updateFades()
		updateLegacyVisibility()
	}

	// Fade the list's edges only where there is more to scroll to. Overlay
	// gradients rather than a mask: a mask on a moving/scrolling sheet forces a
	// repaint of the whole list on every frame on mobile GPUs.
	function updateFades() {
		const content = drawerContent
		if (!content) return
		fadeUp = content.scrollTop > 1
		fadeDown = content.scrollTop + content.clientHeight < content.scrollHeight - 1
	}

	// Follow the procedure only when the whole list fits on screen; a taller list
	// would hide its end, so it scrolls with the page as it always did.
	function updateSticky() {
		if (!ingredientsElement || !sideBySide?.matches || drawerOpen.get()) {
			sticky = false
			return
		}
		const offset = parseFloat(getComputedStyle(ingredientsElement).scrollMarginTop) || 0
		const available = scrollport?.clientHeight ?? window.innerHeight
		sticky = ingredientsElement.offsetHeight + offset * 2 <= available
	}

	// The dock and drawer live in the recipe's body column (right of the sidebar title).
	// Put the measurements on .recipe-container so both the ingredients and process
	// sections inherit them.
	function updateColumn() {
		const element = ingredientsElement
		const column = element?.closest<HTMLElement>(".recipe-container")
		if (!element || !column) return
		const rect = column.getBoundingClientRect()
		const right = document.documentElement.clientWidth - rect.right
		const sidebar = column.parentElement?.querySelector<HTMLElement>(".recipe-sidebar")
		const sidebarRight = sidebar?.offsetWidth ? sidebar.getBoundingClientRect().right : undefined
		const left = sidebarRight === undefined ? rect.left : Math.min(rect.left, sidebarRight + right)
		column.style.setProperty("--recipe-column-left", `${left}px`)
		column.style.setProperty("--recipe-column-right", `${right}px`)
		column.style.setProperty("--recipe-column-inset", `${rect.left - left}px`)
	}

	// Must match the side-by-side breakpoint in $recipe-side-by-side.
	const SIDE_BY_SIDE = "(min-width: 90.001rem)"
	let sideBySide: MediaQueryList | undefined
	let resizeObserver: ResizeObserver | undefined

	function onBreakpoint() {
		if (sideBySide?.matches) closeDrawer()
		updateSticky()
	}

	onMount(() => {
		readLegacyGroups()
		scrollport = ingredientsElement?.closest<HTMLElement>(".page-scroll") ?? undefined
		sideBySide = window.matchMedia(SIDE_BY_SIDE)
		sideBySide.addEventListener("change", onBreakpoint)
		window.addEventListener("resize", updateSticky)
		window.addEventListener("resize", updateColumn)
		resizeObserver = new ResizeObserver(() => {
			updateSticky()
			updateColumn()
			updateFades()
		})
		if (ingredientsElement) resizeObserver.observe(ingredientsElement)
		if (panel) resizeObserver.observe(panel)
		if (drawerContent) resizeObserver.observe(drawerContent)
		const column = ingredientsElement?.closest<HTMLElement>(".recipe-container")
		if (column) resizeObserver.observe(column)

		const unsubscribers = [
			drawerOpen.subscribe((open) => {
				if (open) openDrawer()
				else {
					closeDrawer()
					updateLegacyVisibility()
				}
				updateSticky()
			}),
			currentSection.subscribe(() => {
				updateLegacyVisibility()
			}),
			drawerScope.subscribe(() => {
				updateLegacyVisibility()
			}),
		]

		updateSticky()
		updateColumn()
		updateLegacyVisibility()

		return () => {
			for (const unsubscribe of unsubscribers) unsubscribe()
			sideBySide?.removeEventListener("change", onBreakpoint)
			window.removeEventListener("resize", updateSticky)
			window.removeEventListener("resize", updateColumn)
			resizeObserver?.disconnect()
		}
	})

	onDestroy(() => {
		movePanel(false)
		removePlaceholder()
		drawer?.close()
		unlock()
	})
</script>

<section
	id="ingredientes"
	bind:this={ingredientsElement}
	class="ingredients"
	class:is-sticky={sticky}
	aria-labelledby={`${id}-title`}
>
	<div class="ingredients-heading">
		<h2 id={`${id}-title`} class="ingredients-title">
			<Icon class="ingredients-title-icon" marginInline="-0.1em 0"><Spoon /></Icon> Ingredientes
		</h2>
		{#if hasGroups}
			<RecipeScaleMenu id={`${id}-scale`} hasInlineAmounts={recipeData.inlineAmounts} />
		{/if}
	</div>

	<div bind:this={panel} class="recipe-ingredient-panel">
		{#if hasGroups}
			{#if hasExtra && children}
				<div class="recipe-ingredients-intro">{@render children()}</div>
			{/if}
			<div class="subingredients">
				{#each groups as group (group.id)}
					<div
						class="subingredient"
						data-recipe-group={group.id}
						hidden={isGroupHidden(group)}
					>
						{#if group.label}
							<h5 class="recipe-subingredient-title">
								<RecipeRichText text={group.label} scale={$scale} />
							</h5>
						{/if}
						{#if group.note}
							{#each group.note.split(/\n{2,}/) as paragraph, index (index)}
								<p><RecipeRichText text={paragraph} scale={$scale} /></p>
							{/each}
						{/if}
						<ul>
							{#each group.items as item (item.id)}
								<li>
									{#if !hasPrimaryAmount(item.label) && (item.quantity !== undefined || item.amount)}
										<span class="recipe-ingredient-quantity"
											>{item.quantity !== undefined
												? formatRecipeAmount(
														item.quantity,
														item.unit,
														$scale,
														item.quantityMax,
													)
												: item.amount}</span
										>{' '}
									{/if}
									<RecipeRichText text={item.label} {item} scale={$scale} chips />
									{#if item.note || item.allocations?.length}
										({#if item.note}<RecipeRichText text={item.note ?? ""} {item} scale={$scale} />{/if}{#if item.note && item.allocations?.length}; {/if}{#if item.allocations?.length}{item.allocations
												.map(
													(part) =>
														`${formatRecipeAmount(part.quantity, item.unit, $scale)} ${part.label.toLowerCase()}`,
												)
												.join(" + ")}{/if})
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{:else}
			<div class="subingredients">{@render children?.()}</div>
		{/if}
	</div>

	<dialog
		id={`${id}-drawer`}
		bind:this={drawer}
		class="recipe-ingredient-drawer"
		class:is-closing={closingClass}
		aria-labelledby={`${id}-drawer-title`}
		onclose={onClose}
		oncancel={(event) => {
			event.preventDefault()
			closeDrawer()
		}}
		onclick={onBackdrop}
	>
		<div class="recipe-drawer-scroll" class:can-scroll-up={fadeUp} class:can-scroll-down={fadeDown}>
			<div
				bind:this={drawerContent}
				class="recipe-drawer-content"
				tabindex="-1"
				onscroll={() => updateFades()}
			></div>
			<div class="recipe-drawer-fade is-top" aria-hidden="true"></div>
			<div class="recipe-drawer-fade is-bottom" aria-hidden="true"></div>
		</div>
		{#if activeGroup}
			<div class="recipe-drawer-tabs" role="group" aria-label="Ingredientes que se muestran">
				<button
					type="button"
					aria-pressed={$drawerScope === "current"}
					onclick={() => setScope("current")}>{activeGroup.label}</button
				>
				<button
					type="button"
					aria-pressed={$drawerScope === "all"}
					onclick={() => setScope("all")}>Todos</button
				>
			</div>
		{/if}
		<footer class="recipe-drawer-header">
			<h2 id={`${id}-drawer-title`}>Ingredientes</h2>
			{#if hasGroups}
				<RecipeScaleMenu
					id={`${id}-scale-drawer`}
					placement="above"
					hasInlineAmounts={recipeData.inlineAmounts}
				/>
			{/if}
			<button
				type="button"
				aria-label="Cerrar ingredientes y volver al procedimiento"
				onclick={closeDrawer}><Icon><X /></Icon></button
			>
		</footer>
	</dialog>
</section>

<style lang="scss">
	.ingredients {
		grid-area: two;
		align-self: start;
		padding-bottom: 1rem;
		scroll-margin-top: calc(var(--header-height) + 1.5rem);

		&.is-sticky {
			position: sticky;
			top: calc(var(--header-height) + 1.5rem);
		}
	}

	.ingredients-heading {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.25rem 1.25rem;
		font-size: clamp(1.8rem, 7vw, 4rem);
		margin-block: 0 0.4em;

		> h2.ingredients-title {
			margin-block: 0;
		}

		:global(.recipe-scale-chip) {
			font-size: clamp(0.88rem, 0.2625em, 1.05rem);
		}
	}

	.recipe-ingredients-intro {
		display: contents;
	}

	:global(.subingredients) {
		width: 100%;
		columns: 16rem auto;
		gap: 2rem;

		@media (max-width: $recipe-subingredients-narrow) {
			columns: unset;
		}
	}

	/* The legacy ingredient lists (masa-madre, pakoras, pochoclos) are MDX slot
	   content, so they carry no Svelte scope class. Keep these global but scoped
	   under .subingredients, exactly like the Nuxt implementation's dash markers. */
	:global(.subingredients ul) {
		list-style: none;
		padding: 0;
	}

	:global(.subingredients li) {
		margin-bottom: 0.7em;

		&::before {
			content: "- ";
			opacity: 0.7;
		}
	}

	:global(.subingredients code),
	:global(.subingredients .recipe-ingredient-quantity) {
		font-family: inherit;
		background-color: var(--color-bg-quantity-subingredient);
		font-weight: 500;
		padding: 0.2em 0.35em;
		font-size: 0.88em;
		border-radius: 0.2em;
	}

	.recipe-subingredient-title {
		margin-block: 0 0.4em;
		color: var(--color-subingredient-name);
	}

	:global(.subingredient) {
		break-inside: avoid;
		margin-bottom: 2rem;
	}

	.recipe-ingredient-drawer {
		position: fixed;
		inset: auto var(--recipe-column-right, 0) 0 var(--recipe-column-left, 0);
		margin: 0;
		padding: 0;
		width: auto;
		max-width: none;
		max-height: 86dvh;
		color: var(--color-text);
		background: var(--color-bg-0);
		box-shadow: var(--shadow-sheet);
		border: 0;
		border-radius: 1rem 1rem 0 0;
		overflow: hidden;
		--recipe-sheet-padding: max(
			var(--recipe-column-inset, 0px),
			var(--padding-inline-main, 1rem)
		);

		&[open] {
			display: flex;
			flex-direction: column;
			animation: recipe-drawer-in 0.38s cubic-bezier(0.16, 1, 0.3, 1);
		}

		&.is-closing {
			animation: recipe-drawer-out 0.26s cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		&::backdrop {
			background: rgb(0 0 0 / var(--backdrop-opacity, 0.3));
		}

		&[open]::backdrop {
			animation: recipe-backdrop-in 0.38s ease-out;
		}

		&.is-closing::backdrop {
			animation: recipe-backdrop-out 0.26s ease-in forwards;
		}
	}

	.recipe-drawer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
		margin-inline: var(--recipe-sheet-padding);
		padding: 0.5rem 0 max(0.5rem, env(safe-area-inset-bottom));
		border-top: var(--sidebar-recipe-border);

		h2 {
			margin: 0 auto 0 0;
			padding: 0;
			font-size: 1.6rem;
			line-height: 1;
			text-box: trim-both cap alphabetic;
		}

		> button {
			display: grid;
			place-items: center;
			min-width: 44px;
			min-height: 44px;
			margin-right: -0.5rem;
			padding: 0;
			background: none;
			border: 0;
			color: inherit;
			font-size: 1.75rem;
		}
	}

	.recipe-drawer-tabs {
		display: flex;
		gap: 1.25rem;
		padding: 0.25rem var(--recipe-sheet-padding);
		flex-shrink: 0;

		button {
			background: none;
			border: 0;
			color: inherit;
			min-height: 44px;
			padding: 0;
			font-size: 0.9rem;
			opacity: 0.6;
			text-decoration: underline transparent 2px;
			text-underline-offset: 0.4em;
		}

		button[aria-pressed="true"] {
			opacity: 1;
			text-decoration-color: var(--color-subingredient-name);
		}
	}

	.recipe-drawer-scroll {
		position: relative;
		display: flex;
		flex-direction: column;
		flex: 0 1 auto;
		overflow: hidden;
	}

	.recipe-drawer-content {
		flex: 1 1 auto;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 1.5rem var(--recipe-sheet-padding) 0.5rem;
		scrollbar-width: thin;
		outline: none;

		:global(.subingredients) {
			columns: unset;
		}
	}

	.recipe-drawer-fade {
		position: absolute;
		left: 0;
		right: 0;
		height: 3rem;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.25s ease;

		&.is-top {
			top: 0;
			background: linear-gradient(to bottom, var(--color-bg-0), transparent);
		}

		&.is-bottom {
			bottom: 0;
			background: linear-gradient(to top, var(--color-bg-0), transparent);
		}
	}

	.can-scroll-up > .recipe-drawer-fade.is-top,
	.can-scroll-down > .recipe-drawer-fade.is-bottom {
		opacity: 1;
	}

	@keyframes recipe-drawer-in {
		from {
			transform: translateY(100%);
		}
		to {
			transform: none;
		}
	}

	@keyframes recipe-drawer-out {
		from {
			transform: none;
		}
		to {
			transform: translateY(100%);
		}
	}

	@keyframes recipe-backdrop-in {
		from {
			opacity: 0;
		}
	}

	@keyframes recipe-backdrop-out {
		to {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.recipe-ingredient-drawer[open],
		.recipe-ingredient-drawer[open]::backdrop {
			animation: none;
		}

		.recipe-drawer-content {
			transition: none;
		}
	}

	@media print {
		.recipe-ingredient-drawer {
			display: none !important;
		}

		.ingredients.is-sticky {
			position: static;
		}
	}
</style>
