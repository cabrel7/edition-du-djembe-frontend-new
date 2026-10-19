<script setup lang="ts">
definePageMeta({ hero: 'light' })

import type { Article } from '~/types/api'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

const { data: article, error } = await useAsyncData<Article>(
  () => `article-${slug.value}`,
  () => $fetch(apiUrl(`/articles/${slug.value}`)),
  { server: true },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article introuvable', fatal: true })
}

// Résolu dans le setup — coverUrl hors getter unhead (NUXT_E1001).
const image = coverUrl('article', article.value?.image, config.public.apiBase)
const imageBroken = ref(false)

function fmtDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

useSeoMeta({
  title: () => `${article.value?.title ?? 'Actualité'} — Les Éditions du Djembé d’Ébène`,
  description: () => article.value?.excerpt?.slice(0, 160) ?? article.value?.content?.slice(0, 160) ?? undefined,
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.excerpt?.slice(0, 160) ?? undefined,
  ogImage: image ?? undefined,
})
</script>

<template>
  <main>
    <section class="a-hero">
      <div class="a-hero__glow" aria-hidden="true" />
      <div class="container-narrow a-hero__inner">
        <p class="eyebrow">
          <NuxtLink to="/actualites" class="crumb">Actualités</NuxtLink>
        </p>
        <h1 class="a-hero__title">{{ article?.title }}</h1>

        <div class="detail-meta a-hero__meta">
          <span v-if="article?.published_date">{{ fmtDate(article.published_date) }}</span>
          <span v-if="article?.author">{{ article.author }}</span>
          <span v-if="article?.views_count">{{ article.views_count }} vues</span>
        </div>
      </div>
    </section>

    <section class="section section-paper">
      <div class="container-narrow">
        <div v-if="image && !imageBroken" class="a-hero-img">
          <img
            :src="image" :alt="article?.title"
            width="1200" height="630" loading="lazy" decoding="async"
            @error="imageBroken = true"
          >
        </div>

        <div class="detail-prose a-body">{{ article?.content }}</div>

        <div v-if="article?.tags?.length" class="tag-row">
          <span v-for="t in article.tags" :key="t" class="tag">{{ t }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.a-hero {
  position: relative;
  padding-block: calc(var(--header-h) + clamp(2.5rem, 5vw, 4.5rem)) clamp(2rem, 3vw, 3rem);
  background: linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}
.a-hero__glow {
  position: absolute;
  inset: -30% -10% auto;
  height: 110%;
  background:
    radial-gradient(50% 55% at 75% 15%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 70%),
    radial-gradient(40% 50% at 15% 55%, color-mix(in srgb, var(--green) 9%, transparent), transparent 70%);
  pointer-events: none;
}
.a-hero__inner { position: relative; }
.a-hero__title { font-size: var(--step-3); color: var(--ink-950); line-height: 1.08; margin-top: 0.75rem; text-wrap: balance; overflow-wrap: break-word; }
.a-hero__meta { margin-block: 1.25rem 0; }
.crumb { color: inherit; }
.crumb:hover { color: var(--gold-700); }
.a-hero-img { border-radius: var(--radius); overflow: hidden; aspect-ratio: 16 / 9; background: var(--paper-2); box-shadow: var(--shadow); }
.a-hero-img img { width: 100%; height: 100%; object-fit: cover; }
.a-body { margin-top: 1.75rem; }
.tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 2rem; }
.tag { padding: 0.3rem 0.75rem; border-radius: 999px; border: 1px solid var(--line); font-size: 0.8rem; color: var(--muted); }
</style>
