<script setup lang="ts">
definePageMeta({ hero: 'light' })

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

interface PressReviewDetail {
  id: number
  title: string
  slug: string
  subtitle: string | null
  summary: string | null
  content: string | null
  author: string | null
  source: string | null
  source_url: string | null
  publication_date: string | null
  cover_image: string | null
  category: string
  tags: string[] | null
  views: number | null
  published_at: string | null
  video_url: string | null
  audio_url: string | null
}

interface PressShow {
  success: boolean
  data: {
    press_review: PressReviewDetail
    suggestions: { id: number; title: string; slug: string; summary: string | null; cover_image: string | null; published_at: string | null; category: string }[]
  }
}

const { data, error } = await useAsyncData<PressShow>(
  () => `press-${slug.value}`,
  () => $fetch(apiUrl(`/press-reviews/${slug.value}`)),
  { server: true },
)

if (error.value || !data.value?.data?.press_review) {
  throw createError({ statusCode: 404, statusMessage: 'Article non trouvé', fatal: true })
}

const review = computed(() => data.value!.data.press_review)
const suggestions = computed(() => data.value?.data.suggestions ?? [])

const broken = ref(new Set<number>())
const heroCover = computed(() => pressCover(review.value.cover_image))

function pressCover(img: string | null | undefined) {
  return coverUrl('press', img, config.public.apiBase)
}

function fmtDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

useSeoMeta({
  title: () => `${review.value.title} — Les Cahiers du Djembé`,
  description: () => review.value.summary?.slice(0, 160) ?? review.value.content?.slice(0, 160) ?? undefined,
  ogTitle: () => review.value.title,
  ogDescription: () => review.value.summary?.slice(0, 160) ?? undefined,
  ogImage: () => pressCover(review.value.cover_image) ?? undefined,
})
</script>

<template>
  <main>
    <section class="p-hero">
      <div class="p-hero__glow" aria-hidden="true" />
      <div class="container-narrow p-hero__inner">
        <p class="eyebrow">
          <NuxtLink to="/cahiers-du-djembe" class="crumb">Les Cahiers du Djembé</NuxtLink>
          <template v-if="review.category"> · {{ review.category }}</template>
        </p>
        <h1 class="p-hero__title">{{ review.title }}</h1>
        <p v-if="review.subtitle" class="p-hero__subtitle">{{ review.subtitle }}</p>

        <div class="detail-meta p-hero__meta">
          <span v-if="review.author">{{ review.author }}</span>
          <span v-if="review.source">{{ review.source }}</span>
          <time v-if="review.publication_date">{{ fmtDate(review.publication_date) }}</time>
          <span v-if="review.views">{{ review.views }} vues</span>
        </div>

        <div v-if="heroCover && !broken.has(review.id)" class="p-hero__img">
          <img
            :src="heroCover" :alt="review.title"
            width="1200" height="630" loading="lazy" decoding="async"
            @error="broken.add(review.id)"
          >
        </div>
      </div>
    </section>

    <section class="section section-paper">
      <div class="container-narrow">
        <div class="detail-prose p-body">{{ review.content || review.summary }}</div>

        <div v-if="review.tags?.length" class="tag-row">
          <span v-for="t in review.tags" :key="t" class="tag">{{ t }}</span>
        </div>

        <div v-if="review.source_url" class="detail-actions">
          <a :href="review.source_url" class="btn btn-dark" target="_blank" rel="noopener noreferrer">
            Voir la source <AppIcon name="external" :size="14" />
          </a>
        </div>
      </div>
    </section>

    <section v-if="suggestions.length" class="section">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Suite</p>
          <h2 class="h2">À lire également</h2>
        </div>
        <div class="news-grid">
          <NuxtLink
            v-for="s in suggestions" :key="s.id"
            :to="`/cahiers-du-djembe/${s.slug}`" class="press-card"
          >
            <div class="press-card__media">
              <img
                v-if="s.cover_image && pressCover(s.cover_image) && !broken.has(s.id)" :src="pressCover(s.cover_image)" :alt="s.title"
                loading="lazy" decoding="async" width="640" height="360" @error="broken.add(s.id)"
              >
              <div v-else class="press-card__fallback" aria-hidden="true">
                <AppIcon name="newspaper" :size="36" />
              </div>
            </div>
            <div class="press-card__body">
              <div class="press-card__meta">
                <span class="press-card__cat">{{ s.category }}</span>
                <time v-if="s.published_at">{{ fmtDate(s.published_at) }}</time>
              </div>
              <h3 class="press-card__title">{{ s.title }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.p-hero {
  position: relative;
  padding-block: calc(var(--header-h) + clamp(2.5rem, 5vw, 4.5rem)) clamp(2rem, 3vw, 3rem);
  background: linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}
.p-hero__glow {
  position: absolute;
  inset: -30% -10% auto;
  height: 110%;
  background:
    radial-gradient(50% 55% at 75% 15%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 70%),
    radial-gradient(40% 50% at 15% 55%, color-mix(in srgb, var(--green) 9%, transparent), transparent 70%);
  pointer-events: none;
}
.p-hero__inner { position: relative; }
.p-hero__title { font-size: var(--step-3); color: var(--ink-950); line-height: 1.08; margin-top: 0.75rem; text-wrap: balance; overflow-wrap: break-word; }
.p-hero__subtitle { font-size: 1.15rem; color: var(--ink-2); margin-top: 0.75rem; }
.p-hero__meta { margin-block: 1.25rem 0; }
.crumb { color: inherit; }
.crumb:hover { color: var(--gold-700); }
.p-hero__img { margin-top: 1.5rem; border-radius: var(--radius); overflow: hidden; aspect-ratio: 16 / 9; background: var(--paper-2); box-shadow: var(--shadow); }
.p-hero__img img { width: 100%; height: 100%; object-fit: cover; }
.p-body { margin-top: 0; }
.tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 2rem; }
.tag { padding: 0.3rem 0.75rem; border-radius: 999px; border: 1px solid var(--line); font-size: 0.8rem; color: var(--muted); }
</style>
