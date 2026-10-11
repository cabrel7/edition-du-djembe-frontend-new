<script setup lang="ts">
const year = new Date().getFullYear()

const explorer = [
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/actualites', label: 'Actualités' },
  { to: '/cahiers-du-djembe', label: 'Les Cahiers du Djembé' },
  { to: '/memoires', label: 'Mémoires' },
  { to: '/videos', label: 'Vidéos' },
]
const maison = [
  { to: '/a-propos', label: 'À propos' },
  { to: '/services', label: 'Services' },
  { to: '/soumettre-mon-travail', label: 'Soumettre un manuscrit' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <NuxtLink to="/" class="site-logo" style="color: var(--paper)">
            <img src="/logo.png" alt="" width="48" height="48">
            <span>Les Éditions<br>du Djembé</span>
          </NuxtLink>
          <p class="lead" style="font-size: var(--step-0); margin-top: 1rem; max-width: 34ch">
            Faire résonner les voix d'Afrique — publications, mémoires et cahiers
            depuis Douala.
          </p>
        </div>

        <div>
          <h4>Explorer</h4>
          <ul>
            <li v-for="l in explorer" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4>La maison</h4>
          <ul>
            <li v-for="l in maison" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>Douala, Cameroun</li>
            <li><a href="mailto:contact@leseditionsdudjembe.com">contact@leseditionsdudjembe.com</a></li>
          </ul>
        </div>
      </div>

      <div class="site-footer__bottom">
        <span>© {{ year }} Les Éditions du Djembé. Tous droits réservés.</span>
        <span>Douala · Cameroun</span>
      </div>
    </div>
  </footer>
</template>
