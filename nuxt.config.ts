// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
   modules: [
      '@nuxtjs/color-mode',
      '@vueuse/nuxt',
      '@nuxt/content',
      'nuxt-icon',
   ],
   ssr: false,
   css: [
      // fonts. Inter is loaded in app head link at the bottom, from Cloudflare CDN
      "@fontsource/fira-mono",
      "@fontsource/noto-serif/400.css",
      "@fontsource/noto-serif/400-italic.css",
      "@fontsource/noto-serif/700.css",
      "@fontsource/noto-serif/700-italic.css",
      // global styles
      "@/assets/css/reset.css",
      "@/assets/css/styles.scss",
      // "@/assets/css/tippy.scss",
   ],
   colorMode: {
      preference: 'system',
      fallback: 'light',
      classSuffix: '',
      classPrefix: 'theme-',
      storageKey: 'nuxt-color-mode'
   },
   content: {
      markdown: {
         anchorLinks: false,
         remarkPlugins: [
            'remark-external-links' // Enables opening external links in new tab
         ],
         rehypePlugins: []
      },
      // creates a server to watch for 
      // changes in content files and refresh on change
      watch: {
         ws: {
            hostname: 'localhost'
         }
      }
   },
   typescript: {
      shim: false,
   },
   app: {
      head: {
         link: [
            { rel: 'preconnect', href: 'https://rsms.me' },
            { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
         ]
      },
      pageTransition: { name: 'page', mode: 'out-in' }
   },

})

