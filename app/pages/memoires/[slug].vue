<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

interface MemoirDetail {
  id: number
  title: string
  slug: string | null
  author: string
  university: string | null
  year: number | null
  abstract: string | null
  keywords: string[] | null
  supervisor: string | null
  grade: string | null
  cover: string | null
  domain?: string | null
}

const { data: memoir, error } = await useAsyncData<MemoirDetail>(
  () => `memoir-${slug.value}`,
  () => $fetch(`${config.public.apiBase}/memoirs/${slug.value}`),
  { server: true },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Mémoire introuvable', fatal: true })
}

const cover = coverUrl('memoir', memoir.value?.cover, config.public.apiBase)
const coverBroken = ref(false)

useSeoMeta({
  title: () => `${memoir.value?.title ?? 'Mémoire'} — Les Éditions du Djembé d’Ébène`,
  description: () => memoir.value?.abstract?.slice(0, 160) ?? 'Mémoire publié aux Éditions du Djembé d’Ébène.',
  ogTitle: () => memoir.value?.title,
  ogDescription: () => memoir.value?.abstract?.slice(0, 160) ?? undefined,
  ogImage: cover ?? undefined,
})
</script>

<template>
  <main>
    <section class="detail-hero">
      <div class="detail-hero__glow" aria-hidden="true" />
      <div class="container">
        <div class="detail-grid">
          <div v-if="cover && !coverBroken" class="detail-cover reveal-img">
            <img :src="cover" :alt="`Couverture — ${memoir?.title}`" width="400" height="600" @error="coverBroken = true">
          </div>

          <div class="detail-info">
            <p class="eyebrow reveal">
              <NuxtLink to="/memoires" class="crumb">Mémoires & thèses</NuxtLink>
            </p>
            <h1 class="detail-title reveal">{{ memoir?.title }}</h1>
            <p class="detail-author reveal">{{ memoir?.author }}</p>

            <div class="detail-meta reveal">
              <span v-if="memoir?.university"><strong>Université</strong> · {{ memoir.university }}</span>
              <span v-if="memoir?.year"><strong>Année</strong> · {{ memoir.year }}</span>
              <span v-if="memoir?.supervisor"><strong>Directeur·rice</strong> · {{ memoir.supervisor }}</span>
              <span v-if="memoir?.grade"><strong>Mention</strong> · {{ memoir.grade }}</span>
            </div>

            <div v-if="memoir?.keywords?.length" class="tag-row reveal">
              <span v-for="k in memoir.keywords" :key="k" class="tag">{{ k }}</span>
            </div>

            <div class="detail-actions reveal">
              <a
                :href="`${config.public.apiBase}/downloadmemoir/${memoir?.id}`"
                class="btn btn-primary" download
              >
                Télécharger <AppIcon name="download" :size="16" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="memoir?.abstract" class="section section-paper">
      <div class="container-narrow">
        <div class="section-head reveal">
          <p class="eyebrow">Résumé</p>
          <h2 class="h2">Le travail <em class="accent">présenté</em></h2>
        </div>
        <p class="detail-prose reveal">{{ memoir.abstract }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.detail-hero {
  position: relative;
  padding-block: calc(var(--header-h) + clamp(2rem, 4vw, 4rem)) clamp(2.5rem, 4vw, 5rem);
  background: var(--ink-900);
  color: var(--paper);
  overflow: hidden;
}
.detail-hero__glow {
  position: absolute;
  inset: -30% -10% auto;
  height: 110%;
  background:
    radial-gradient(50% 55% at 75% 15%, rgba(232, 163, 76, 0.14), transparent 70%),
    radial-gradient(40% 50% at 15% 55%, rgba(45, 106, 79, 0.18), transparent 70%);
  pointer-events: none;
}
.detail-hero > .container { position: relative; }
.detail-grid { display: grid; grid-template-columns: minmax(180px, 280px) minmax(0, 1fr); gap: clamp(1.75rem, 5vw, 4rem); align-items: start; }
.detail-cover { aspect-ratio: 2/3; border-radius: 6px 14px 14px 6px; overflow: hidden; background: rgba(247, 243, 235, 0.08); box-shadow: var(--shadow-lg); }
.detail-cover img { width: 100%; height: 100%; object-fit: cover; }
.detail-info { display: grid; gap: 1rem; }
.detail-title { font-size: var(--step-4); color: #fff; line-height: 1.08; letter-spacing: -0.015em; }
.crumb { color: inherit; }
.crumb:hover { color: var(--gold); }
.detail-author { font-size: 1.15rem; color: rgba(247, 243, 235, 0.75); }
.detail-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-size: 0.9rem; color: rgba(247, 243, 235, 0.6); }
.detail-meta strong { color: rgba(247, 243, 235, 0.85); font-weight: 600; }
.tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag { padding: 0.3rem 0.75rem; border-radius: 999px; border: 1px solid var(--line-light); font-size: 0.8rem; color: rgba(247, 243, 235, 0.65); }
@media (max-width: 760px) {
  .detail-grid { grid-template-columns: 1fr; }
  .detail-cover { width: min(60%, 220px); margin-inline: auto; }
}
</style>
