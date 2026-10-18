import { expect, test, type Page } from "@playwright/test"

function scrollToProcedure(page: Page, offset = 400) {
	return page.evaluate((offset) => {
		const scroller = document.querySelector<HTMLElement>(".page-scroll")
		const heading = document.querySelector("#procedimiento")
		if (!scroller || !heading) return
		scroller.scrollTop = heading.getBoundingClientRect().top + scroller.scrollTop + offset
	}, offset)
}

test("mobile ingredient drawer opens, filters and closes without moving the page list", async ({
	page,
	isMobile,
}) => {
	test.skip(!isMobile, "mobile drawer only")

	await page.goto("/recetas/torta-matilda/")
	await scrollToProcedure(page)

	const dock = page.locator(".recipe-mobile-dock")
	await expect(dock).toHaveClass(/is-reading-process/)

	// The current section must have real width: a zero-width flex item hid the
	// label and left only the "Estás en" kicker visible.
	const dockText = await dock.locator(".recipe-dock-section").evaluate((element) => {
		const kicker = element.querySelector("span")
		const label = element.querySelector("strong")
		return {
			sectionWidth: element.getBoundingClientRect().width,
			kickerHeight: kicker?.getBoundingClientRect().height ?? 0,
			labelWidth: label?.getBoundingClientRect().width ?? 0,
			label: label?.textContent?.trim() ?? "",
		}
	})
	expect(dockText.sectionWidth).toBeGreaterThan(48)
	expect(dockText.labelWidth).toBeGreaterThan(24)
	expect(dockText.kickerHeight).toBeLessThan(14)
	expect(dockText.label).not.toBe("Proceso")
	expect(dockText.label).not.toBe("Ingredientes")

	await dock.locator("button").click()

	const dialog = page.locator(".recipe-ingredient-drawer")
	await expect(dialog).toHaveAttribute("open")
	// The page keeps its own panel; the sheet renders a second list from the same data.
	await expect(page.locator(".recipe-ingredient-panel .subingredients")).toHaveCount(1)
	await expect(dialog.locator(".recipe-drawer-content .subingredients")).toHaveCount(1)
	expect(
		await page.evaluate(() => {
			const inPage = document.querySelector(".recipe-ingredient-panel li")
			const inDrawer = document.querySelector(".recipe-drawer-content li")
			return inPage !== null && inDrawer !== null && inPage !== inDrawer
		}),
	).toBe(true)

	// The inner scrollport, not the document, is the locked surface.
	const scrollportState = () =>
		page.evaluate(() => {
			const scrollport = document.querySelector<HTMLElement>(".page-scroll")
			return { overflow: scrollport?.style.overflowY, top: Math.round(scrollport?.scrollTop ?? 0) }
		})
	const lockedAt = await scrollportState()
	expect(lockedAt.overflow).toBe("hidden")

	await dialog.locator(".recipe-drawer-tabs button", { hasText: "Todos" }).click()
	const content = dialog.locator(".recipe-drawer-content")
	await expect
		.poll(() =>
			content.evaluate((element) => element.scrollHeight > element.clientHeight),
		)
		.toBe(true)

	await content.evaluate((element) => {
		element.scrollTop = 120
	})
	await expect(dialog.locator(".recipe-drawer-scroll")).toHaveClass(/can-scroll-up/)
	await expect(dialog.locator(".recipe-drawer-scroll")).toHaveClass(/can-scroll-down/)

	await dialog.locator(".recipe-drawer-header > button").click()
	await expect(dialog).not.toHaveAttribute("open")
	await expect(page.locator(".recipe-ingredient-panel .subingredients")).toBeVisible()
	await expect.poll(scrollportState).toEqual({ overflow: "", top: lockedAt.top })
})

test("legacy recipe drawer reads groups from the rendered list", async ({ page, isMobile }) => {
	test.skip(!isMobile, "mobile drawer only")

	await page.goto("/recetas/pakoras/")
	await scrollToProcedure(page)

	await page.locator(".recipe-mobile-dock button").click()
	const dialog = page.locator(".recipe-ingredient-drawer")
	await expect(dialog).toHaveAttribute("open")
	await expect(dialog.locator(".recipe-subingredient-title")).toHaveText([
		"Masa",
		"Salsa",
		"Fritura",
	])
	await expect(page.locator(".recipe-ingredient-panel")).toHaveCount(1)

	await dialog.locator(".recipe-drawer-header > button").click()
	await expect(dialog).not.toHaveAttribute("open")
	await expect
		.poll(() =>
			page.evaluate(() =>
				[...document.querySelectorAll(".recipe-ingredient-panel .subingredient")].every(
					(element) => !element.hasAttribute("hidden"),
				),
			),
		)
		.toBe(true)
})

test("opening the drawer leaves the recipe below it where it was", async ({ page, isMobile }) => {
	test.skip(!isMobile, "mobile drawer only")

	await page.goto("/recetas/crema-pastelera/")
	await scrollToProcedure(page)

	// The stand-in for the moved list copies the panel's border box, and the panel is
	// flow-root so that box includes the last group's bottom margin. Without that, the
	// ingredients row shrank by 2rem and the process rode up with it.
	const layout = () =>
		page.evaluate(() => {
			const scroller = document.querySelector<HTMLElement>(".page-scroll")!
			const process = document.querySelector<HTMLElement>(".recipe-process")!
			return {
				scrollHeight: scroller.scrollHeight,
				processTop: Math.round(process.getBoundingClientRect().top + scroller.scrollTop),
			}
		})

	const before = await layout()
	await page.locator(".recipe-mobile-dock button").click()
	await expect(page.locator(".recipe-ingredient-drawer")).toHaveAttribute("open")
	await page.waitForTimeout(500)
	expect(await layout()).toEqual(before)
})

test("crossing 1x in the drawer's scale popover keeps it open and the header state", async ({
	page,
	isMobile,
}) => {
	test.skip(!isMobile, "mobile drawer only")

	await page.goto("/recetas/cheesecake-new-york/")
	await scrollToProcedure(page)
	// Two steps so the header island sees a scroll after it hydrates and records the
	// offset in `onMount`, whatever the hydration timing was. The second one has to
	// land well past the process heading, so the scaled-amounts notice appears above
	// the reader — that is the block whose height used to move `scrollTop`.
	await page.evaluate(() => {
		const scroller = document.querySelector<HTMLElement>(".page-scroll")
		scroller!.scrollTop = 400
	})
	await page.waitForTimeout(1200)
	await page.evaluate(() => {
		const scroller = document.querySelector<HTMLElement>(".page-scroll")
		scroller!.scrollTop = 1600
	})
	const header = page.locator(".header-container")
	await expect(header).toHaveClass(/is-title/)

	await page.locator(".recipe-mobile-dock button").click()
	const chip = page.locator(".recipe-drawer-header .recipe-scale-chip")
	await chip.click()
	const popover = page.locator(".recipe-ingredient-drawer .recipe-scale-popover")
	await expect(popover.locator("input[type=number]")).toBeVisible()

	// The notice is off-screen above the reader here, which is when browser scroll
	// anchoring used to compensate for its height by moving `scrollTop`: that scroll
	// event closed this popover and dropped the header title.
	const scrollTop = () => page.evaluate(() => Math.round(document.querySelector<HTMLElement>(".page-scroll")!.scrollTop))
	const startTop = await scrollTop()
	const plus = popover.locator(".recipe-scale-stepper button").nth(1)
	const minus = popover.locator(".recipe-scale-stepper button").nth(0)

	for (const [button, label] of [
		[plus, "1,1×"],
		[minus, "1×"],
		[plus, "1,1×"],
		[minus, "1×"],
	] as const) {
		await button.click()
		await expect(chip).toContainText(label)
		await expect(popover.locator("input[type=number]")).toBeVisible()
		expect(await scrollTop()).toBe(startTop)
		await expect(header).toHaveClass(/is-title/)
	}
})
