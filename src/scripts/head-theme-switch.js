// Runs inline in <head>, before first paint, so the saved theme is applied
// without a flash of the other palette. Kept dependency-free on purpose.
const systemColor = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

let savedThemeSetting
try {
	savedThemeSetting = localStorage.getItem("theme-setting")
} catch {
	// Storage can be blocked; fall back to the system preference.
}

const colorScheme =
	savedThemeSetting === "system" || !savedThemeSetting ? systemColor : savedThemeSetting

let metaThemeColor = document.querySelector('meta[name="theme-color"]')
if (!metaThemeColor) {
	metaThemeColor = document.createElement("meta")
	metaThemeColor.name = "theme-color"
	document.head.appendChild(metaThemeColor)
}
metaThemeColor.setAttribute("content", colorScheme === "dark" ? "#0e141b" : "#fbeec0")

document.documentElement.setAttribute("theme", colorScheme)
