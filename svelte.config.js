import { vitePreprocess } from "@astrojs/svelte"

export default {
	extensions: [".svelte"],
	preprocess: vitePreprocess({
		style: {
			css: {
				preprocessorOptions: {
					scss: {
						additionalData: `@use "/src/styles/mixins" as *; @use "/src/styles/vars" as *;`,
					},
				},
			},
		},
	}),
}
