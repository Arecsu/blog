// https://v3.nuxtjs.org/api/configuration/nuxt.config

const monthCacheControl = 2592000

export default defineNuxtConfig({
   modules: [
      '@vueuse/nuxt',
      '@nuxt/content',
      'nuxt-icon',
   ],
   // HTML content will NOT prerender if ssr: false.
   // That means, every markdown file and pretty much anything else. 
   // https://nuxt.com/docs/getting-started/deployment#static-hosting.
   ssr: true,
   css: [
      "@/assets/css/inter.css",
      "@fontsource/fira-mono",   
      "@fontsource/noto-serif/400.css",
      // "@fontsource/noto-serif/400-italic.css",
      // "@fontsource/noto-serif/700.css",
      // "@fontsource/noto-serif/700-italic.css",
      // global styles
      "@/assets/css/reset.css",
      "@/assets/css/styles.scss",
      // "@/assets/css/tippy.scss",
   ],
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
            hostname: 'wsl.local'
         }
      }
   },
   typescript: {
      shim: false,
   },
   app: {
      pageTransition: { name: 'page', mode: 'out-in' },
      head: { 
         link: [
            { rel: 'icon', href: "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 fill=%22none%22 viewBox=%220 0 32 32%22%3E%3Cpath fill=%22%23F3C07B%22 d=%22M15.35 2.143c.32-.19.71-.19 1.02 0l10.92 6.64c.26.16.42.45.42.75L15.86 17.5 4 9.632v-.1c0-.3.16-.59.42-.74l10.93-6.65Z%22/%3E%3Cpath fill=%22%23FFCE7C%22 d=%22m15.856 16.246 11.36-6.9a.328.328 0 0 1 .496.282v12.34a1.733 1.733 0 0 1-.83 1.48l-10.64 6.46a.272.272 0 0 1-.087.03.268.268 0 0 1-.083.011.895.895 0 0 1-.682-.083h.006L13 19l2.856-2.754Z%22/%3E%3Cpath fill=%22%23E19747%22 d=%22M15.86 29.622v-13.37l-11.35-6.9a.331.331 0 0 0-.51.28v12.34c0 .61.32 1.17.83 1.48l10.57 6.42a.3.3 0 0 0 .46-.25Z%22/%3E%3Cpath fill=%22%23D3D3D3%22 d=%22M14.5 26.782v-1.96c0-.23-.12-.44-.31-.56l-2.8-1.69c-.19-.11-.43.02-.43.24v1.96c0 .23.12.44.31.56l2.8 1.69c.19.11.43-.02.43-.24Z%22/%3E%3Cpath fill=%22%238C5543%22 d=%22M11.76 16.552v-4.56l-3.28-.22v3.16c0 .1.05.2.14.26l2.68 1.63c.2.11.46-.03.46-.27Z%22/%3E%3Cpath fill=%22%23A56953%22 d=%22m20.34 4.563-11.86 7.21 3.28 2 11.86-7.2-3.28-2.01Z%22/%3E%3C/svg%3E", 
            type: 'image/svg+xml' }
         ] 
      }   
   },
    

   /* not sure if any of this works, 
   Cloudflare CDN seems to give aprox 3 days of cache (decent) to every file anyways.
   It makes a small request to their server for each assets just to validate a hash.
   Github pages gives cache-control=600 (10 minutes) to everything. Zzzz.
   
        nitro: {
      routeRules: {
         "/assets/**": { swr: monthCacheControl },
         "/_nuxt/*.woff2": { swr: monthCacheControl } 
      },
   },
   */
})

