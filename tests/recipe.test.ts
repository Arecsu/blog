import { describe, expect, test } from "vitest"
import titleMetrics from "../src/lib/recipe-title-metrics.json"
import {
	formatRecipeAmount,
	formatRecipeNumber,
	hasPrimaryAmount,
	MAX_RECIPE_SCALE,
	MIN_RECIPE_SCALE,
	recipePlainLabel,
	recipeSectionId,
	recipeTextParts,
	recipeTitleWidth,
	resolveRecipeAmount,
	stepRecipeScale,
	validateRecipeIngredients,
	validRecipeScale,
	type RecipeIngredientGroup,
} from "../src/lib/recipe.ts"

const splitRecipe = (): RecipeIngredientGroup[] => [
	{
		id: "masa",
		label: "Masa",
		items: [
			{
				id: "sugar",
				label: "Azúcar",
				quantity: 500,
				unit: "g",
				allocations: [
					{ id: "batter", label: "Para la masa", quantity: 300 },
					{ id: "meringue", label: "Para el merengue", quantity: 200 },
				],
			},
			{ id: "vanilla", label: "Vainilla", amount: "A ojo" },
		],
	},
]

describe("amount formatting", () => {
	test("scales amounts without rounding whole ingredients or changing units", () => {
		expect(formatRecipeAmount(200, "g", 0.75)).toBe("150g")
		expect(formatRecipeAmount(3, "", 0.5)).toBe("1 ½")
		expect(formatRecipeAmount(4, "", 1.1)).toBe("4,4")
		expect(formatRecipeAmount(1, "cucharada", 0.5)).toBe("½ cucharada")
		expect(formatRecipeAmount(undefined, "g", 2)).toBe("")
		expect(formatRecipeAmount(15, "g", 1 / 3)).toBe("5g")
	})

	test("attaches unit symbols but keeps a space before unit words", () => {
		expect(formatRecipeAmount(1000, "g")).toBe("1.000g")
		expect(formatRecipeAmount(2, "cucharadas")).toBe("2 cucharadas")
	})

	test("reads spoons as fractions with Spanish plurals, and weights as decimals", () => {
		expect(formatRecipeAmount(1.5, "cucharadita")).toBe("1 ½ cucharaditas")
		expect(formatRecipeAmount(1.25, "cucharadita")).toBe("1 ¼ cucharaditas")
		expect(formatRecipeAmount(1, "cdta", 2)).toBe("2 cdtas")
		expect(formatRecipeAmount(1, "pizca")).toBe("1 pizca")
		expect(formatRecipeAmount(1.25, "cucharadita", 1.1)).toBe("1,38 cucharaditas")
		expect(formatRecipeAmount(15, "g", 1.1)).toBe("16,5g")
		expect(formatRecipeAmount(15, "ml", 2, 20)).toBe("30-40ml")
	})

	test("uses es-AR number formatting", () => {
		expect(formatRecipeNumber(1000)).toBe("1.000")
		expect(formatRecipeNumber(1.5)).toBe("1,5")
	})
})

describe("labels and notes", () => {
	test("scales amounts written inside labels and notes", () => {
		const orange = { label: "Jugo de {} naranja", quantity: 1 }
		expect(recipeTextParts(orange.label, orange, 2).map((part) => part.value)).toEqual([
			"Jugo de ",
			"2",
			" naranja",
		])

		const salt = { label: "Sal marina, o {13 g} sal común", quantity: 10, unit: "g" }
		expect(recipeTextParts(salt.label, salt, 2).map((part) => part.value)).toEqual([
			"Sal marina, o ",
			"26g",
			" sal común",
		])
		expect(recipePlainLabel({ label: "Ralladura de {} naranja", quantity: 0.5 })).toBe(
			"Ralladura de ½ naranja",
		)
	})

	test("detects the primary amount placeholder", () => {
		expect(hasPrimaryAmount("Jugo de {} naranja")).toBe(true)
		expect(hasPrimaryAmount("Jugo de naranja")).toBe(false)
	})
})

describe("ingredient validation", () => {
	test("allows tools without amounts but not a `{}` placeholder without one", () => {
		expect(() =>
			validateRecipeIngredients([
				{ id: "g", items: [{ id: "film", label: "Papel film" }] },
			]),
		).not.toThrow()
		expect(() =>
			validateRecipeIngredients([
				{ id: "g", items: [{ id: "j", label: "Jugo de {} naranja" }] },
			]),
		).toThrow()
		expect(() =>
			validateRecipeIngredients([
				{ id: "a", items: [] },
				{ id: "b", items: [] },
			]),
		).toThrow(/group/)
		expect(() =>
			validateRecipeIngredients([
				{ id: "g", label: "G", items: [{ id: "x", label: "X", quantity: 20, quantityMax: 15 }] },
			]),
		).toThrow()
	})

	test("rejects allocations that do not add up and duplicate identifiers", () => {
		const groups = splitRecipe()
		groups[0].items[0].allocations![0].quantity = 500
		expect(() => validateRecipeIngredients(groups)).toThrow(/add up/)

		expect(() =>
			validateRecipeIngredients([...splitRecipe(), ...splitRecipe()]),
		).toThrow(/group/)

		const duplicate = splitRecipe()
		duplicate[0].items.push({ id: "sugar", label: "Otro azúcar", quantity: 20 })
		expect(() => validateRecipeIngredients(duplicate)).toThrow(/Duplicate/)

		const duplicatedPart = splitRecipe()
		duplicatedPart[0].items[0].allocations![1].id = "batter"
		expect(() => validateRecipeIngredients(duplicatedPart)).toThrow(/allocation/)
	})

	test("unknown ingredient and allocation references fail instead of guessing", () => {
		const groups = splitRecipe()
		expect(() => resolveRecipeAmount(groups, "missing")).toThrow(/Unknown recipe ingredient/)
		expect(() => resolveRecipeAmount(groups, "sugar", "missing")).toThrow(/Unknown allocation/)
	})

	test("prepared ingredients retain their authored amount, not a sum of raw ingredients", () => {
		const groups: RecipeIngredientGroup[] = [
			{
				id: "mousse",
				label: "Mousse",
				items: [
					{
						id: "reserved",
						label: "Crema de chocolate",
						quantity: 300,
						unit: "g",
						prepared: true,
					},
				],
			},
		]
		expect(formatRecipeAmount(resolveRecipeAmount(groups, "reserved").quantity, "g", 0.5)).toBe(
			"150g",
		)
	})
})

describe("scale", () => {
	test("rejects invalid, zero, negative, infinite, or out-of-range factors", () => {
		for (const value of [0, -1, Infinity, NaN, 0.099, 10.01, "2"])
			expect(validRecipeScale(value)).toBe(false)
		for (const value of [0.1, 0.75, 1, 10]) expect(validRecipeScale(value)).toBe(true)
		expect(MIN_RECIPE_SCALE).toBe(0.1)
		expect(MAX_RECIPE_SCALE).toBe(10)
	})

	test("steps by 0.1 without floating-point drift or snapping manual values", () => {
		expect(stepRecipeScale(1, -1)).toBe(0.9)
		expect(stepRecipeScale(0.3, -1)).toBe(0.2)
		expect(stepRecipeScale(0.7, 1)).toBe(0.8)
		expect(stepRecipeScale(1.1, 1)).toBe(1.2)
		expect(stepRecipeScale(0.75, 1)).toBe(0.85)
		expect(stepRecipeScale(0.75, -1)).toBe(0.65)
		expect(stepRecipeScale(0.2, -1)).toBe(0.1)
		expect(stepRecipeScale(0.1, -1)).toBe(0.1)
		expect(stepRecipeScale(9.95, 1)).toBe(10)
		expect(stepRecipeScale(10, 1)).toBe(10)
	})
})

describe("sections and titles", () => {
	test("matches accented and emoji-decorated section labels", () => {
		expect(recipeSectionId("🍫 Crema de Chocolate")).toBe("crema-de-chocolate")
		expect(recipeSectionId("Almíbar de entremets")).toBe("almibar-de-entremets")
	})

	test("recipe title width matches the browser measurement of Noto Serif", () => {
		// Chrome measures this text at 11.748em (letter-spacing -.05em); the emoji adds 1.017em.
		expect(recipeTitleWidth("Galletas de avena con chips", false, titleMetrics)).toBe(
			Math.round(11.748 * 1.01 * 1000) / 1000,
		)
		expect(recipeTitleWidth("Galletas de avena con chips", true, titleMetrics)).toBe(
			Math.round(12.765 * 1.01 * 1000) / 1000,
		)
		expect([..."¡Ñandú, crème brûlée?"].every((char) => char in titleMetrics)).toBe(true)
	})
})
