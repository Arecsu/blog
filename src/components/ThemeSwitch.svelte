<script lang="ts">
	import { onMount } from "svelte"
	import Icon from "./Icon.svelte"
	import { GhostFilled, Lightbulb } from "./icons.ts"

	type Scheme = "dark" | "light" | "system"

	let currentColorScheme = $state<Scheme | undefined>(undefined)
	let systemColorScheme = $state<"dark" | "light">("light")

	const tooltips: Record<"dark" | "light" | "system", string> = {
		light: "vitamin D 🏖️",
		dark: "darkness 🦉",
		system: "same as system 💾",
	}

	const themeState = $derived.by(() => {
		if (!currentColorScheme) return { icon: undefined, tooltip: "" }
		if (currentColorScheme === "system") {
			return { icon: systemColorScheme, tooltip: tooltips.system }
		}
		return { icon: currentColorScheme, tooltip: tooltips[currentColorScheme] }
	})

	function updateThemeColor(theme: "dark" | "light") {
		const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
		meta?.setAttribute("content", theme === "dark" ? "#0e141b" : "#fbeec0")
	}

	function applyTheme() {
		if (!currentColorScheme) return
		const theme = currentColorScheme === "system" ? systemColorScheme : currentColorScheme
		document.documentElement.setAttribute("theme", theme)
		updateThemeColor(theme)
		try {
			localStorage.setItem("theme-setting", currentColorScheme)
		} catch {
			// Storage can be blocked; the theme still applies for this page.
		}
	}

	function nextColorScheme() {
		const schemes: Scheme[] = ["dark", "light", "system"]
		currentColorScheme = schemes[(schemes.indexOf(currentColorScheme ?? "system") + 1) % schemes.length]
		applyTheme()
	}

	function onSystemChange(event: MediaQueryListEvent) {
		systemColorScheme = event.matches ? "dark" : "light"
		if (currentColorScheme === "system") applyTheme()
	}

	onMount(() => {
		const query = window.matchMedia("(prefers-color-scheme: dark)")
		systemColorScheme = query.matches ? "dark" : "light"
		try {
			const saved = localStorage.getItem("theme-setting")
			currentColorScheme =
				saved === "dark" || saved === "light" || saved === "system" ? saved : "system"
		} catch {
			currentColorScheme = "system"
		}
		applyTheme()
		query.addEventListener("change", onSystemChange)
		return () => query.removeEventListener("change", onSystemChange)
	})
</script>

<span class="theme-switch">
	{#if !currentColorScheme}
		<button type="button" class="button-no-style theme-button" aria-label="Cambiar tema">
			<span class="placeholder-dark"><Icon size="1.2em"><GhostFilled /></Icon></span>
			<span class="placeholder-light"><Icon size="1.1em"><Lightbulb /></Icon></span>
		</button>
	{:else}
		<button
			type="button"
			class="button-no-style theme-button tooltip-trigger"
			style:anchor-name="--theme-tooltip"
			aria-label={`Cambiar tema (${tooltips[currentColorScheme]})`}
			onclick={nextColorScheme}
		>
			<span class="theme-icon">
				{#if themeState.icon === "dark"}
					<Icon size="1.2em"><GhostFilled /></Icon>
				{:else}
					<Icon size="1.1em"><Lightbulb /></Icon>
				{/if}
			</span>
		</button>
		<span class="tooltip" style:position-anchor="--theme-tooltip">{themeState.tooltip}</span>
	{/if}
</span>

<style lang="scss">
	.theme-switch {
		display: inline-block;
		position: relative;
	}

	.theme-button {
		display: inline-grid;
		width: 1.85em;
	}

	.theme-button > span {
		grid-area: 1 / 1 / 2 / 2;
		margin-top: 0.1em;
	}

	.placeholder-dark,
	.placeholder-light {
		display: none;
	}

	/* Match the hydrated `.theme-icon` box exactly: a block wrapper adds the body
	   line box and makes the button 5px taller for the frame between the incoming
	   HTML painting the placeholder and the island hydrating. */
	:global(html[theme="dark"]) .placeholder-dark,
	:global(html[theme="light"]) .placeholder-light {
		display: inline-flex;
	}

	.theme-icon {
		display: inline-flex;
	}
</style>
