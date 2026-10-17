// Runs inline in <head>, before first paint, so a reader who hid the inline
// amounts never sees them flash in and reflow the process text. The recipe
// island reads the same preference after hydration and keeps the attribute and
// the store in sync. Absence of the attribute means visible.
try {
	if (localStorage.getItem("recipe-show-amounts") === "false") {
		document.documentElement.dataset.recipeAmounts = "hidden"
	}
} catch {
	// Storage blocked: default to visible.
}
