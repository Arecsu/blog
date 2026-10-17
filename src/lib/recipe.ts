// Quantity math is deliberately separate from prose: only authored amounts scale.
export const MIN_RECIPE_SCALE = 0.1
export const MAX_RECIPE_SCALE = 10
export const RECIPE_SCALE_STEP = 0.1

export interface RecipeAllocation {
	id: string
	label: string
	quantity: number
}

export interface RecipeIngredient {
	id: string
	label: string
	quantity?: number
	quantityMax?: number
	unit?: string
	amount?: string
	note?: string
	whole?: boolean
	prepared?: boolean
	allocations?: RecipeAllocation[]
}

export interface RecipeIngredientGroup {
	id: string
	label?: string
	note?: string
	sections?: string[]
	items: RecipeIngredient[]
}

export interface RecipeTextPart {
	type: "text" | "amount"
	value: string
	primary?: boolean
}

export interface ResolvedRecipeAmount {
	ingredient: RecipeIngredient
	group: RecipeIngredientGroup
	quantity?: number
	allocation?: RecipeAllocation
}

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 })

export function formatRecipeNumber(value: number) {
	return numberFormat.format(value)
}

// Symbols attach to the number like the hand-written recipes ("200g"); words keep a space.
const ATTACHED_UNITS = new Set(["g", "kg", "mg", "ml", "cc", "l", "cm"])
const FRACTIONS: [number, string][] = [
	[1 / 4, "¼"],
	[1 / 3, "⅓"],
	[1 / 2, "½"],
	[2 / 3, "⅔"],
	[3 / 4, "¾"],
]

// Spoons, pinches and plain counts read as fractions ("1 ½ cucharaditas"); weights and
// volumes stay decimal ("16,5g"). Values without a close fraction fall back to decimals.
function formatQuantity(value: number, fractions: boolean) {
	if (fractions) {
		const whole = Math.floor(value + 1e-9)
		const rest = value - whole
		if (rest < 0.01) return formatRecipeNumber(whole)
		const fraction = FRACTIONS.find(([part]) => Math.abs(rest - part) < 0.01)
		if (fraction) return whole ? `${whole} ${fraction[1]}` : fraction[1]
	}
	return formatRecipeNumber(value)
}

// Spanish unit words take an "s" above one ("2 cucharaditas", "1 ½ cucharadas").
function pluralUnit(unit: string, value: number) {
	return value > 1 && !/s$/i.test(unit) ? unit.replace(/^(\S+)/, "$1s") : unit
}

export function formatRecipeAmount(
	quantity?: number,
	unit = "",
	scale = 1,
	quantityMax?: number,
) {
	if (typeof quantity !== "number" || !Number.isFinite(quantity)) return ""
	const attached = ATTACHED_UNITS.has(unit.toLowerCase())
	const low = quantity * scale
	const high = typeof quantityMax === "number" ? quantityMax * scale : undefined
	const number =
		high === undefined
			? formatQuantity(low, !attached)
			: `${formatQuantity(low, !attached)}-${formatQuantity(high, !attached)}`
	if (!unit) return number
	return attached ? `${number}${unit}` : `${number} ${pluralUnit(unit, high ?? low)}`
}

// Labels and notes may hold amounts: `{}` places the item's own amount (as the chip),
// `{13 g}` or `{1.5 cucharada}` is an extra amount that scales too, `{15-20 ml}` a range.
const AMOUNT_TOKEN = /\{\s*(?:(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*([^{}]*?))?\s*\}/g

export function recipeTextParts(
	text = "",
	item: Partial<RecipeIngredient> = {},
	scale = 1,
): RecipeTextPart[] {
	const parts: RecipeTextPart[] = []
	let last = 0
	for (const match of text.matchAll(AMOUNT_TOKEN)) {
		if ((match.index ?? 0) > last) parts.push({ type: "text", value: text.slice(last, match.index) })
		const [, quantity, quantityMax, unit = ""] = match
		parts.push(
			quantity === undefined
				? {
						type: "amount",
						primary: true,
						value:
							item.quantity !== undefined
								? formatRecipeAmount(item.quantity, item.unit, scale, item.quantityMax)
								: item.amount || "",
					}
				: {
						type: "amount",
						value: formatRecipeAmount(
							Number(quantity),
							unit.trim(),
							scale,
							quantityMax ? Number(quantityMax) : undefined,
						),
					},
		)
		last = (match.index ?? 0) + match[0].length
	}
	if (last < text.length) parts.push({ type: "text", value: text.slice(last) })
	return parts
}

export function hasPrimaryAmount(text = "") {
	return /\{\s*\}/.test(text)
}

// Plain-text label (amounts filled in at the original scale), for headings and labels.
export function recipePlainLabel(item: Partial<RecipeIngredient>) {
	return recipeTextParts(item.label, item)
		.map((part) => part.value)
		.join("")
		.replace(/\s+/g, " ")
		.trim()
}

export function validRecipeScale(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value) && value >= MIN_RECIPE_SCALE && value <= MAX_RECIPE_SCALE
}

export function stepRecipeScale(value: number, direction: number) {
	// Round away binary floating-point drift without snapping manually entered factors.
	const next = Math.round((value + direction * RECIPE_SCALE_STEP) * 1e6) / 1e6
	return Math.min(MAX_RECIPE_SCALE, Math.max(MIN_RECIPE_SCALE, next))
}

export function recipeSectionId(value = "") {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
}

// Fail early rather than silently showing a wrong amount in a cooking instruction.
export function validateRecipeIngredients(groups: RecipeIngredientGroup[] = []) {
	const ids = new Set<string>()
	const groupIds = new Set<string>()
	for (const group of groups) {
		// A lone group may go unlabelled (a single plain list); several need their headings.
		if (!group.id || groupIds.has(group.id) || (!group.label && groups.length > 1) || !Array.isArray(group.items)) {
			throw new Error("Invalid recipe ingredient group")
		}
		groupIds.add(group.id)
		for (const item of group.items) {
			if (!item.id || ids.has(item.id)) throw new Error(`Duplicate or missing ingredient ID: ${item.id}`)
			ids.add(item.id)
			// Tools and "a gusto" items may have no amount; a `{}` in the label needs one to show.
			if (
				!item.label ||
				(hasPrimaryAmount(item.label) && item.quantity === undefined && !item.amount) ||
				(item.quantity !== undefined && (!Number.isFinite(item.quantity) || item.quantity <= 0)) ||
				(item.quantityMax !== undefined &&
					(item.quantity === undefined || !(item.quantityMax > item.quantity)))
			) {
				throw new Error(`Invalid recipe ingredient: ${item.id}`)
			}
			const allocations = item.allocations || []
			if (allocations.length) {
				const allocationIds = new Set<string>()
				for (const part of allocations) {
					if (!part.id || allocationIds.has(part.id) || !part.label || !Number.isFinite(part.quantity) || part.quantity <= 0) {
						throw new Error(`Invalid allocation: ${item.id}`)
					}
					allocationIds.add(part.id)
				}
				const total = allocations.reduce((sum, part) => sum + part.quantity, 0)
				if (item.quantity === undefined || Math.abs(total - item.quantity) > 0.00001) {
					throw new Error(`Allocations must add up to the total: ${item.id}`)
				}
			}
		}
	}
	return groups
}

export function resolveRecipeAmount(
	groups: RecipeIngredientGroup[],
	ingredientId: string,
	allocationId?: string,
): ResolvedRecipeAmount {
	for (const group of groups) {
		const ingredient = group.items.find((item) => item.id === ingredientId)
		if (!ingredient) continue
		const allocation = allocationId ? ingredient.allocations?.find((part) => part.id === allocationId) : undefined
		if (allocationId && !allocation) throw new Error(`Unknown allocation: ${ingredientId}/${allocationId}`)
		return { ingredient, group, quantity: allocation?.quantity ?? ingredient.quantity, allocation }
	}
	throw new Error(`Unknown recipe ingredient: ${ingredientId}`)
}

// Recipe titles are sized on the server to fit their column on one line: their width in
// em, from the font's own advance widths, becomes `100cqi / width` in CSS. Keep these in
// sync with .recipe-title and .recipe-icon-title in the recipe page.
const TITLE_LETTER_SPACING = -0.05
// The emoji icon: .9em wide, -.02em/.15em margins in its own (.9em) size.
const TITLE_ICON_WIDTH = 0.9 * (1 - 0.02 + 0.15)
// Unknown characters (none in the Latin table) count as a wide letter.
const TITLE_FALLBACK_WIDTH = 0.7

export function recipeTitleWidth(
	title: string,
	hasIcon: boolean,
	metrics: Record<string, number>,
) {
	let width = hasIcon ? TITLE_ICON_WIDTH : 0
	for (const char of title) width += (metrics[char] ?? TITLE_FALLBACK_WIDTH) + TITLE_LETTER_SPACING
	// A hair of slack for subpixel rounding, so the last word never wraps by a pixel.
	return Math.round(width * 1.01 * 1000) / 1000
}
