<script setup lang="ts">
definePageMeta({ hero: 'light' })

import type { NamedTaxonomy } from '~/types/api'

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
  domain?: number | string | null
  has_document?: boolean
}

const { data: memoir, error } = await useAsyncData<MemoirDetail>(
  () => `memoir-${slug.value}`,
  () => $fetch(apiUrl(`/memoirs/${slug.value}`)),
  { server: true },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Mémoire introuvable', fatal: true })
}

// `domain` est un id de taxonomie — résolu via le boot (clé partagée avec l'accueil).
const { data: boot } = await useAsyncData<{ domaine?: NamedTaxonomy[] }>(
  'boot-taxonomy',
  () => $fetch(apiUrl('/data/null')),
  { server: true },
)
const domainName = computed(() => {
  const domain = memoir.value?.domain
  if (domain == null) return null
  return boot.value?.domaine?.find(d => d.id === Number(domain))?.name ?? null
})

const cover = coverUrl('memoir', memoir.value?.cover, config.public.apiBase)
const coverBroken = ref(false)
const downloadUrl = computed(() =>
  memoir.value?.has_document ? `/downloads/memoir/${memoir.value.id}` : null,
)

const siteUrl = config.public.siteUrl
const pageUrl = computed(() => `${siteUrl}/memoires/${memoir.value?.slug || slug.value}`)

useSeoMeta({
  title: () => memoir.value?.title ?? 'Mémoire',
  description: () => memoir.value?.abstract?.slice(0, 160) ?? 'Mémoire publié aux Éditions du Djembé d’Ébène.',
  ogTitle: () => memoir.value?.title,
  ogDescription: () => memoir.value?.abstract?.slice(0, 160) ?? undefined,
  ogImage: cover ?? undefined,
})

useJsonLd('ld-memoir', computed(() => {
  const m = memoir.value
  if (!m) return {}
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: m.title,
    creator: m.author,
    url: pageUrl.value,
    ...(cover ? { image: cover } : {}),
    ...(m.abstract ? { description: m.abstract } : {}),
    ...(m.year ? { datePublished: String(m.year) } : {}),
    ...(m.keywords?.length ? { keywords: m.keywords.join(', ') } : {}),
  }
}))
</script>

<template>
  <main>
    <section class="m-hero">
      <div class="m-hero__glow" aria-hidden="true" />
      <div class="container m-hero__grid">
        <div v-if="cover && !coverBroken" class="m-hero__cover">
          <img
            :src="cover" :alt="`Couverture — ${memoir?.title}`"
            width="400" height="600" loading="lazy" decoding="async"
            @error="coverBroken = true"
          >
        </div>

        <div class="m-hero__info">
          <p class="eyebrow">
            <NuxtLink to="/memoires" class="crumb">Mémoires & thèses</NuxtLink>
          </p>
          <h1 class="h1 m-hero__title">{{ memoir?.title }}</h1>
          <p class="m-hero__author">{{ memoir?.author }}</p>

          <dl class="m-meta">
            <div v-if="memoir?.university"><dt>Université</dt><dd>{{ memoir.university }}</dd></div>
            <div v-if="memoir?.supervisor"><dt>Direction</dt><dd>{{ memoir.supervisor }}</dd></div>
            <div v-if="memoir?.year"><dt>Année</dt><dd>{{ memoir.year }}</dd></div>
            <div v-if="memoir?.grade"><dt>Mention</dt><dd>{{ memoir.grade }}</dd></div>
            <div v-if="domainName"><dt>Domaine</dt><dd>{{ domainName }}</dd></div>
          </dl>

          <div v-if="memoir?.keywords?.length" class="tag-row">
            <span v-for="k in memoir.keywords" :key="k" class="tag">{{ k }}</span>
          </div>

          <div v-if="downloadUrl" class="m-hero__cta">
            <a :href="downloadUrl" class="btn btn-primary" download>
              Télécharger le mémoire <AppIcon name="download" :size="16" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section v-if="memoir?.abstract" class="section section-paper">
      <div class="container-narrow">
        <div class="section-head">
          <p class="eyebrow">Résumé</p>
          <h2 class="h2">Le travail présenté</h2>
        </div>
        <p class="detail-prose">{{ memoir.abstract }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.m-hero {
  position: relative;
  padding-block: calc(var(--header-h) + clamp(2.5rem, 5vw, 4.5rem)) clamp(2.5rem, 4vw, 5rem);
  background: linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}
.m-hero__glow {
  position: absolute;
  inset: -30% -10% auto;
  height: 110%;
  background:
    radial-gradient(50% 55% at 75% 15%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 70%),
    radial-gradient(40% 50% at 15% 55%, color-mix(in srgb, var(--green) 9%, transparent), transparent 70%);
  pointer-events: none;
}
.m-hero > .container { position: relative; }
.m-hero__grid { display: grid; grid-template-columns: minmax(180px, 280px) minmax(0, 1fr); gap: clamp(1.75rem, 5vw, 4rem); align-items: start; }
.m-hero__cover {
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: 6px 14px 14px 6px;
  overflow: hidden;
  background: var(--paper-2);
  box-shadow: var(--shadow-lg);
}
.m-hero__cover::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 12px;
  z-index: 1;
  background: linear-gradient(90deg, color-mix(in srgb, var(--black) 16%, transparent), color-mix(in srgb, var(--gold) 32%, transparent) 60%, transparent);
  pointer-events: none;
}
.m-hero__cover img { width: 100%; height: 100%; object-fit: cover; }
.m-hero__info { display: grid; gap: 1rem; padding-top: 0.5rem; }
.crumb { color: inherit; }
.crumb:hover { color: var(--gold-700); }
.m-hero__title { font-size: var(--step-3); color: var(--ink-950); line-height: 1.08; text-wrap: balance; overflow-wrap: break-word; }
.m-hero__author { font-size: 1.15rem; color: var(--muted); }
.m-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem 1.5rem;
  margin: 0.25rem 0 0;
  padding: 1.25rem 0;
  border-block: 1px solid var(--line);
}
.m-meta div { display: grid; gap: 0.25rem; min-width: 0; }
.m-meta dt { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.m-meta dd { margin: 0; font-size: 0.95rem; color: var(--ink); overflow-wrap: anywhere; }
.tag-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag { padding: 0.3rem 0.75rem; border-radius: 999px; border: 1px solid var(--line); font-size: 0.8rem; color: var(--muted); }
.m-hero__cta { display: flex; flex-wrap: wrap; gap: 0.85rem; margin-top: 0.5rem; }

@media (max-width: 760px) {
  .m-hero__grid { grid-template-columns: 1fr; }
  .m-hero__cover { width: min(62%, 230px); margin-inline: auto; }
}
</style>
