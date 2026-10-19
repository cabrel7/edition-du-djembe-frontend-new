<script setup lang="ts">
definePageMeta({ hero: 'light' })

import type { Book, Article, Memoir, Video } from '~/types/api'

const route = useRoute()

const q = ref(String(route.query.q ?? ''))

const { data: boot } = await useAsyncData('search-boot', () => $fetch<any>(apiUrl('/data/null')), {
  server: true,
  getCachedData: () => undefined,
})

interface Hit {
  kind: 'Livre' | 'Article' | 'Mémoire' | 'Vidéo'
  to: string
  title: string
  meta: string
}

const hits = computed<Hit[]>(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return []
  const out: Hit[] = []
  const books: Book[] = boot.value?.books ?? []
  const articles: Article[] = boot.value?.articles ?? []
  const memoirs: Memoir[] = boot.value?.memoirs ?? []
  const videos: Video[] = boot.value?.video ?? []

  for (const b of books) {
    if ([b.title, b.author, b.isbn ?? ''].some(f => f?.toLowerCase().includes(needle))) {
      out.push({ kind: 'Livre', to: `/livres/${b.slug || b.id}`, title: b.title, meta: b.author })
    }
  }
  for (const a of articles) {
    if ([a.title, a.excerpt ?? '', a.author ?? ''].some(f => f?.toLowerCase().includes(needle))) {
      out.push({ kind: 'Article', to: `/actualites/${a.slug || a.id}`, title: a.title, meta: a.author ?? '' })
    }
  }
  for (const m of memoirs) {
    if ([m.title, m.author, m.university ?? '', m.abstract ?? '', (m.keywords ?? []).join(' ')].some(f => f?.toLowerCase().includes(needle))) {
      out.push({ kind: 'Mémoire', to: `/memoires/${m.slug || m.id}`, title: m.title, meta: m.author })
    }
  }
  for (const v of videos) {
    if ([v.title, v.description ?? ''].some(f => f?.toLowerCase().includes(needle))) {
      out.push({ kind: 'Vidéo', to: `/videos/${v.slug || v.id}`, title: v.title, meta: '' })
    }
  }
  return out
})

watch(q, (val) => {
  const query = { ...route.query }
  if (val.trim()) query.q = val.trim()
  else delete query.q
  navigateTo({ path: '/recherche', query }, { replace: true, immediate: false })
})

usePageSeo({
  title: 'Recherche',
  description: 'Cherchez un livre, un article, un mémoire ou une vidéo dans le catalogue des Éditions du Djembé d’Ébène : par titre, auteur ou mot-clé, en un instant.',
  keywords: 'recherche catalogue, livres, articles, mémoires, vidéos',
})
</script>

<template>
  <main>
    <PageHero
      eyebrow="Recherche"
      title="Rechercher"
      lead="Trouvez un livre, un article, un mémoire ou une vidéo dans notre catalogue."
    />

    <section class="section">
      <div class="container-narrow">
        <div class="search-bar">
          <input
            v-model="q" type="search" placeholder="Titre, auteur, mot-clé…"
            class="search-bar__input" aria-label="Rechercher"
            autofocus
          >
        </div>

        <p v-if="q.trim() && hits.length" class="search-count">
          {{ hits.length }} résultat{{ hits.length > 1 ? 's' : '' }} pour « {{ q.trim() }} »
        </p>

        <div v-if="q.trim() && !hits.length" class="state-box">
          <p>Aucun résultat pour « {{ q.trim() }} ».</p>
        </div>

        <div v-if="hits.length" class="search-results" style="margin-top:1.25rem">
          <NuxtLink v-for="h in hits" :key="`${h.kind}-${h.to}`" :to="h.to" class="search-hit">
            <span class="search-hit__kind">{{ h.kind }}</span>
            <span class="search-hit__title">{{ h.title }}</span>
            <span v-if="h.meta" class="search-hit__meta">{{ h.meta }}</span>
          </NuxtLink>
        </div>

        <div v-if="!q.trim()" class="state-box">
          <p>Saisissez un mot-clé pour lancer la recherche dans le catalogue.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.search-bar { display: flex; }
.search-bar__input {
  width: 100%;
  min-height: 52px;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--paper);
  font: inherit;
  font-size: 1.05rem;
}
.search-bar__input:focus { outline: 2px solid var(--focus-ring); outline-offset: 2px; border-color: transparent; }
.search-count { margin-top: 1.25rem; font-size: 0.9rem; color: var(--muted); }
</style>
