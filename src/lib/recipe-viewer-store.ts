import { atom, computed } from "nanostores"
import {
	stepRecipeScale,
	validRecipeScale,
	type RecipeIngredientGroup,
} from "./recipe.ts"

export interface RecipeViewerData {
	id: string
	title: string
	groups: RecipeIngredientGroup[]
	inlineAmounts: boolean
}

export interface RecipeSection {
	id: string
	label: string
}

// One recipe is on screen at a time; the islands on that page share these atoms.
// `pageToken` changes on every rendered recipe route (including ClientRouter
// navigations), so a new page resets the scale even when the slug is the same.
export const pageToken = atom<string>("")
export const recipe = atom<RecipeViewerData | null>(null)
export const scale = atom(1)
export const showAmounts = atom(true)
export const drawerOpen = atom(false)
export const drawerScope = atom<"current" | "all">("current")
export const currentSection = atom<RecipeSection>({ id: "", label: "" })
export const scaled = computed(scale, (value) => Math.abs(value - 1) > 0.000001)

// The page's build-time token is stable, so returning to the same recipe after a
// ClientRouter navigation would look like the same page. A fresh token per route
// swap makes both islands on the new page share one instance and reset the scale.
let navigationToken = ""
if (typeof document !== "undefined") {
	document.addEventListener("astro:before-swap", () => {
		navigationToken = crypto.randomUUID()
	})
}

export function recipeDomId(id: string) {
	return `recipe-ingredients-${id}`
}

export function initRecipeViewer(data: RecipeViewerData, token: string) {
	const instanceToken = navigationToken || token
	if (pageToken.get() === instanceToken) {
		if (!recipe.get()) recipe.set(data)
		return
	}
	pageToken.set(instanceToken)
	recipe.set(data)
	scale.set(1)
	drawerOpen.set(false)
	drawerScope.set("current")
	currentSection.set({ id: "", label: "" })
	if (typeof localStorage !== "undefined") {
		setAmountsPreference(localStorage.getItem("recipe-show-amounts") !== "false")
	} else {
		setAmountsPreference(true)
	}
}

export function setScale(value: number) {
	if (validRecipeScale(value)) scale.set(value)
}

export function stepScale(direction: number) {
	setScale(stepRecipeScale(scale.get(), direction))
}

function setAmountsPreference(value: boolean) {
	showAmounts.set(value)
	if (typeof document !== "undefined") {
		if (value) delete document.documentElement.dataset.recipeAmounts
		else document.documentElement.dataset.recipeAmounts = "hidden"
	}
}

export function persistShowAmounts(value: boolean) {
	setAmountsPreference(value)
	try {
		localStorage.setItem("recipe-show-amounts", String(value))
	} catch {
		// Storage can be blocked; the preference just will not persist.
	}
}
