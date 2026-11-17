<script setup lang="ts">
import type { Partner } from '~/types/api'

const config = useRuntimeConfig()

const { data } = await useAsyncData<{ partners?: Partner[] }>(
  'partners',
  () => $fetch(apiUrl('/data/partner'), { method: 'POST' }),
  { server: true, default: () => ({}) },
)

const partners = computed<Partner[]>(() => data.value?.partners ?? [])
const broken = ref(new Set<number>())

function logo(p: Partner): string | null {
  if (broken.value.has(p.id)) return null
  return coverUrl('partner', p.image, config.public.apiBase)
}

/** N'autorise que http(s) : une valeur inattendue en base ne devient pas un lien actif. */
function safeLink(url: string | null): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null
  }
  catch {
    return null
  }
}
</script>

<template>
  <section v-if="partners.length" class="section section-warm">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow">Ils nous accompagnent</p>
        <h2 class="h2">Nos partenaires</h2>
        <p class="lead" style="margin-inline:auto">
          Des institutions et organisations qui partagent notre vision de la diffusion du savoir et de la promotion culturelle.
        </p>
      </div>
      <ul class="partner-grid">
        <li v-for="p in partners" :key="p.id">
          <component
            :is="safeLink(p.website) ? 'a' : 'div'"
            class="partner-card"
            v-bind="safeLink(p.website) ? { href: safeLink(p.website), target: '_blank', rel: 'noopener noreferrer' } : {}"
          >
            <span class="partner-card__logo">
              <img
                v-if="logo(p)" :src="logo(p)!" :alt="p.nom" loading="lazy" decoding="async"
                @error="retryImage($event, () => broken.add(p.id))"
              >
              <AppIcon v-else name="building" :size="36" />
            </span>
            <span class="partner-card__name">{{ p.nom }}</span>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.partner-grid {
  list-style: none; margin: clamp(1.5rem, 3vw, 2.5rem) 0 0; padding: 0;
  display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
}
.partner-card {
  display: grid; justify-items: center; gap: 0.85rem; height: 100%;
  padding: 1.25rem 1rem; text-align: center; color: inherit;
  background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius);
  transition: border-color 0.2s, transform 0.2s;
}
a.partner-card:hover, a.partner-card:focus-visible { border-color: var(--gold-300); transform: translateY(-2px); }
.partner-card__logo { width: 6rem; height: 6rem; display: grid; place-items: center; color: var(--green); }
.partner-card__logo img { max-width: 100%; max-height: 100%; object-fit: contain; }
.partner-card__name { font-size: 0.9rem; font-weight: 500; line-height: 1.3; }
</style>
