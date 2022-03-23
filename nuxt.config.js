export default {
   // Target: https://go.nuxtjs.dev/config-target

   // ssr: false,
   target: 'static',
   router: {
      base: '/',
   },

   // Global page headers: https://go.nuxtjs.dev/config-head
   head: {
      title: '_a9r',
      htmlAttrs: {
         lang: 'en',
      },
      meta: [
         { charset: 'utf-8' },
         { name: 'viewport', content: 'width=device-width, initial-scale=1' },
         { hid: 'description', name: 'description', content: '' },
         { name: 'format-detection', content: 'telephone=no' },
         // {
         // name: 'apple-mobile-web-app-status-bar-style',
         // content: '',
         // },
         // { name: 'theme-color', content: '' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],

      script: [
         {
            src: '/js/theme-script.js',
         },
      ],
   },

   // Global CSS: https://go.nuxtjs.dev/config-css
   css: [
      '~/assets/css/normalize.css',
      '~/assets/css/inter.css',
      '~/assets/css/inconsolata.css',
      '~/assets/css/main.sass',
      '~/assets/css/prism-theme.scss',
   ],

   // load the prism-theme from a local css file
   content: {
      markdown: {
         prism: {
            theme: false,
         },
      },
   },

   // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
   plugins: [{ src: './plugins/vClickOutside', ssr: false }],

   // Auto import components: https://go.nuxtjs.dev/config-components
   components: true,

   // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
   buildModules: ['nuxt-lazysizes'],

   // Modules: https://go.nuxtjs.dev/config-modules
   modules: ['@nuxt/content', '@nuxtjs/dayjs', '@nuxtjs/style-resources'],

   styleResources: {
      sass: ['./assets/css/_variables.sass'], // here I use only main scss with globally styles (variables, base etc)
   },

   // Build Configuration: https://go.nuxtjs.dev/config-build
   build: {},

   // modules config
   dayjs: {
      locales: ['es'],
      defaultLocale: 'es',
      plugins: ['relativeTime', 'advancedFormat'],
   },
};
