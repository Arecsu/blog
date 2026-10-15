// Writes utils/recipe-title-metrics.json: the advance width, in em, of each character
// in the recipe title font (Noto Serif 400, the weight actually served). The page uses
// it to size every title to fit its column on the server, with no layout shift.
// Run again if the title font changes: node scripts/recipe-title-metrics.mjs
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import * as fontkit from 'fontkit'

const require = createRequire(import.meta.url)
const fontFile = subset => require.resolve(`@fontsource/noto-serif/files/noto-serif-${subset}-400-normal.woff2`)
const fonts = ['latin', 'latin-ext'].map(subset => fontkit.openSync(fontFile(subset)))

const widths = {}
// Printable ASCII plus Latin-1 and Latin Extended-A: every letter Spanish (and more) needs.
for (let code = 0x20; code <= 0x17f; code++) {
  if (code > 0x7e && code < 0xa0) continue
  const char = String.fromCodePoint(code)
  const font = fonts.find(font => font.hasGlyphForCodePoint(code))
  if (font) widths[char] = Math.round(font.glyphForCodePoint(code).advanceWidth / font.unitsPerEm * 10000) / 10000
}

const output = new URL('../utils/recipe-title-metrics.json', import.meta.url)
writeFileSync(output, JSON.stringify(widths) + '\n')
console.log(`${Object.keys(widths).length} characters → ${output.pathname}`)
