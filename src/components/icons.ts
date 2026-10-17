// Static imports keep icon SVGs inlined at build time. Dynamic names from
// frontmatter go through this map; an unknown name fails the build instead of
// silently rendering nothing.
import Bread from "~icons/fluent-emoji/bread"
import ChocolateBar from "~icons/fluent-emoji/chocolate-bar"
import Cookie from "~icons/fluent-emoji/cookie"
import Croissant from "~icons/fluent-emoji/croissant"
import Custard from "~icons/fluent-emoji/custard"
import Pizza from "~icons/fluent-emoji/pizza"
import Popcorn from "~icons/fluent-emoji/popcorn"
import Potato from "~icons/fluent-emoji/potato"
import Shortcake from "~icons/fluent-emoji/shortcake"
import SoftIceCream from "~icons/fluent-emoji/soft-ice-cream"
import Strawberry from "~icons/fluent-emoji/strawberry"
import BowlWithSpoon from "~icons/fluent-emoji/bowl-with-spoon"
import Spoon from "~icons/fluent-emoji/spoon"
import Instagram from "~icons/bi/instagram"
import GhostFilled from "~icons/tabler/ghost-filled"
import ChevronDown from "~icons/tabler/chevron-down"
import X from "~icons/tabler/x"
import Lightbulb from "~icons/ic/outline-lightbulb"

export const recipeIcons = {
	"fluent-emoji:bread": Bread,
	"fluent-emoji:chocolate-bar": ChocolateBar,
	"fluent-emoji:cookie": Cookie,
	"fluent-emoji:croissant": Croissant,
	"fluent-emoji:custard": Custard,
	"fluent-emoji:pizza": Pizza,
	"fluent-emoji:popcorn": Popcorn,
	"fluent-emoji:potato": Potato,
	"fluent-emoji:shortcake": Shortcake,
	"fluent-emoji:soft-ice-cream": SoftIceCream,
	"fluent-emoji:strawberry": Strawberry,
	"fluent-emoji:bowl-with-spoon": BowlWithSpoon,
	"fluent-emoji:spoon": Spoon,
} as const

export type RecipeIconName = keyof typeof recipeIcons

export function recipeIcon(name?: string | null) {
	if (!name) return undefined
	const icon = recipeIcons[name as RecipeIconName]
	if (!icon) throw new Error(`Unknown recipe icon: ${name}`)
	return icon
}

export {
	Instagram,
	Spoon,
	BowlWithSpoon,
	GhostFilled,
	ChevronDown,
	X,
	Lightbulb,
}
