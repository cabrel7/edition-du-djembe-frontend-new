<script setup lang="ts">
import type { Article } from '~/types/api'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

const { data: article, error } = await useAsyncData<Article>(
  () => `article-${slug.value}`,
  () => $fetch(`${config.public.apiBase}/articles/${slug.value}`),
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
    <section class="article-hero">
      <div class="article-hero__glow" aria-hidden="true" />
      <div class="container-narrow" style="position:relative">
        <p class="eyebrow reveal">
          <NuxtLink to="/actualites" class="crumb">Actualités</NuxtLink>
        </p>
        <h1 class="article-hero__title reveal">{{ article?.title }}</h1>

        <div class="detail-meta reveal">
          <span v-if="article?.published_date">{{ fmtDate(article.published_date) }}</span>
          <span v-if="article?.author">{{ article.author }}</span>
          <span v-if="article?.views_count">{{ article.views_count }} vues</span>
        </div>
      </div>
    </section>

    <section class="section section-paper">
      <div class="container-narrow">
        <div v-if="image && !imageBroken" class="detail-hero-img reveal-img">
          <img :src="image" :alt="article?.title" width="1200" height="630" @error="imageBroken = true">
        </div>

        <div class="detail-prose reveal" style="margin-top:1.75rem">{{ article?.content }}</div>

        <div v-if="article?.tags?.length" class="tag-row reveal">
          <span v-for="t in article.tags" :key="t" class="tag">{{ t }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.article-hero {
  position: relative;
  padding-block: calc(var(--header-h) + clamp(2rem, 4vw, 4rem)) clamp(2rem, 3vw, 3.5rem);
  background: var(--ink-900);
  color: var(--paper);
  overflow: hidden;
}
.article-hero__glow {
  position: absolute;
  inset: -30% -10% auto;
  height: 110%;
  background:
    radial-gradient(50% 55% at 75% 15%, rgba(232, 163, 76, 0.14), transparent 70%),
    radial-gradient(40% 50% at 15% 55%, rgba(45, 106, 79, 0.18), transparent 70%);
  pointer-events: none;
}
.article-hero__title { font-size: var(--step-4); color: #fff; line-height: 1.08; margin-top: 0.75rem; }
.detail-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; margin-top: 1rem; font-size: 0.9rem; color: rgba(247, 243, 235, 0.6); }
.crumb { color: inherit; }
.crumb:hover { color: var(--gold); }
.detail-hero-img { margin-top: 1.75rem; border-radius: var(--radius); overflow: hidden; aspect-ratio: 16/9; background: var(--paper-2); }
.detail-hero-img img { width: 100%; height: 100%; object-fit: cover; }
.tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 2rem; }
.tag { padding: 0.3rem 0.75rem; border-radius: 999px; border: 1px solid var(--line); font-size: 0.8rem; color: var(--muted); }
</style>
