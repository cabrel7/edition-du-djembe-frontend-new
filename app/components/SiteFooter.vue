<script setup lang="ts">
const year = new Date().getFullYear()

const navigation = [
  { to: '/', label: 'Accueil' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/memoires', label: 'Mémoires' },
  { to: '/actualites', label: 'Actualités' },
  { to: '/videos', label: 'Vidéos' },
  { to: '/cahiers-du-djembe', label: 'Les Cahiers du Djembé' },
  { to: '/recherche', label: 'Recherche' },
  { to: '/soumettre-mon-travail', label: 'Soumettre un manuscrit' },
  { to: '/contact', label: 'Contact' },
]
const services = [
  { to: '/services#edition', label: 'Publication' },
  { to: '/services#correction', label: 'Correction' },
  { to: '/services#impression', label: 'Impression' },
  { to: '/services#universitaire', label: 'Édition universitaire' },
  { to: '/services#traduction', label: 'Traduction' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <NuxtLink to="/" class="site-logo" style="color: var(--paper)">
            <img src="/logo.png" alt="" width="48" height="48" loading="lazy" decoding="async">
            <span>Les Éditions<br>du Djembé d’Ébène</span>
          </NuxtLink>
          <p class="site-footer__tagline">
            Votre partenaire de confiance pour la publication et la diffusion
            de vos œuvres littéraires et travaux de recherche.
          </p>
        </div>

        <div>
          <h4>Navigation</h4>
          <ul>
            <li v-for="l in navigation" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            <li v-for="l in services" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>12263 boulevard Saint Claude</li>
            <li>Québec, Canada</li>
            <li><a href="tel:+15819288585">+1 (581) 928 85 85</a></li>
            <li><a href="mailto:contacteditiondudjembe@gmail.com">contacteditiondudjembe@gmail.com</a></li>
          </ul>
        </div>
      </div>

      <div class="site-footer__bottom">
        <span>© {{ year }} Les Éditions du Djembé d’Ébène. Tous droits réservés.</span>
        <span>Québec · Canada</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer__tagline {
  margin-top: 1rem;
  max-width: 34ch;
  font-size: var(--step-0);
  line-height: 1.6;
  color: var(--on-dark-2);
}
</style>
