// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxtjs/sitemap', '@vueuse/nuxt'],

  css: [
    '@fontsource-variable/inter/index.css',
    '~/assets/css/main.css',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#fdfaf4' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
    // Pas de pageTransition : en mode out-in, main reste en opacity:0 tant que
    // les frames CSS ne progressent pas → pages invisibles après navigation client.
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://leseditionsdudjembe.com',
      // API Laravel — surcharge : NUXT_PUBLIC_API_BASE
      apiBase: 'http://localhost:8000/api',
    },
  },

  sitemap: {
    url: 'https://leseditionsdudjembe.com',
  },

  image: {
    domains: ['localhost', 'leseditionsdudjembe.com', 'api.leseditionsdudjembe.com'],
    // Les covers viennent du backend (fichiers locaux ou URL absolues).
    provider: 'ipx',
  },

  nitro: {},
})
