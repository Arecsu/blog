<script lang="ts">
	import { onDestroy, type Snippet } from "svelte"
	import { openRecipePopover, recipePopoverAnchor } from "@lib/recipe-popover.ts"

	interface Props {
		id: string
		placement?: "above" | "below"
		tag?: "div" | "span"
		label?: string
		class?: string
		style?: string
		anchor?: string
		open?: boolean
		onToggle?: (open: boolean) => void
		children: Snippet
	}

	let {
		id,
		placement = "below",
		tag = "div",
		label,
		class: className = "",
		style,
		anchor,
		open = $bindable(false),
		onToggle,
		children,
	}: Props = $props()

	let element: HTMLElement | undefined
	let trigger: HTMLElement | undefined
	let closing: (() => void) | undefined

	// Only one popover is open at a time, mirrored in a module-level slot so a
	// newly opened one closes the previous even across components.
	const self = { hide }

	function isOpen() {
		return Boolean(element?.matches(":popover-open"))
	}

	function show(from?: HTMLElement) {
		if (!element) return
		if (from) trigger = from
		if (closing) return closing()
		if (isOpen()) return
		if (openRecipePopover.current !== self) openRecipePopover.current?.hide()
		element.showPopover()
	}

	// Fade out (.is-closing), then really close.
	function hide() {
		if (!element || !isOpen() || closing) return
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			element.hidePopover()
			return
		}
		const finish = (close: boolean) => {
			clearTimeout(fallback)
			element?.removeEventListener("transitionend", onEnd)
			element?.classList.remove("is-closing")
			closing = undefined
			if (close) element?.hidePopover()
		}
		const onEnd = (event: TransitionEvent) => {
			if (event.target === element && event.propertyName === "opacity") finish(true)
		}
		const fallback = setTimeout(() => finish(true), 250)
		element.addEventListener("transitionend", onEnd)
		element.classList.add("is-closing")
		closing = () => finish(false)
	}

	export function toggle(event?: Event) {
		const from = event?.currentTarget instanceof HTMLElement ? event.currentTarget : undefined
		if (isOpen() && !closing) hide()
		else show(from)
	}

	// Scrolling away closes it, past a small distance so a stray touch doesn't.
	const SCROLL_CLOSE_DISTANCE = 48
	let scrollStarts = new Map<EventTarget, [number, number]>()

	function scrollPosition(target: EventTarget): [number, number] {
		if (target === document) return [window.scrollX, window.scrollY]
		const el = target as Element
		return [el.scrollLeft, el.scrollTop]
	}

	function onScroll(event: Event) {
		const target = event.target
		if (!target || element?.contains(target as Node)) return
		const start = scrollStarts.get(target)
		if (!start) return void scrollStarts.set(target, scrollPosition(target))
		const [x, y] = scrollPosition(target)
		if (Math.hypot(x - start[0], y - start[1]) > SCROLL_CLOSE_DISTANCE) hide()
	}

	function onPointerDown(event: PointerEvent) {
		const target = event.target as Node
		if (!element?.contains(target) && !trigger?.contains(target)) hide()
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key !== "Escape") return
		event.preventDefault()
		event.stopPropagation()
		hide()
		trigger?.focus()
	}

	function startWatching() {
		openRecipePopover.current = self
		// Seed the actual page scroll owner (the inner viewport scrollport) so the
		// first scroll frame is already measured against the position at open time.
		scrollStarts = new Map<EventTarget, [number, number]>()
		const scrollport = document.querySelector(".page-scroll")
		for (const target of [document, scrollport]) {
			if (target) scrollStarts.set(target, scrollPosition(target))
		}
		document.addEventListener("scroll", onScroll, { capture: true, passive: true })
		document.addEventListener("pointerdown", onPointerDown, { capture: true })
		document.addEventListener("keydown", onKeyDown, { capture: true })
	}

	function stopWatching() {
		document.removeEventListener("scroll", onScroll, { capture: true })
		document.removeEventListener("pointerdown", onPointerDown, { capture: true })
		document.removeEventListener("keydown", onKeyDown, { capture: true })
	}

	function handleToggle(event: Event) {
		const state = (event as Event & { newState?: string }).newState === "open"
		open = state
		if (state) startWatching()
		else {
			if (openRecipePopover.current === self) openRecipePopover.current = undefined
			stopWatching()
		}
		onToggle?.(state)
	}

	onDestroy(() => {
		if (typeof document === "undefined") return
		closing?.()
		stopWatching()
		if (openRecipePopover.current === self) openRecipePopover.current = undefined
	})
</script>

<svelte:element
	this={tag}
	bind:this={element}
	{id}
	popover="manual"
	class={["recipe-popover", `is-${placement}`, className]}
	style={`position-anchor: ${anchor ?? recipePopoverAnchor(id)};${style ?? ""}`}
	role="dialog"
	aria-label={label}
	ontoggle={handleToggle}
>
	{@render children()}
</svelte:element>

<style lang="scss">
	.recipe-popover {
		--recipe-popover-width-used: min(var(--recipe-popover-width, 20rem), 100% - 1rem);
		inset: auto;
		margin: 0;
		width: var(--recipe-popover-width-used);
		right: clamp(0.5rem, anchor(right), 100% - var(--recipe-popover-width-used) - 0.5rem);
		position-try-fallbacks: flip-block;
		padding: 1rem 1.1rem 1.1rem;
		border: 0;
		border-radius: 0.75rem;
		color: var(--color-text);
		background: var(--color-bg-raised);
		box-shadow: var(--shadow-popover);
		transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1),
			scale 0.18s cubic-bezier(0.16, 1, 0.3, 1);

		&:popover-open {
			@starting-style {
				opacity: 0;
				scale: 0.94;
			}
		}

		&.is-closing {
			opacity: 0;
			scale: 0.94;
			transition-duration: 0.12s;
			transition-timing-function: ease-in;
		}

		&.is-above {
			bottom: calc(anchor(top) + 0.5rem);
			transform-origin: bottom right;
		}

		&.is-below {
			top: calc(anchor(bottom) + 0.5rem);
			transform-origin: top right;
		}

		@media (max-width: $recipe-popover-mobile) {
			right: clamp(
				0.5rem,
				clamp(
					anchor(left) - var(--recipe-popover-width-used),
					(100% - var(--recipe-popover-width-used)) / 2,
					anchor(right)
				),
				100% - var(--recipe-popover-width-used) - 0.5rem
			);

			&.is-above {
				transform-origin: bottom center;
			}

			&.is-below {
				transform-origin: top center;
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.recipe-popover {
			transition: none;
		}
	}
</style>
