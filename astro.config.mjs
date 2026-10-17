import { defineConfig } from "astro/config"
import { fileURLToPath } from "node:url"
import path from "node:path"
import mdx from "@astrojs/mdx"
import svelte from "@astrojs/svelte"
import Icons from "unplugin-icons/vite"
import { satteri } from "@astrojs/markdown-satteri"
import { emojiSyntax, externalLinks } from "./src/config/markdown-plugins.ts"

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	site: "https://hey.malejandro.com",
	// The old Nuxt site canonicalised every route with a trailing slash. Keep that
	// contract so links, prefetch URLs and the static directory output all agree.
	trailingSlash: "always",
	// Astro 7 defaults to `compressHTML: 'jsx'`, which strips whitespace with JSX
	// rules. Keep the HTML-aware behaviour so meaningful spaces between inline
	// elements survive without explicit {" "} markers everywhere.
	compressHTML: true,
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
	markdown: {
		// Astro 7's native processor. MDX inherits these plugins too.
		processor: satteri({
			// Sätteri's SmartyPants default would rewrite the author's punctuation
			// ("..." → "…", straight quotes → curly). The Nuxt site rendered the
			// source verbatim; keep it that way.
			features: { smartPunctuation: false },
			mdastPlugins: [emojiSyntax],
			hastPlugins: [externalLinks],
		}),
	},
	integrations: [mdx(), svelte()],
	vite: {
		/*
			Emit every route's CSS in a stable, eagerly loaded bundle instead of
			per-route chunks. ClientRouter only avoids a flash of unstyled content when
			the incoming page reuses already-loaded sheets; with route chunks Safari
			applies the new CSS after the swap, which also breaks inner-scroll
			restoration (the short unstyled page clamps it).
		*/
		build: {
			cssCodeSplit: false,
		},
		resolve: {
			alias: {
				"@": path.resolve(root, "src"),
				"@components": path.resolve(root, "src/components"),
				"@layouts": path.resolve(root, "src/layouts"),
				"@styles": path.resolve(root, "src/styles"),
				"@scripts": path.resolve(root, "src/scripts"),
				"@lib": path.resolve(root, "src/lib"),
				"@config": path.resolve(root, "src/config"),
			},
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "mixins" as *; @use "vars" as *;`,
					loadPaths: [fileURLToPath(new URL("./src/styles", import.meta.url))],
				},
			},
		},
		plugins: [
			Icons({
				compiler: "svelte",
				autoInstall: true,
			}),
		],
	},
})
