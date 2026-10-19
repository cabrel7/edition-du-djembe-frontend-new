<script setup lang="ts">
definePageMeta({ hero: 'light' })

import type { PressReview } from '~/types/api'

const config = useRuntimeConfig()

interface PressIndex {
  success: boolean
  data: {
    press_reviews: PressReview[]
    categories?: { value: string; label: string; count: number }[]
  }
}

const { data, status } = await useAsyncData<PressIndex>(
  'press-reviews',
  () => $fetch(apiUrl('/press-reviews')),
  { server: true },
)

const reviews = computed(() => data.value?.data?.press_reviews ?? [])
const categories = computed(() => data.value?.data?.categories ?? [])
const featured = computed(() => reviews.value[0] ?? null)

const activeCat = ref('')
const query = ref('')

function pressCover(img: string | null | undefined) {
  return coverUrl('press', img, config.public.apiBase)
}

const filtered = computed(() => {
  let list = reviews.value
  if (activeCat.value) list = list.filter(r => r.category === activeCat.value)
  const q = query.value.trim().toLowerCase()
  if (q) list = list.filter(r => [r.title, r.summary ?? '', r.author ?? ''].some(f => f.toLowerCase().includes(q)))
  return list
})

const broken = ref(new Set<number>())
function fmtDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

useHead({ title: 'Les Cahiers du Djembé' })
</script>

<template>
  <main>
    <PageHero
      eyebrow="Presse"
      title="Les Cahiers du Djembé"
      lead="Revue de presse, interviews et articles autour de la maison et de ses auteurs."
    />

    <section class="section section-dark" style="padding-top:clamp(2rem,3vw,3.5rem)">
      <div class="container">
        <div class="toolbar" style="margin-bottom:1.25rem">
          <input
            v-model="query" type="search" placeholder="Rechercher un article…"
            class="toolbar__input toolbar__input--dark" aria-label="Rechercher dans la revue de presse"
          >
          <span class="toolbar__count" style="color:var(--on-dark-3)">{{ filtered.length }} article{{ filtered.length > 1 ? 's' : '' }}</span>
        </div>

        <div v-if="categories.length" class="tabs" style="margin-bottom:clamp(1.5rem,2vw,2.5rem)">
          <button class="tab" :class="{ 'is-active': !activeCat }" type="button" @click="activeCat = ''">Tous</button>
          <button
            v-for="c in categories" :key="c.value"
            class="tab" :class="{ 'is-active': activeCat === c.value }" type="button"
            @click="activeCat = c.value"
          >
            {{ c.label }}
          </button>
        </div>

        <div v-if="status === 'pending'" class="cahiers-grid" aria-busy="true">
          <div v-for="i in 3" :key="i" class="skeleton" style="aspect-ratio:4/3;border-radius:var(--radius)" />
        </div>

        <div v-else-if="!filtered.length" class="state-box" style="color:var(--on-dark-3)">
          <p>Aucun article dans la revue de presse pour le moment.</p>
        </div>

        <div v-else class="cahiers-grid">
          <NuxtLink
            v-for="r in filtered" :key="r.id"
            :to="`/cahiers-du-djembe/${r.slug}`" class="cahier-card"
          >
            <div class="cahier-card__media">
              <NuxtImg
                v-if="r.cover_image && pressCover(r.cover_image) && !broken.has(r.id)"
                :src="pressCover(r.cover_image) ?? undefined" :alt="r.title"
                preset="cover" width="640" height="480" :sizes="GRID3_SIZES"
                loading="lazy" decoding="async" @error="broken.add(r.id)"
              />
              <div v-else class="cahier-card__fallback" aria-hidden="true">
                <AppIcon name="newspaper" :size="40" />
              </div>
            </div>
            <div class="cahier-card__body">
              <span class="chip chip--line">{{ r.category }}</span>
              <h3 class="cahier-card__title">{{ r.title }}</h3>
              <p v-if="r.summary" class="cahier-card__summary">{{ r.summary }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.toolbar__input { flex: 1; min-width: 220px; min-height: 48px; padding: 0.7rem 1.2rem; border: 1px solid var(--line); border-radius: 999px; background: var(--paper); font: inherit; font-size: 0.95rem; }
.toolbar__input--dark { background: color-mix(in srgb, var(--paper) 8%, transparent); border-color: var(--line-light); color: var(--paper); }
.toolbar__input--dark::placeholder { color: var(--on-dark-3); }
.toolbar__input:focus { outline: 2px solid var(--focus-ring); outline-offset: 2px; border-color: transparent; }
.toolbar__count { font-size: 0.88rem; color: var(--on-dark-3); white-space: nowrap; }
.tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tab { padding: 0.45rem 0.95rem; border-radius: 999px; border: 1px solid var(--line-light); background: transparent; font: inherit; font-size: 0.85rem; cursor: pointer; color: var(--on-dark-3); transition: background 0.2s, border-color 0.2s, color 0.2s; }
.tab:hover { border-color: var(--gold-300); color: var(--gold-300); }
.tab.is-active { background: var(--gold-600); border-color: var(--gold-600); color: var(--ink); }
.cahiers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.2rem, 2vw, 1.8rem); }
@media (max-width: 900px) { .cahiers-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) { .cahiers-grid { grid-template-columns: 1fr; } }
</style>
