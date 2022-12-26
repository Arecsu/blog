// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
   modules: [
      '@nuxt/content'
   ],
   css: [
      "@/assets/fonts/inter/inter.css",
      "@fontsource/fira-mono",
      "@fontsource/noto-serif-display",
      "@fontsource/noto-serif",
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

