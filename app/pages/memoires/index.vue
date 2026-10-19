<script setup lang="ts">
definePageMeta({ hero: 'light' })

import type { Memoir } from '~/types/api'

const { data, status } = await useAsyncData<{ memoirs: Memoir[] }>(
  'listing-memoirs',
  () => $fetch(apiUrl('/data/memoir')),
  { server: true },
)

const memoirs = computed(() => data.value?.memoirs ?? [])

// /data/memoir n'expose pas `cover` (colonne hors liste publique côté API) ;
// /getbasedata livre les 3 derniers mémoires avec leur couverture → pont par id.
const { data: base } = await useAsyncData<{ lastmemoirs?: { id: number; cover: string | null }[] }>(
  'memoir-covers',
  () => $fetch(apiUrl('/getbasedata')),
  { server: true },
)
const brokenCovers = ref(new Set<number>())
const bridgeCovers = computed(() => {
  const map = new Map<number, string>()
  for (const item of base.value?.lastmemoirs ?? []) {
    const url = coverUrl('memoir', item.cover)
    if (url) map.set(item.id, url)
  }
  return map
})
function memoirCover(m: Memoir): string | null {
  if (m.cover) return coverUrl('memoir', m.cover)
  return bridgeCovers.value.get(m.id) ?? null
}
function markCoverBroken(id: number) {
  brokenCovers.value.add(id)
}

const { query, filtered, visible, hasMore, loadMore, reset } = useListPage(
  memoirs,
  m => [m.title, m.author, m.university ?? '', m.abstract ?? '', (m.keywords ?? []).join(' ')],
)

function domainLabel(m: Memoir): string {
  const d: Record<string, string> = {
    informatique: 'Informatique',
    didactique: 'Didactique',
    philosophie: 'Philosophie',
    sociologie: 'Sociologie',
  }
  return d[String(m.domain).toLowerCase()] ?? (m.domain ? String(m.domain) : 'Recherche')
}

usePageSeo({
  title: 'Mémoires & thèses',
  description: 'Publiez, consultez et téléchargez mémoires et thèses universitaires : le savoir de la recherche, rendu accessible aux lecteurs, auteurs et bibliothèques.',
  keywords: 'mémoires universitaires, thèses, publications académiques, savoir universitaire, téléchargement',
})
</script>

<template>
  <main>
    <PageHero
      eyebrow="Recherche"
      title="Le savoir en partage"
      lead="Mémoires et thèses issus des universités — consultation, abstracts et téléchargement."
    />

    <section class="section section-paper">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Travaux publiés</p>
          <h2 class="h2">Mémoires & thèses</h2>
        </div>

        <div class="toolbar">
          <input
            v-model="query" type="search" placeholder="Rechercher un titre, un auteur, un mot-clé…"
            class="toolbar__input" aria-label="Rechercher un mémoire"
          >
          <span class="toolbar__count">{{ filtered.length }} travail{{ filtered.length > 1 ? 's' : '' }}</span>
        </div>

        <div v-if="status === 'pending'" class="memoirs-grid" aria-busy="true">
          <div v-for="i in 6" :key="i" class="memoir-card">
            <div class="skeleton" style="height:1.1rem;width:70%" />
            <div class="skeleton" style="height:0.9rem;width:45%" />
          </div>
        </div>

        <div v-else-if="!filtered.length" class="state-box">
          <p>Aucun mémoire trouvé.</p>
          <button class="btn btn-ghost on-light" type="button" @click="reset()">Réinitialiser</button>
        </div>

        <template v-else>
          <div class="memoirs-grid">
            <NuxtLink
              v-for="(m, i) in visible" :key="m.id"
              :to="`/memoires/${m.slug || m.id}`" class="memoir-card"
            >
              <div
                v-if="memoirCover(m) && !brokenCovers.has(m.id)"
                class="memoir-card__cover"
              >
                <NuxtImg
                  :src="memoirCover(m) ?? undefined" :alt="`Couverture — ${m.title}`"
                  preset="cover" width="480" :sizes="GRID3_SIZES"
                  loading="lazy" decoding="async" @error="markCoverBroken(m.id)"
                />
              </div>
              <div class="memoir-card__top">
                <span class="memoir-card__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="chip chip--line">{{ domainLabel(m) }}</span>
              </div>
              <div class="memoir-card__body">
                <h3 class="memoir-card__title">{{ m.title }}</h3>
                <p class="memoir-card__author">{{ m.author }}</p>
              </div>
              <div class="memoir-card__foot">
                <span v-if="m.university" class="memoir-card__uni">{{ m.university }}</span>
                <span v-if="m.year" class="memoir-card__year">{{ m.year }}</span>
              </div>
            </NuxtLink>
          </div>
          <div v-if="hasMore" class="section-foot" style="justify-content:center">
            <button class="btn btn-dark" type="button" @click="loadMore()">Charger plus</button>
          </div>
        </template>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container-narrow cta" style="text-align:center">
        <h2 class="h2">Vous avez rédigé un mémoire ?</h2>
        <p class="lead" style="margin-inline:auto;color:var(--on-dark-2)">
          Faites-le publier et sortez-le des tiroirs de la recherche.
        </p>
        <NuxtLink to="/soumettre-mon-travail" class="btn btn-primary">Soumettre <AppIcon name="arrow-right" /></NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-bottom: clamp(1.5rem, 2vw, 2.5rem); }
.toolbar__input { flex: 1; min-width: 220px; min-height: 48px; padding: 0.7rem 1.2rem; border: 1px solid var(--line); border-radius: 999px; background: var(--paper); font: inherit; font-size: 0.95rem; }
.toolbar__input:focus { outline: 2px solid var(--focus-ring); outline-offset: 2px; border-color: transparent; }
.toolbar__count { font-size: 0.88rem; color: var(--muted); white-space: nowrap; }
.cta { display: grid; gap: 1.25rem; justify-items: center; }
</style>
