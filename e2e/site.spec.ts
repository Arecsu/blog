import { expect, test } from "@playwright/test"

test("home, header and theme switch", async ({ page }) => {
	await page.goto("/")
	await expect(page).toHaveTitle("a9r")
	await expect(page.locator(".header-menu a", { hasText: "base" })).toHaveAttribute(
		"aria-current",
		"page",
	)
	await expect(page.locator(".base-container p").first()).toHaveText("hello! I'm Alejandro")

	const button = page.locator(".theme-button")
	const before = await page.evaluate(() => document.documentElement.getAttribute("theme"))
	await button.click()
	await expect
		.poll(() => page.evaluate(() => document.documentElement.getAttribute("theme")))
		.not.toBe(before)
	await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
		"content",
		/#(0e141b|fbeec0)/,
	)
})

test("recipes list excludes drafts and uses real links", async ({ page }) => {
	await page.goto("/recetas/")
	await expect(page).toHaveTitle("recetas · a9r")
	const links = page.locator(".recipes-list-container a")
	await expect(links.filter({ hasText: "pizza" })).toHaveCount(1)
	await expect(links.filter({ hasText: "pan de papas" })).toHaveCount(0)
	await expect(links.filter({ hasText: "torta chocolate stout" })).toHaveCount(0)
	await expect(links).toHaveCount(21)
})

test("recipe scaling and anchored amount popover", async ({ page }) => {
	await page.goto("/recetas/pizza/")
	await expect(page).toHaveTitle("pizza · a9r")

	const scaleChip = page.locator(".recipe-scale-chip").first()
	await expect(scaleChip).toHaveAttribute("aria-label", "Ajustar cantidades (1×)")
	await scaleChip.click()
	await page.locator('.recipe-scale-presets button[aria-label="El doble"]').first().click()

	await expect(scaleChip).toHaveAttribute("aria-label", "Ajustar cantidades (2×)")
	await expect(
		page.locator(".ingredients .recipe-ingredient-quantity").first(),
	).toHaveText("1.000g")
	await expect(page.locator('.recipe-inline-amount[data-ingredient="water"]').first()).toHaveText(
		"600g",
	)
	await expect(page.locator(".recipe-scaled-notice")).toContainText("2×")

	const flour = page.locator('.recipe-inline-amount[data-ingredient="flour"]').first()
	await flour.click()
	await expect(flour).toHaveAttribute("aria-expanded", "true")
	const popover = page.locator(".recipe-amount-popover")
	await expect(popover).toBeVisible()
	await expect(popover).toContainText("Harina 000")
	await expect(popover).toContainText("Receta original: 500g · Ahora 2×")
	await page.keyboard.press("Escape")
	await expect(popover).toBeHidden()
})

test("notes strip emoji markers and open external links in a new tab", async ({ page }) => {
	await page.goto("/notes/links/")
	await expect(page).toHaveTitle("Links · a9r")
	await expect(page.locator(".nota-container h2").first()).toHaveText("✏️ Blogs")
	await expect(page.locator(".nota-container")).not.toContainText(":✏️:")
	const external = page.locator('.nota-container a[href="https://ciechanow.ski/"]')
	await expect(external).toHaveAttribute("target", "_blank")
	await expect(external).toHaveAttribute("rel", /noopener/)
})

test("inline amount visibility is applied before first paint", async ({ page }) => {
	await page.addInitScript(() => {
		try {
			localStorage.setItem("recipe-show-amounts", "false")
		} catch {
			// ignore blocked storage in the test browser
		}
	})
	await page.goto("/recetas/pizza/", { waitUntil: "domcontentloaded" })
	await expect(page.locator("html")).toHaveAttribute("data-recipe-amounts", "hidden")
	const water = page.locator('.recipe-inline-amount[data-ingredient="water"]').first()
	await expect(water).toBeHidden()
	const hiddenText = await page
		.locator(".recipe-process ol li")
		.first()
		.evaluate((element) => element.innerText.replace(/\s+/g, " ").trim())
	expect(hiddenText).toBe("Mezclar agua + sal + levadura.")

	// Showing them again updates the root attribute and the store together.
	await page.locator(".recipe-scale-chip").first().click()
	await page.locator('input[name="recipe-show-amounts"]').first().check()
	await expect(page.locator("html")).not.toHaveAttribute("data-recipe-amounts", "hidden")
	await expect(water).toBeVisible()
	const shownText = await page
		.locator(".recipe-process ol li")
		.first()
		.evaluate((element) => element.innerText.replace(/\s+/g, " ").trim())
	expect(shownText).toContain("agua 300g")
})

test("ClientRouter navigation resets the recipe scale", async ({ page }) => {
	await page.goto("/recetas/pizza/")
	await page.locator(".recipe-scale-chip").first().click()
	await page.locator('.recipe-scale-presets button[aria-label="El doble"]').first().click()
	await expect(page.locator(".ingredients .recipe-ingredient-quantity").first()).toHaveText(
		"1.000g",
	)

	await page.locator('.header-menu a[href="/recetas/"]').click()
	await expect(page).toHaveURL(/\/recetas\/$/)
	await page.locator('.recipes-list-container a[href="/recetas/pizza/"]').click()
	await expect(page).toHaveURL(/\/recetas\/pizza\/$/)
	await expect(page.locator(".recipe-scale-chip").first()).toHaveAttribute(
		"aria-label",
		"Ajustar cantidades (1×)",
	)
	await expect(page.locator(".ingredients .recipe-ingredient-quantity").first()).toHaveText(
		"500g",
	)
})

test("route transition scales the viewport snapshot around its centre", async ({ page }) => {
	await page.goto("/")
	const animation = await page.evaluate(async () => {
		const seen = new Promise<{ pseudo: string; name: string; duration: number; transform?: string } | null>(
			(resolve) => {
				document.addEventListener(
					"astro:before-swap",
					(event) => {
						event.viewTransition.ready.then(() => {
							const found = document
								.getAnimations()
								.find(
									(candidate) =>
										candidate instanceof CSSAnimation &&
										candidate.effect instanceof KeyframeEffect &&
										candidate.effect.pseudoElement ===
											"::view-transition-new(route-viewport)",
								)
							if (!(found instanceof CSSAnimation) || !(found.effect instanceof KeyframeEffect)) {
								resolve(null)
								return
							}
							const [first] = found.effect.getKeyframes()
							resolve({
								pseudo: found.effect.pseudoElement ?? "",
								name: found.animationName,
								duration: Number(found.effect.getTiming().duration),
								transform: first?.transform,
							})
						})
					},
					{ once: true },
				)
				document.querySelector<HTMLAnchorElement>('.header-menu a[href="/notes/"]')?.click()
			},
		)
		return seen
	})

	expect(animation).not.toBeNull()
	expect(animation?.pseudo).toBe("::view-transition-new(route-viewport)")
	expect(animation?.name).toBe("route-enter")
	expect(animation?.duration).toBe(250)
	expect(animation?.transform).toContain("0.99")
})

test("the inner viewport scrollport owns scrolling and back restores its position", async ({
	page,
}) => {
	await page.goto("/recetas/pizza/")
	const scrollTop = () =>
		page.evaluate(() => document.querySelector<HTMLElement>(".page-scroll")?.scrollTop ?? 0)

	await page.evaluate(() => {
		const scroller = document.querySelector<HTMLElement>(".page-scroll")
		if (scroller) scroller.scrollTop = 1400
	})
	await expect.poll(scrollTop).toBeGreaterThan(1000)
	await expect(page.locator(".header-container")).toHaveClass(/is-title/)
	// The document itself no longer scrolls.
	expect(await page.evaluate(() => window.scrollY)).toBe(0)

	await page.evaluate(() => {
		document.querySelector<HTMLAnchorElement>('.header-menu a[href="/recetas/"]')?.click()
	})
	await expect(page).toHaveURL(/\/recetas\/$/)
	await expect.poll(scrollTop).toBe(0)

	await page.goBack()
	await expect(page).toHaveURL(/\/recetas\/pizza\/$/)
	await expect.poll(scrollTop).toBeGreaterThan(1000)
})

test("ClientRouter carries the pre-paint theme and amount preferences", async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem("theme-setting", "dark")
		localStorage.setItem("recipe-show-amounts", "false")
	})

	await page.goto("/recetas/")
	await expect(page.locator("html")).toHaveAttribute("theme", "dark")

	// The incoming document is parsed without running the head scripts. If it arrives
	// without the preferences, the swap paints one light frame before the island
	// re-applies them. The theme-color meta must also be the persisted node, not the
	// incoming light default.
	const carried = await page.evaluate(
		() =>
			new Promise<{
				theme: string | null
				amounts: string | null
				metaPersisted: boolean
				metaContent: string | null
			}>((resolve) => {
				const meta = document.querySelector('meta[name="theme-color"]')
				let incoming = { theme: null as string | null, amounts: null as string | null }
				document.addEventListener(
					"astro:before-swap",
					(event) => {
						incoming = {
							theme: event.newDocument.documentElement.getAttribute("theme"),
							amounts:
								event.newDocument.documentElement.getAttribute("data-recipe-amounts"),
						}
					},
					{ once: true },
				)
				document.addEventListener(
					"astro:after-swap",
					() => {
						requestAnimationFrame(() => {
							const current = document.querySelector('meta[name="theme-color"]')
							resolve({
								...incoming,
								metaPersisted: current === meta,
								metaContent: current?.getAttribute("content") ?? null,
							})
						})
					},
					{ once: true },
				)
				document
					.querySelector<HTMLAnchorElement>('.recipes-list-container a[href="/recetas/pizza/"]')
					?.click()
			}),
	)

	expect(carried).toEqual({
		theme: "dark",
		amounts: "hidden",
		metaPersisted: true,
		metaContent: "#0e141b",
	})
	await expect(page).toHaveURL(/\/recetas\/pizza\/$/)
	await expect(page.locator("html")).toHaveAttribute("theme", "dark")
	await expect(page.locator("html")).toHaveAttribute("data-recipe-amounts", "hidden")
})

test("legacy ingredient lists keep the dash markers and process headings their spacing", async ({
	page,
}) => {
	await page.goto("/recetas/masa-madre/")
	const legacy = await page
		.locator(".subingredients li")
		.first()
		.evaluate((element) => ({
			listStyle: getComputedStyle(element.parentElement).listStyleType,
			marker: getComputedStyle(element, "::before").content,
		}))
	expect(legacy).toEqual({ listStyle: "none", marker: '"- "' })

	await page.goto("/recetas/pochoclos-salados/")
	expect(
		await page
			.locator(".recipe-process-content h3")
			.first()
			.evaluate((element) => getComputedStyle(element).marginTop),
	).toBe("0px")

	await page.goto("/recetas/pizza/")
	const margins = await page.evaluate(() => {
		const title = document.querySelector<HTMLElement>(".recipe-process-title")
		const first = document.querySelector<HTMLElement>(".recipe-process-content h3")
		return {
			title: title ? getComputedStyle(title).marginTop : null,
			first: first ? getComputedStyle(first).marginTop : null,
		}
	})
	expect(margins).toEqual({ title: "0px", first: "0px" })
})

test("print restores normal document flow instead of clipping the scrollport", async ({
	page,
}) => {
	await page.goto("/recetas/pizza/")
	await page.emulateMedia({ media: "print" })
	const print = await page.locator(".page-scroll").evaluate((element) => {
		const style = getComputedStyle(element)
		return {
			overflowY: style.overflowY,
			transitionName: style.viewTransitionName,
			tallerThanViewport: element.getBoundingClientRect().height > window.innerHeight,
		}
	})
	expect(print).toEqual({
		overflowY: "visible",
		transitionName: "none",
		tallerThanViewport: true,
	})
})

test("sticky ingredients follow the inner scrollport", async ({ page }) => {
	await page.setViewportSize({ width: 1600, height: 900 })
	await page.goto("/recetas/pizza/")
	await expect(page.locator(".ingredients")).toHaveClass(/is-sticky/)

	await page.evaluate(() => {
		const scrollport = document.querySelector<HTMLElement>(".page-scroll")
		if (scrollport) scrollport.scrollTop = 900
	})
	// Sticky top is the header (2.3rem) plus its 1.5rem offset.
	await expect
		.poll(() =>
			page.evaluate(() =>
				Math.round(document.querySelector(".ingredients")?.getBoundingClientRect().top ?? 0),
			),
		)
		.toBe(61)
})

test("markdown keeps the authored punctuation and tight note parentheses", async ({ page }) => {
	await page.goto("/recetas/pizza/")
	const proTip = page.locator(".recipe-process p", { hasText: "piedra refractaria" })
	await expect(proTip).toContainText('""piedra""')
	await expect(proTip).not.toContainText("“")

	await page.goto("/recetas/pakoras/")
	await expect(page.locator(".recipe-process")).toContainText("pues...")
	await expect(page.locator(".recipe-process")).not.toContainText("pues…")

	await page.goto("/recetas/crema-chantilly/")
	const cream = page.locator(".subingredients li", { hasText: "Crema doble de leche" })
	await expect(cream).toContainText("(mayor a 34% grasa)")
	await expect(cream).not.toContainText("grasa )")
})

test("theme switch icon keeps its geometry during a route transition", async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem("theme-setting", "dark"))
	await page.goto("/")

	const samples = await page.evaluate(
		() =>
			new Promise<{ buttonY: number; buttonH: number; iconY: number }[]>((resolve) => {
				const seen: { buttonY: number; buttonH: number; iconY: number }[] = []
				const sample = () => {
					const button = document.querySelector<HTMLElement>(".theme-button")
					const icon = [...document.querySelectorAll<SVGElement>(".theme-button svg")].find(
						(svg) => svg.getBoundingClientRect().height > 0,
					)
					if (button && icon) {
						const box = button.getBoundingClientRect()
						seen.push({
							buttonY: box.y,
							buttonH: box.height,
							iconY: icon.getBoundingClientRect().y,
						})
					}
					if (seen.length < 80) requestAnimationFrame(sample)
					else resolve(seen)
				}
				requestAnimationFrame(sample)
				document.querySelector<HTMLAnchorElement>('.header-menu a[href="/notes/"]')?.click()
			}),
	)

	await expect(page).toHaveURL(/\/notes\/$/)
	const geometries = new Set(
		samples.map(
			({ buttonY, buttonH, iconY }) =>
				`${buttonY.toFixed(1)}/${buttonH.toFixed(1)}/${iconY.toFixed(1)}`,
		),
	)
	expect(geometries.size).toBe(1)
})
