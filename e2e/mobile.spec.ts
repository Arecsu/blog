import { expect, test, type Page } from "@playwright/test"

function scrollToProcedure(page: Page, offset = 400) {
	return page.evaluate((offset) => {
		const scroller = document.querySelector<HTMLElement>(".page-scroll")
		const heading = document.querySelector("#procedimiento")
		if (!scroller || !heading) return
		scroller.scrollTop = heading.getBoundingClientRect().top + scroller.scrollTop + offset
	}, offset)
}

test("mobile ingredient drawer opens, filters and closes without duplicating the list", async ({
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
	await expect(dialog.locator(".recipe-ingredient-panel")).toHaveCount(1)
	await expect(page.locator(".recipe-ingredient-panel")).toHaveCount(1)

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
	await expect(page.locator(".ingredients .subingredients")).toBeVisible()
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
				[...document.querySelectorAll(".subingredient")].every(
					(element) => !element.hasAttribute("hidden"),
				),
			),
		)
		.toBe(true)
})
