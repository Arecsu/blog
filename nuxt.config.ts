// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
   modules: [
      '@vueuse/nuxt',
      '@nuxt/content',
      'nuxt-icon',
   ],
   ssr: true,
   css: [
      // fonts
      "@/assets/fonts/inter/inter.css",
      "@fontsource/fira-mono",
      "@fontsource/noto-serif/400.css",
      "@fontsource/noto-serif/400-italic.css",
      "@fontsource/noto-serif/700.css",
      "@fontsource/unbounded/variable.css",
      "@fontsource/noto-serif/700-italic.css",
      "@fontsource/noto-serif-display/variable.css",
      // "@fontsource/noto-serif-display/variable-full.css",
      "@fontsource/noto-serif-display/variable-italic.css",
      // "@fontsource/noto-serif-display/variable-full-italic.css",
      // "@fontsource/noto-serif",

      // global styles
      "@/assets/css/reset.css",
      "@/assets/css/styles.scss",
      // "@/assets/css/tippy.scss",
   ],
   // routeRules: {
      // '/assets/**': { swr: 30 * 24 * 60 * 60 },
      // '/images/**': swr: 30 * 24 * 60 * 60 },
      // '/_nuxt/**': { swr: 30 * 24 * 60 * 60 },
      // '/**/*.js': swr: 30 * 24 * 60 * 60 },
      // '/**/*.css': { swr: 30 * 24 * 60 * 60 },
      // '/**/*.json': swr: 30 * 24 * 60 * 60 },
      // '/**/*.html': swr: 30 * 24 * 60 * 60 },
      // '/**/*.xml': swr: 30 * 24 * 60 * 60 },
      // '/**/*.svg': { swr: 30 * 24 * 60 * 60 },
   // },
   content: {
      markdown: {
         anchorLinks: false,
         remarkPlugins: [
            'remark-external-links' // Enables opening external links in new tab
         ],
         rehypePlugins: []
      },
      // https://content.nuxtjs.org/api/configuration
      // watch: {
      //    ws: {
      //       hostname: 'localhost'
      //    }
      // }
      watch: false
   },
   typescript: {
      shim: false,
   },
   app: {
      pageTransition: { name: 'page', mode: 'out-in' }
   },

})

