// The anchor name tying a RecipePopover to the button that opens it (see RecipePopover.vue).
export function recipePopoverAnchor(id: string) {
  return `--${id}`
}

// The one RecipePopover open right now: opening another closes it, as the browser does
// for its own (auto) popovers.
export const openRecipePopover: { current?: { hide: () => void } } = {}
