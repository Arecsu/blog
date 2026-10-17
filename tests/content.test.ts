import { describe, expect, test } from "vitest"
import { readdirSync, readFileSync } from "node:fs"
import { parse } from "yaml"
import {
	resolveRecipeAmount,
	validateRecipeIngredients,
	type RecipeIngredientGroup,
} from "../src/lib/recipe.ts"

const GROUP_KEYS = new Set(["id", "label", "note", "sections", "items"])
const ITEM_KEYS = new Set([
	"id",
	"label",
	"quantity",
	"quantityMax",
	"unit",
	"amount",
	"note",
	"whole",
	"prepared",
	"allocations",
])
const recipes = new URL("../src/content/recetas/", import.meta.url)
const extras = new URL("../src/content/recipe-extras/", import.meta.url)

function frontmatter(source: string) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
	return match
		? { data: (parse(match[1]) ?? {}) as Record<string, unknown>, body: match[2] }
		: { data: {} as Record<string, unknown>, body: source }
}

const recipeFiles = readdirSync(recipes).filter((name) => name.endsWith(".mdx"))

describe("structured recipes", () => {
	test("all recipe content was migrated to MDX", () => {
		expect(recipeFiles.length).toBeGreaterThan(20)
		expect(readdirSync(recipes).filter((name) => name.endsWith(".md"))).toEqual([])
		expect(readdirSync(extras).filter((name) => name.endsWith(".md"))).toEqual([])
	})

	for (const file of recipeFiles) {
		const source = readFileSync(new URL(file, recipes), "utf8")
		const { data, body } = frontmatter(source)
		const groups = data.ingredientGroups as RecipeIngredientGroup[] | undefined
		if (!groups) continue

		test(`${file}: ingredient data is valid and complete`, () => {
			const valid = validateRecipeIngredients(groups)
			for (const group of valid) {
				expect(Object.keys(group).filter((key) => !GROUP_KEYS.has(key))).toEqual([])
				for (const item of group.items) {
					expect(Object.keys(item).filter((key) => !ITEM_KEYS.has(key))).toEqual([])
					expect(typeof item.label).toBe("string")
				}
			}
		})

		test(`${file}: inline amounts reference existing ingredients`, () => {
			const references = [...body.matchAll(/<RecipeAmount\b([^>]*)>/g)]
			if (data.inlineAmounts) expect(references.length).toBeGreaterThan(0)
			for (const [, attributes] of references) {
				const ingredient = attributes.match(/ingredient="([^"]+)"/)?.[1]
				const allocation = attributes.match(/allocation="([^"]+)"/)?.[1]
				expect(ingredient, "RecipeAmount has an ingredient").toBeTruthy()
				const resolved = resolveRecipeAmount(groups, ingredient!, allocation)
				expect(
					resolved.quantity !== undefined || resolved.ingredient.amount,
					`${ingredient} has an amount to show`,
				).toBeTruthy()
			}
		})
	}
})

describe("content syntax", () => {
	test("no Nuxt Content component syntax remains", () => {
		const all = [
			...recipeFiles.map((file) => readFileSync(new URL(file, recipes), "utf8")),
			...readdirSync(extras)
				.filter((file) => file.endsWith(".mdx"))
				.map((file) => readFileSync(new URL(file, extras), "utf8")),
		]
		for (const source of all) {
			expect(source).not.toMatch(/^:::?[A-Z]/m)
			expect(source).not.toContain(":RecipeAmount[")
		}
	})

	test("every recipe extra belongs to a recipe", () => {
		const slugs = new Set(recipeFiles.map((file) => file.replace(/\.mdx$/, "")))
		for (const file of readdirSync(extras)) {
			if (!file.endsWith(".mdx")) continue
			expect(slugs.has(file.replace(/\.mdx$/, ""))).toBe(true)
		}
	})
})
