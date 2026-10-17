/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		// Set by the recipe page before the MDX body renders, so <RecipeAmount>
		// can resolve its ingredient without threading props through the content.
		recipe?: {
			groups: import("./lib/recipe.ts").RecipeIngredientGroup[]
		}
	}
}
