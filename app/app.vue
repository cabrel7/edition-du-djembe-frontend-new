<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
const route = useRoute()

// Structured data global — une seule occurrence sur toutes les pages.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Les Éditions du Djembé d’Ébène',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      email: 'contacteditiondudjembe@gmail.com',
      telephone: '+15819288585',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '12263 boulevard Saint Claude',
        addressLocality: 'Québec',
        addressCountry: 'CA',
      },
    },
    {
      '@type': 'WebSite',
      name: 'Les Éditions du Djembé d’Ébène',
      url: siteUrl,
    },
  ],
}

useHead({
  script: [
    { key: 'ld-site', type: 'application/ld+json', innerHTML: JSON.stringify(structuredData) },
  ],
  // Repli global : URL absolue (les paramètres ?q= de /recherche sont
  // volontairement exclus — contenu non distinct). Les pages peuvent surcharger.
  link: [{ rel: 'canonical', href: () => `${siteUrl}${route.path}` }],
})
</script>

<template>
  <div>
    <!-- Barre de progression pendant la navigation client : les données de la
         page cible bloquent brièvement le swap — sans ce feedback, l'ancienne
         page semble « figée » alors que l'URL a déjà changé. -->
    <NuxtLoadingIndicator color="var(--gold-700)" :height="3" />
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
  </div>
</template>
