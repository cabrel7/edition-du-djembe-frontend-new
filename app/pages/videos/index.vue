<script setup lang="ts">
definePageMeta({ hero: 'light' })

import type { Video } from '~/types/api'

const config = useRuntimeConfig()

const { data, status } = await useAsyncData<{ video: Video[] }>(
  'listing-videos',
  () => $fetch(apiUrl('/data/video')),
  { server: true },
)

const videos = computed(() => data.value?.video ?? [])

const { query, filtered, visible, hasMore, loadMore, reset } = useListPage(
  videos,
  v => [v.title, v.description ?? ''],
)

const thumbs = ref(new Map<number, string | null>())
function thumbOf(v: Video) {
  if (thumbs.value.has(v.id)) return thumbs.value.get(v.id)
  const u = coverUrl('video', v.thumbnail, config.public.apiBase)
  thumbs.value.set(v.id, u)
  return u
}
function markBroken(id: number) {
  thumbs.value.set(id, null)
}

useHead({ title: 'Vidéos' })
</script>

<template>
  <main>
    <PageHero
      eyebrow="Vidéos"
      title="La culture en mouvement"
      lead="Entretiens, lectures et documentaires — les voix de la maison à l’image."
    />

    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Regards & rencontres</p>
          <h2 class="h2">Nos vidéos</h2>
        </div>

        <div class="toolbar">
          <input
            v-model="query" type="search" placeholder="Rechercher une vidéo…"
            class="toolbar__input" aria-label="Rechercher une vidéo"
          >
          <span class="toolbar__count">{{ filtered.length }} vidéo{{ filtered.length > 1 ? 's' : '' }}</span>
        </div>

        <div v-if="status === 'pending'" class="videos-grid" aria-busy="true">
          <div v-for="i in 3" :key="i" class="video-card">
            <div class="skeleton" style="aspect-ratio:16/9;border-radius:10px" />
            <div class="skeleton" style="height:1.1rem;width:70%" />
          </div>
        </div>

        <div v-else-if="!filtered.length" class="state-box">
          <p>Aucune vidéo trouvée.</p>
          <button class="btn btn-ghost on-light" type="button" @click="reset()">Réinitialiser</button>
        </div>

        <template v-else>
          <div class="videos-grid">
            <NuxtLink
              v-for="v in visible" :key="v.id"
              :to="`/videos/${v.slug || v.id}`" class="video-card"
            >
              <div class="video-card__media">
                <NuxtImg
                  v-if="thumbOf(v)" :src="thumbOf(v)!" :alt="v.title"
                  preset="cover" width="640" height="360" :sizes="VIDEO_SIZES"
                  loading="lazy" decoding="async" @error="markBroken(v.id)"
                />
                <div v-else class="video-card__fallback" aria-hidden="true" />
                <span class="video-card__play"><AppIcon name="play" :size="22" /></span>
              </div>
              <h3 class="video-card__title">{{ v.title }}</h3>
            </NuxtLink>
          </div>
          <div v-if="hasMore" class="section-foot" style="justify-content:center">
            <button class="btn btn-dark" type="button" @click="loadMore()">Charger plus</button>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>
.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-bottom: clamp(1.5rem, 2vw, 2.5rem); }
.toolbar__input { flex: 1; min-width: 220px; min-height: 48px; padding: 0.7rem 1.2rem; border: 1px solid var(--line); border-radius: 999px; background: var(--paper); font: inherit; font-size: 0.95rem; }
.toolbar__input:focus { outline: 2px solid var(--focus-ring); outline-offset: 2px; border-color: transparent; }
.toolbar__count { font-size: 0.88rem; color: var(--muted); white-space: nowrap; }
</style>
