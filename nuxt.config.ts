// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxtjs/sitemap', '@vueuse/nuxt'],

  css: [
    '@fontsource-variable/inter/index.css',
    '@fontsource-variable/fraunces/index.css',
    '~/assets/css/main.css',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      // Suffisé par le template : les pages ne déclarent plus la marque dans leur titre.
      title: 'Les Éditions du Djembé d’Ébène',
      titleTemplate: '%s — Les Éditions du Djembé d’Ébène',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        // meta : les méta HTML ne peuvent pas utiliser var() — littéral = --paper
        { name: 'theme-color', content: '#FAF7F2' },
        { name: 'format-detection', content: 'telephone=no' },
        // Repli global : chaque page surcharge sa propre description via useSeoMeta/useHead.
        {
          name: 'description',
          content: 'Maison d’édition indépendante à Québec : romans, essais, mémoires de recherche, Cahiers du Djembé et vidéos culturelles.',
        },
        // Replis Open Graph (les pages de détail surchargent og:title/og:image…).
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Les Éditions du Djembé d’Ébène' },
        { property: 'og:locale', content: 'fr_FR' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        // Vrai favicon (logo des Éditions — comme le legacy) : PNG en priorité,
        // ICO (générée depuis le même logo) en repli navigateur.
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/logo.png' },
        // Covers et API appelées côté client : ouvrir la connexion avant le 1er fetch.
        { rel: 'preconnect', href: 'https://api.leseditionsdudjembe.com', crossorigin: '' },
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

  // La base du site est portée par nuxt-site-config (configKey `site`) :
  // c'est elle qui alimente le sitemap et les URLs canoniques.
  site: {
    url: 'https://leseditionsdudjembe.com',
  },

  sitemap: {
    // Routes dynamiques (livres, articles, mémoires, vidéos, Cahiers) : les
    // pages statiques sortent des routes Nuxt, le catalogue vient de l'API.
    // Timeout 15s : en prod chaque appel part vers api.leseditionsdudjembe.com
    // (timeout interne du module : 5s par défaut pour les sources internes).
    sources: [['/api/__sitemap__/urls', { timeout: 15_000 }]],
  },

  image: {
    // Comparaison faite sur le host:port des sources → `localhost` seul ne
    // matcherait pas `http://localhost:8000/...` et le proxy IPX serait contourné.
    domains: ['localhost:8000', 'localhost', 'leseditionsdudjembe.com', 'api.leseditionsdudjembe.com'],
    // Les covers viennent du backend (fichiers locaux ou URL absolues).
    provider: 'ipx',
    // Qualité par défaut de $img (NuxtImg lit `quality` puis retombe dessus).
    quality: 75,
    // WebP pour les couvertures : le provider ipx ne lit que `modifiers.format`,
    // d'où la forme `modifiers` (un `format` de premier niveau serait ignoré).
    presets: {
      cover: { modifiers: { format: 'webp' } },
    },
  },

  nitro: {},
})
