export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  router: {
    base: '/',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'a9r',
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', content: '#181a1b' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' }
    ],
    /*
    script: [
      {
        src: 'https://twemoji.maxcdn.com/v/latest/twemoji.min.js',
        crossorigin: 'anonymous'
      }
    ]
    */
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'sanitize.css',
    '@/assets/css/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  loading: {
    color: '#f4bd1a',
    height: '1px',
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/google-fonts'
  ],

  googleFonts: {
    families: {
      'Roboto+Slab': {
        wght: [100 + '..' + 900]
      },
      /*
      'Noto+Color+Emoji+Compat': {
        wght: 400
      },
      */
      /*
      'Noto+Colr+Emoji+Glyf': {
        wght: 400
      }
      */
    },
    display: 'swap',
    download: true,
    inject: true,
    overwriting: true,
  },

  layoutTransition: 'default',

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxt/image',
    '@nuxt/content'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
