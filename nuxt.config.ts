// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
   modules: [
      '@nuxt/content'
   ],
   css: [
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
      "@/assets/css/reset.css",
      "@/assets/css/styles.css"
   ],
   content: {
      markdown: {
         anchorLinks: false
      },
      // https://content.nuxtjs.org/api/configuration
      watch: {
         ws: {
            hostname: 'localhost'
         }
      }
   },
   typescript: {
      shim: false,
   },
   vite: {
      server: {
         watch: {
            usePolling: true
         }
      }
   },
   app: {
      pageTransition: { name: 'page', mode: 'out-in' }
   },

})

