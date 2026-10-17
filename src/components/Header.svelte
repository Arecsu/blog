<script lang="ts">
	import { onMount } from "svelte"
	import ThemeSwitch from "./ThemeSwitch.svelte"

	interface Props {
		activePath: string
		headerTitle?: string
	}

	let { activePath, headerTitle = "" }: Props = $props()

	let titleVisible = $state(false)
	let hovering = $state(false)
	let isTouchscreenOnly = false
	let lastY = 0
	let scrollDownLast = 0
	let beforeScroll = 0
	let headerElement: HTMLElement | undefined
	let scrollport: HTMLElement | undefined

	const scrollTop = () => scrollport?.scrollTop ?? 0

	const isTitle = $derived(Boolean(headerTitle) && titleVisible && !hovering)
	const isActive = (href: string) =>
		href === "/" ? activePath === "/" : activePath === href || activePath.startsWith(href)

	function resetTitle() {
		titleVisible = false
		lastY = scrollTop()
		scrollDownLast = scrollTop()
		hovering = false
	}

	function onScroll() {
		if (scrollTop() > lastY + 200 && !titleVisible) {
			// Scrolled down far enough: the menu yields to the page title.
			titleVisible = true
		}
		if (scrollTop() > beforeScroll) {
			scrollDownLast = scrollTop()
		} else if (scrollTop() + 60 < scrollDownLast || scrollTop() < 300) {
			// Scrolling up (or back near the top): bring the menu back.
			titleVisible = false
			lastY = scrollTop()
		}
		beforeScroll = scrollTop()
	}

	function onMouseEnter() {
		if (!isTouchscreenOnly) hovering = true
	}

	function onMouseLeave() {
		if (!isTouchscreenOnly) resetTitle()
	}

	function onTouchEnd() {
		setTimeout(resetTitle, 50)
	}

	onMount(() => {
		isTouchscreenOnly = window.matchMedia("(pointer: coarse)").matches
		// The header is sticky inside the inner scrollport, which is the page scroll
		// owner after the view-transition wrapper change.
		scrollport = headerElement?.closest<HTMLElement>(".page-scroll") ?? undefined
		lastY = scrollTop()
		scrollDownLast = scrollTop()
		beforeScroll = scrollTop()
		scrollport?.addEventListener("scroll", onScroll, { passive: true })
		return () => scrollport?.removeEventListener("scroll", onScroll)
	})
</script>

<div class="header-container" class:is-title={isTitle} bind:this={headerElement}>
	<!-- Pointer/touch only toggle the title swap; the header keeps its banner semantics. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<header onmouseenter={onMouseEnter} onmouseleave={onMouseLeave} ontouchend={onTouchEnd}>
		<nav>
			<ul class="header-menu" inert={isTitle} aria-hidden={isTitle || undefined}>
				<li>
					<a href="/" class:active={isActive("/")} aria-current={isActive("/") ? "page" : undefined}>
						<span class="slash">/--</span>base
					</a>
				</li>
				<li>
					<a
						href="/notes/"
						class:active={isActive("/notes/")}
						aria-current={isActive("/notes/") ? "page" : undefined}
					>notes</a>
				</li>
				<li>
					<a
						href="/recetas/"
						class:active={isActive("/recetas/")}
						aria-current={isActive("/recetas/") ? "page" : undefined}
					>recetas</a>
				</li>
			</ul>
			<span class="header-title" aria-hidden={!isTitle || undefined}>→ {headerTitle}</span>
		</nav>
		<div class="header-right-side" inert={isTitle} aria-hidden={isTitle || undefined}>
			<div class="header-theme"><ThemeSwitch /></div>
			<span class="header-arrow">↙</span>
		</div>
	</header>
</div>

<style lang="scss">
	.header-container {
		display: grid;
		background-color: var(--color-bg-0);
		position: sticky;
		top: 0;
		z-index: 1;
		view-transition-name: site-header;
	}

	header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		height: var(--header-height);
		font-weight: 400;
		border-bottom: var(--header-border-bottom, none);
		padding-inline: var(--padding-inline-header, 0);
		margin-inline: var(--margin-inline-header, 0);
	}

	nav {
		display: inline-grid;
	}

	nav > * {
		grid-area: 1 / 1 / 2 / 2;
	}

	.header-menu {
		display: flex;
		list-style-type: none;
		gap: 1.5em;
		align-items: center;
		padding: 0;
		font-size: 0.9em;
		margin-bottom: 0.05em;
		margin-top: 0.1em;
	}

	a {
		text-decoration: none;
	}

	.slash {
		font-style: italic;
	}

	.header-title {
		white-space: nowrap;
		opacity: 0;
		transform: translateY(1em);
		pointer-events: none;
	}

	.header-menu,
	.header-right-side {
		opacity: 1;
		transform: none;
	}

	.header-menu,
	.header-title,
	.header-right-side {
		transition: opacity 0.15s, transform 0.2s;
		transition-timing-function: ease;
	}

	.is-title .header-menu {
		opacity: 0;
		transform: translateY(-1em);
		pointer-events: none;
	}

	.is-title .header-title {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}

	.is-title .header-right-side {
		opacity: 0;
		transform: translateY(-0.5em);
		pointer-events: none;
	}

	.header-right-side {
		display: flex;
		align-items: center;
	}

	.header-theme {
		margin-right: 0.9rem;
	}

	.header-arrow {
		font-weight: 400;
		font-size: 1.3em;
		transform: translateY(-0.04em);
	}

	@media (prefers-reduced-motion: reduce) {
		.header-menu,
		.header-title,
		.header-right-side {
			transition: none;
		}
	}
</style>
