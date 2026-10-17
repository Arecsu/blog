import { defineHastPlugin, defineMdastPlugin } from "satteri"
import { stripEmojiSyntax } from "../lib/emoji.ts"

export const emojiSyntax = defineMdastPlugin({
	name: "emoji-syntax",
	text(node, context) {
		const value = stripEmojiSyntax(node.value)
		if (value !== node.value) context.setProperty(node, "value", value)
	},
})

// Open external links in a new tab, matching the old rehype-external-links setup.
export const externalLinks = defineHastPlugin({
	name: "external-links",
	element: {
		filter: ["a"],
		visit(node, context) {
			const href = node.properties.href
			if (typeof href !== "string" || !/^https?:\/\//.test(href)) return
			context.setProperty(node, "target", "_blank")
			context.setProperty(node, "rel", ["nofollow", "noopener"])
		},
	},
})
