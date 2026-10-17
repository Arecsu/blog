import emojiRegex from "emoji-regex"

// Content authors mark emoji with `:🍕:` (colour) or `;🍕;` (flat). The renderer
// no longer fetches per-emoji SVGs: a subset Fluent Emoji Colour font paints every
// emoji. Keeping the delimiters in the source makes them easy to spot and keeps the
// old content valid; this removes just the delimiters, leaving the glyph.
const emojiPattern = emojiRegex().source
// emoji-regex v11 is built from surrogate pairs and is not `u`-flag compatible.
const delimitedEmoji = new RegExp(`[:;](${emojiPattern})[:;]`, "g")

export function stripEmojiSyntax(value: string) {
	return value.replace(delimitedEmoji, "$1")
}
