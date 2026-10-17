import { defineCollection } from "astro:content"
import { z } from "astro/zod"
import { glob } from "astro/loaders"

const allocation = z.object({
	id: z.string(),
	label: z.string(),
	quantity: z.number(),
})

const ingredient = z.object({
	id: z.string(),
	label: z.string(),
	quantity: z.number().positive().optional(),
	quantityMax: z.number().positive().optional(),
	unit: z.string().optional(),
	amount: z.string().optional(),
	note: z.string().optional(),
	whole: z.boolean().optional(),
	prepared: z.boolean().optional(),
	allocations: z.array(allocation).optional(),
})

const ingredientGroup = z.object({
	id: z.string(),
	label: z.string().optional(),
	note: z.string().optional(),
	sections: z.array(z.string()).optional(),
	items: z.array(ingredient),
})

const cover = z.object({
	file: z.string(),
	width: z.number(),
	height: z.number(),
	hide: z.boolean().optional(),
})

const recetas = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.mdx",
		base: "./src/content/recetas",
		generateId: ({ entry }) => entry.replace(/\.[^.]+$/, ""),
	}),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		alt: z.string().optional(),
		icon: z.string().optional(),
		cover: cover.optional(),
		draft: z.boolean().default(false),
		// The old <RecipeProcess process> prop only decided whether the "Proceso"
		// heading is shown; the prose still renders either way.
		process: z.boolean().default(false),
		inlineAmounts: z.boolean().default(false),
		ingredientGroups: z.array(ingredientGroup).optional(),
	}),
})

const notes = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.mdx",
		base: "./src/content/notes",
		generateId: ({ entry }) => entry.replace(/\.[^.]+$/, ""),
	}),
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		draft: z.boolean().default(false),
	}),
})

// Intros and legacy ingredient lists live outside the recipe body so the page can
// place them inside the ingredients island. They are MDX, so they keep using
// <RecipeSubingredient> and the same Markdown as the old Nuxt content.
const recipeExtras = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.mdx",
		base: "./src/content/recipe-extras",
		generateId: ({ entry }) => entry.replace(/\.[^.]+$/, ""),
	}),
	schema: z.object({
		title: z.string().optional(),
	}),
})

export const collections = { recetas, notes, recipeExtras }
