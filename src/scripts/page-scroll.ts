/*
	The document no longer scrolls: `.page-scroll` does, so that its view-transition
	snapshot is exactly the visible viewport and the route scale is always centred on
	what the reader is looking at. Astro's ClientRouter still restores window scroll
	(harmless, it is always zero), so this script owns restoration for the inner
	scrollport.

	The Navigation API entry key is stable across reloads and distinguishes repeated
	visits to the same URL, including fragment entries. Positions live in memory while
	scrolling and are checkpointed to sessionStorage on scrollend/navigation/pagehide.
*/
const positions = new Map<string, { left: number; top: number }>()
let scrollport = document.querySelector<HTMLElement>(".page-scroll")
let entryKey = window.navigation.currentEntry?.key
let routePending = false
let restoreTraversal = false

function rememberScroll(persist = true) {
	if (!scrollport || !entryKey) return
	const position = { left: scrollport.scrollLeft, top: scrollport.scrollTop }
	positions.set(entryKey, position)
	if (!persist) return
	try {
		sessionStorage.setItem(`page-scroll:${entryKey}`, `${position.left},${position.top}`)
	} catch {
		// Private/blocked storage still has per-entry restoration within this document.
	}
}

function restoreScroll(saved: boolean) {
	if (!scrollport || !entryKey) return
	let position = saved ? positions.get(entryKey) : undefined
	if (saved && !position) {
		try {
			const stored = sessionStorage.getItem(`page-scroll:${entryKey}`)
			if (stored) {
				const [left, top] = stored.split(",").map(Number)
				if (Number.isFinite(left) && Number.isFinite(top)) position = { left, top }
			}
		} catch {
			// Storage is optional; a fresh entry can still resolve its fragment normally.
		}
	}

	if (position) {
		scrollport.scrollTo({ ...position, behavior: "instant" })
	} else {
		scrollport.scrollTo({ left: 0, top: 0, behavior: "instant" })
		if (location.hash) {
			try {
				const fragment = decodeURIComponent(location.hash.slice(1))
				const target = document.getElementById(fragment) ?? document.getElementsByName(fragment)[0]
				target?.scrollIntoView({ block: "start", behavior: "instant" })
			} catch {
				// A malformed percent escape is not a valid fragment identifier.
			}
		}
	}

	/*
		With no document scrolling, PageDown/arrow keys on a focused body do nothing.
		Give the scroll region focus only when the swap/hard load left focus on body;
		never steal it from a link, fragment target or dialog, and never scroll on focus.
	*/
	if (document.activeElement === document.body) scrollport.focus({ preventScroll: true })
}

/*
	Hide the scrollbar's paint, not the bar or its gutter, while the viewport snapshot
	scales. The marker is removed by the first real scroll after the transition, so the
	native colours do not flash back while the editor's scroll restoration settles.
*/
let pendingScrollbar: AbortController | undefined

function deferScrollbarPaint(port: HTMLElement) {
	pendingScrollbar?.abort()
	const pending = new AbortController()
	pendingScrollbar = pending
	port.dataset.scrollbarPending = ""

	return () => {
		requestAnimationFrame(() => {
			if (pending.signal.aborted || !port.isConnected) return
			port.addEventListener(
				"scroll",
				() => {
					delete port.dataset.scrollbarPending
					pendingScrollbar = undefined
				},
				{ once: true, passive: true, signal: pending.signal },
			)
		})
	}
}

/*
	Fragment-only navigations bypass Astro's preparation/swap events. The native entry
	change observes both link clicks and programmatic navigation, including pushState.
	Queue restoration until after Astro's synchronous hash/popstate handling; a route
	preparation in that interval takes ownership instead.
*/
window.navigation.addEventListener("navigate", () => {
	if (!routePending) rememberScroll()
})

window.navigation.addEventListener("currententrychange", (event) => {
	const entry = window.navigation.currentEntry
	if (!entry || entry.key === entryKey || routePending) return
	const from = new URL(event.from.url ?? location.href)
	const to = new URL(entry.url ?? location.href)
	if (from.pathname !== to.pathname || from.search !== to.search) return
	queueMicrotask(() => {
		if (routePending || window.navigation.currentEntry?.key !== entry.key) return
		entryKey = entry.key
		restoreScroll(event.navigationType === "traverse")
		rememberScroll()
	})
})

document.addEventListener("astro:before-preparation", (event) => {
	rememberScroll()
	routePending = true
	// A superseded/aborted fetch must not leave fragment navigation disabled.
	event.signal.addEventListener("abort", () => {
		routePending = false
	}, { once: true })
})

document.addEventListener("astro:before-swap", (event) => {
	rememberScroll()
	restoreTraversal = event.navigationType === "traverse"

	/* The marker belongs to the incoming scrollport, not the replaced root. Arm the
	   shared one-shot restoration only after Astro finishes/skips its transition. */
	const incoming = event.newDocument.querySelector<HTMLElement>(".page-scroll")
	const restoreScrollbar = incoming && deferScrollbarPaint(incoming)
	event.viewTransition.finished.then(
		() => {
			if (incoming !== scrollport || event.signal.aborted) return
			restoreScrollbar?.()
		},
		() => {
			// A failed swap has no incoming scrollport to arm.
		},
	)
})

document.addEventListener("astro:after-swap", () => {
	scrollport = document.querySelector<HTMLElement>(".page-scroll")
	entryKey = window.navigation.currentEntry?.key
	restoreScroll(restoreTraversal)
	routePending = false
	rememberScroll()
})

// Element scroll does not bubble, so listen in the capture phase.
document.addEventListener(
	"scroll",
	(event) => {
		if (event.target === scrollport) rememberScroll(false)
	},
	{ capture: true, passive: true },
)
// Keep synchronous storage writes off the scrolling hot path; navigation/pagehide
// still checkpoint the exact position if the reader leaves before scrollend.
document.addEventListener(
	"scrollend",
	(event) => {
		if (event.target === scrollport) rememberScroll()
	},
	{ capture: true, passive: true },
)
window.addEventListener("pagehide", () => rememberScroll())
window.addEventListener("pageshow", (event) => {
	if (event.persisted) restoreScroll(true)
})

/*
	A reload keeps the same navigation entry key, so it restores the reader's position.
	A brand-new document has no saved position and starts at the top (or its fragment).
*/
const navigationType = (
	performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
)?.type
restoreScroll(navigationType === "reload" || navigationType === "back_forward")
