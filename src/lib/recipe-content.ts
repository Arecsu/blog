import { stripEmojiSyntax } from "./emoji.ts"
import type { RecipeIngredientGroup } from "./recipe.ts"

// The old emoji plugin stripped `;🍫;` / `:🍫:` markers while reading content.
// The font renders the glyph directly now, so remove the markers once on the
// server and hand clean labels/notes to the islands. Keeping emoji-regex out of
// the client bundle is deliberate.
export function sanitizeRecipeGroups(groups: RecipeIngredientGroup[]): RecipeIngredientGroup[] {
	return groups.map((group) => ({
		...group,
		label: group.label ? stripEmojiSyntax(group.label) : undefined,
		note: group.note ? stripEmojiSyntax(group.note) : undefined,
		items: group.items.map((item) => ({
			...item,
			label: stripEmojiSyntax(item.label),
			note: item.note ? stripEmojiSyntax(item.note) : undefined,
			allocations: item.allocations?.map((allocation) => ({
				...allocation,
				label: stripEmojiSyntax(allocation.label),
			})),
		})),
	}))
}
