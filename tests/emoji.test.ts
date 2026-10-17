import { describe, expect, test } from "vitest"
import { stripEmojiSyntax } from "../src/lib/emoji.ts"

describe("emoji authoring syntax", () => {
	test("removes the delimiters and keeps the glyph", () => {
		expect(stripEmojiSyntax("Tomates triturados :🍅:")).toBe("Tomates triturados 🍅")
		expect(stripEmojiSyntax(";🥚; Huevos")).toBe("🥚 Huevos")
		expect(stripEmojiSyntax(";🍫; Cacao :🍫:")).toBe("🍫 Cacao 🍫")
		expect(stripEmojiSyntax(":🌾: Sobre la harina")).toBe("🌾 Sobre la harina")
	})

	test("leaves ordinary punctuation alone", () => {
		expect(stripEmojiSyntax("No emoji; just punctuation: here")).toBe(
			"No emoji; just punctuation: here",
		)
		expect(stripEmojiSyntax("Ratios 1:2; 3:4")).toBe("Ratios 1:2; 3:4")
	})

	test("handles several emoji on one line", () => {
		expect(stripEmojiSyntax(";🌾; harina, ;💧; agua y :🥣: bowl")).toBe(
			"🌾 harina, 💧 agua y 🥣 bowl",
		)
	})
})
