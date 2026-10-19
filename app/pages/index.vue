<script setup lang="ts">
import type { Book, BootData, Memoir, PressReview, Video } from '~/types/api'

const config = useRuntimeConfig()

const { data: boot, status: bootStatus, error: bootError, refresh: refreshBoot } = await useAsyncData<BootData>(
  'boot',
  () => $fetch(apiUrl('/data/null')),
  { server: true },
)

const { data: press, status: pressStatus } = await useAsyncData<{ data?: { press_reviews?: PressReview[] } }>(
  'press-home',
  () => $fetch(apiUrl('/press-reviews'), { query: { per_page: 3 } }),
  { server: true },
)

const featuredBook = computed<Book | null>(() => boot.value?.books?.[0] ?? null)
const books = computed<Book[]>(() => boot.value?.books?.slice(1, 5) ?? [])
const memoirs = computed<Memoir[]>(() => boot.value?.memoirs?.slice(0, 4) ?? [])

// /data/null n'expose pas `cover` (colonne hors liste publique côté API) ;
// /getbasedata livre les 3 derniers mémoires avec leur couverture → pont par id.
const { data: coverBoot } = await useAsyncData<{ lastmemoirs?: { id: number; cover: string | null }[] }>(
  'memoir-covers',
  () => $fetch(apiUrl('/getbasedata')),
  { server: true },
)
const brokenCovers = ref(new Set<number>())
const bridgeCovers = computed(() => {
  const map = new Map<number, string>()
  for (const item of coverBoot.value?.lastmemoirs ?? []) {
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
const videos = computed<Video[]>(() => boot.value?.video?.slice(0, 6) ?? [])
const categories = computed(() => boot.value?.categories ?? [])
const pressReviews = computed<PressReview[]>(() => press.value?.data?.press_reviews?.slice(0, 3) ?? [])

const brokenThumbs = ref(new Set<number>())
function markThumbBroken(id: number) {
  brokenThumbs.value.add(id)
}

// Origin passée explicitement : `featuredCover` est lu par useSeoMeta (unhead),
// hors contexte Nuxt → useRuntimeConfig() y lèverait NUXT_E1001.
const featuredCover = computed(() => coverUrl('book', featuredBook.value?.cover, config.public.apiBase))
const featuredCoverBroken = ref(false)

function pressCover(img: string | null | undefined) {
  return coverUrl('press', img, config.public.apiBase)
}

const featuredPrice = computed(() => {
  const p = featuredBook.value?.price
  return p != null && Number(p) > 0 ? `${Number(p).toFixed(2)} €` : null
})

function domainLabel(m: Memoir): string {
  const d: Record<string, string> = {
    informatique: 'Informatique',
    didactique: 'Didactique',
    philosophie: 'Philosophie',
    sociologie: 'Sociologie',
  }
  return d[String(m.domain).toLowerCase()] ?? (m.domain ? String(m.domain) : 'Recherche')
}

// Description dédiée à la home (la description globale de nuxt.config reste
// le repli des pages sans description) — cover à la une en aperçu, sinon og-default.
usePageSeo({
  title: 'Faire résonner l’invisible',
  description: 'Les Éditions du Djembé d’Ébène, maison d’édition indépendante à Québec : faire résonner les voix africaines et diasporiques, du roman au mémoire de recherche.',
  keywords: 'maison d’édition Québec, édition francophone, livres africains, mémoires de recherche, poésie engagée',
  image: featuredCover,
})
</script>

<template>
  <main>
    <!-- ============ HERO ============ -->
    <section class="hero">
      <div class="hero__media" aria-hidden="true">
        <BgVideo eager mp4="/hero-video.mp4" poster="/hero-poster.webp" />
      </div>
      <div class="hero__scrim" aria-hidden="true" />
      <div class="hero__glow" aria-hidden="true" />
      <div class="hero__layout container">
        <div class="hero__content">
          <h1 class="hero__title">
            <span class="hero__line"><span>Faire résonner</span></span>
            <span class="hero__line"><span>l’invisible</span></span>
          </h1>
          <p class="lead hero__fade hero__lead">
            Votre partenaire de confiance pour la publication et la diffusion
            de vos œuvres littéraires et travaux de recherche.
          </p>
          <div class="hero__ctas hero__fade">
            <NuxtLink to="/catalogue" class="btn btn-primary">
              Découvrir le catalogue <AppIcon name="arrow-right" />
            </NuxtLink>
            <NuxtLink to="/soumettre-mon-travail" class="btn btn-ghost">
              Soumettre un manuscrit
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          v-if="featuredBook"
          :to="`/livres/${featuredBook.slug || featuredBook.id}`"
          class="hero-plate hero__fade"
        >
          <span class="hero-plate__tag">À la une</span>
          <div class="hero-plate__cover">
            <NuxtImg
              v-if="featuredCover && !featuredCoverBroken" :src="featuredCover" :alt="`Couverture — ${featuredBook.title}`"
              preset="cover" width="400" height="600" :sizes="HOME_FEATURED_SIZES"
              loading="eager" fetchpriority="high" decoding="async"
              @error="featuredCoverBroken = true"
            />
            <div v-else class="book__placeholder" aria-hidden="true">
              <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="4" width="64" height="112" rx="3" fill="currentColor" opacity="0.12"/>
                <rect x="8" y="4" width="6" height="112" rx="1" fill="currentColor" opacity="0.2"/>
                <line x1="20" y1="28" x2="56" y2="28" stroke="currentColor" stroke-width="1.5" opacity="0.25"/>
                <circle cx="40" cy="68" r="12" stroke="currentColor" stroke-width="1.2" opacity="0.2"/>
              </svg>
            </div>
          </div>
          <div class="hero-plate__meta">
            <h2 class="hero-plate__title">{{ featuredBook.title }}</h2>
            <p class="hero-plate__author">
              {{ featuredBook.author }}
              <template v-if="featuredPrice"> · <span class="hero-plate__price">{{ featuredPrice }}</span></template>
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ============ NOUVELLES PUBLICATIONS ============ -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Nouvelles publications</p>
          <h2 class="h2">Des voix qui traversent</h2>
          <p class="lead">Les derniers titres du catalogue — romans, essais et recherches.</p>
        </div>

        <div v-if="bootStatus === 'pending'" class="books-grid" aria-busy="true">
          <div v-for="i in 4" :key="i" class="book">
            <div class="skeleton" style="aspect-ratio:2/3;border-radius:6px 14px 14px 6px" />
            <div class="skeleton" style="height:1.1rem;width:70%" />
            <div class="skeleton" style="height:0.9rem;width:45%" />
          </div>
        </div>

        <div v-else-if="bootError" class="state-box">
          <p>Impossible de charger le catalogue pour le moment.</p>
          <button class="btn btn-ghost on-light" type="button" @click="refreshBoot()">Réessayer</button>
        </div>

        <div v-else-if="!featuredBook" class="state-box">
          <p>Aucun titre publié pour l’instant — revenez bientôt.</p>
          <NuxtLink to="/soumettre-mon-travail" class="btn btn-primary">Soumettre un manuscrit</NuxtLink>
        </div>

        <template v-else>
          <div class="books-grid">
            <BookCard v-for="b in books" :key="b.id" :book="b" />
          </div>
          <div class="section-foot">
            <NuxtLink to="/catalogue" class="link-arrow">Voir tout le catalogue <AppIcon name="arrow-right" :size="16" /></NuxtLink>
          </div>
        </template>
      </div>
    </section>

    <!-- ============ COLLECTIONS — index ============ -->
    <section class="section section-warm">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Nos collections</p>
          <h2 class="h2">Un catalogue pluriel</h2>
          <p class="lead">De la fiction au document de recherche, chaque collection a son rythme et sa exigence.</p>
        </div>

        <ul v-if="categories.length" class="index-list">
          <li v-for="(c, i) in categories.slice(0, 6)" :key="c.id" class="index-list__item">
            <NuxtLink to="/catalogue" class="index-list__link">
              <span class="index-list__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="index-list__name">{{ c.name }}</span>
              <AppIcon name="arrow-right" :size="18" class="index-list__arrow" />
            </NuxtLink>
          </li>
        </ul>
        <div v-else class="state-box">
          <p>Les collections arrivent bientôt.</p>
        </div>
      </div>
    </section>

    <!-- ============ CAHIERS DU DJEMBÉ ============ -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Les Cahiers du Djembé</p>
          <h2 class="h2">La revue de presse et d’idées</h2>
          <p class="lead">Entretiens, critiques et reportages — le regard de la maison sur les scènes culturelles.</p>
        </div>

        <div v-if="pressStatus === 'pending'" class="cahiers-grid" aria-busy="true">
          <div v-for="i in 3" :key="i" class="skeleton" style="aspect-ratio:4/3;border-radius:var(--radius)" />
        </div>

        <div v-else-if="pressReviews.length" class="cahiers-grid">
          <NuxtLink
            v-for="pr in pressReviews" :key="pr.id"
            :to="`/cahiers-du-djembe/${pr.slug}`" class="cahier-card"
          >
            <div class="cahier-card__media">
              <NuxtImg
                v-if="pr.cover_image && pressCover(pr.cover_image) && !brokenThumbs.has(pr.id)"
                :src="pressCover(pr.cover_image) ?? undefined" :alt="pr.title"
                preset="cover" width="640" height="480" :sizes="GRID3_SIZES"
                loading="lazy" decoding="async"
                @error="markThumbBroken(pr.id)"
              />
              <div v-else class="cahier-card__fallback" aria-hidden="true">
                <AppIcon name="newspaper" :size="40" />
              </div>
            </div>
            <div class="cahier-card__body">
              <span class="chip chip--line">{{ pr.category }}</span>
              <h3 class="cahier-card__title">{{ pr.title }}</h3>
              <p v-if="pr.summary" class="cahier-card__summary">{{ pr.summary }}</p>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="issue-teaser">
          <span class="issue-teaser__num" aria-hidden="true">N°&nbsp;01</span>
          <p>Le prochain numéro se prépare — entretiens, critiques et reportages à paraître.</p>
        </div>

        <div class="section-foot">
          <NuxtLink to="/cahiers-du-djembe" class="link-arrow">Tous les cahiers <AppIcon name="arrow-right" :size="16" /></NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ MÉMOIRES ============ -->
    <section class="section section-paper">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Mémoires de recherche</p>
          <h2 class="h2">Le savoir en partage</h2>
          <p class="lead">Mémoires et thèses issus des universités partenaires — consultation et téléchargement.</p>
        </div>

        <div v-if="memoirs.length" class="memoirs-grid">
          <NuxtLink
            v-for="(m, i) in memoirs" :key="m.id"
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
        <div v-else class="state-box">
          <p>Aucun mémoire publié pour l’instant.</p>
        </div>

        <div class="section-foot">
          <NuxtLink to="/memoires" class="link-arrow">Tous les mémoires <AppIcon name="arrow-right" :size="16" /></NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ VIDÉOS ============ -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Vidéos</p>
          <h2 class="h2">La culture en mouvement</h2>
          <p class="lead">Entretiens, lectures et documentaires — les voix de la maison à l’image.</p>
        </div>

        <div v-if="videos.length" class="videos-grid">
          <NuxtLink
            v-for="v in videos" :key="v.id"
            :to="`/videos/${v.slug || v.id}`" class="video-card"
          >
            <div class="video-card__media">
              <NuxtImg
                v-if="v.thumbnail && coverUrl('video', v.thumbnail) && !brokenThumbs.has(v.id)"
                :src="coverUrl('video', v.thumbnail) ?? undefined" :alt="v.title"
                preset="cover" width="640" height="360" :sizes="VIDEO_SIZES"
                loading="lazy" decoding="async"
                @error="markThumbBroken(v.id)"
              />
              <div v-else class="video-card__fallback" aria-hidden="true" />
              <span class="video-card__play"><AppIcon name="play" :size="22" /></span>
            </div>
            <h3 class="video-card__title">{{ v.title }}</h3>
          </NuxtLink>
        </div>
        <div v-else class="state-box">
          <p>Aucune vidéo pour l’instant.</p>
        </div>

        <div class="section-foot">
          <NuxtLink to="/videos" class="link-arrow">Toutes les vidéos <AppIcon name="arrow-right" :size="16" /></NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ MANIFESTE ============ -->
    <section class="section section-paper">
      <div class="container manifesto">
        <div class="manifesto__text">
          <p class="eyebrow">La maison</p>
          <h2 class="h2">Chaque voix mérite d’être entendue</h2>
          <p class="lead">
            Les Éditions du Djembé publient des romans, des essais et des recherches
            dont la valeur dépasse les frontières. Nous accompagnons les auteurs de la
            première page jusqu’à la diffusion — avec la même exigence, quel que soit
            le territoire d’où ils parlent.
          </p>
          <div class="hero__ctas">
            <NuxtLink to="/a-propos" class="btn btn-dark">Notre histoire <AppIcon name="arrow-right" /></NuxtLink>
            <NuxtLink to="/soumettre-mon-travail" class="btn btn-ghost on-light">Soumettre un manuscrit</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ---------- Hero ---------- */
.hero {
  position: relative;
  /* 100svh = plein écran stable (100vh brut déborde sous la barre d'adresse mobile) */
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-block: calc(var(--header-h) + 2rem) 4rem;
  background: var(--ink-900);
  color: var(--paper);
  overflow: hidden;
}
.hero__media { position: absolute; inset: 0; }
.hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, color-mix(in srgb, var(--ink-950) 45%, transparent) 0%, color-mix(in srgb, var(--ink-950) 25%, transparent) 50%, color-mix(in srgb, var(--ink-950) 55%, transparent) 100%);
}
.hero__glow {
  position: absolute;
  inset: -20% -10% auto;
  height: 90%;
  background:
    radial-gradient(55% 60% at 70% 20%, color-mix(in srgb, var(--gold) 10%, transparent), transparent 70%),
    radial-gradient(40% 50% at 20% 60%, color-mix(in srgb, var(--green) 14%, transparent), transparent 70%);
  pointer-events: none;
}
.hero__layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.55fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}
.hero__content { display: grid; gap: 1.4rem; }
.hero__title { font-size: var(--step-5); color: var(--paper); }
.hero__line { display: block; overflow: hidden; }
.hero__line > span { display: inline-block; animation: heroUp 1.1s var(--ease) both; }
.hero__line:nth-child(2) > span { animation-delay: 0.12s; }
.hero__lead { max-width: 52ch; color: var(--paper); }
.hero__ctas { display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 0.6rem; }
.hero__fade { animation: fadeUp 1s var(--ease) 0.4s both; }

/* Plaque « à la une » */
.hero-plate {
  position: relative;
  display: grid;
  gap: 0.9rem;
  justify-items: start;
  padding: 1.4rem;
  border: 1px solid color-mix(in srgb, var(--gold) 30%, transparent);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--ink-950) 60%, transparent);
  backdrop-filter: blur(6px);
  color: var(--paper);
  transition: border-color 0.25s, transform 0.35s var(--ease);
}
.hero-plate:hover { border-color: var(--gold); transform: translateY(-4px); }
.hero-plate__tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold-300);
}
.hero-plate__cover {
  width: min(100%, 190px);
  aspect-ratio: 2 / 3;
  border-radius: 4px 10px 10px 4px;
  overflow: hidden;
  background: var(--ink-800);
  box-shadow: var(--shadow-lg);
}
.hero-plate__cover img { width: 100%; height: 100%; object-fit: cover; }
.hero-plate__cover .book__placeholder { background: linear-gradient(145deg, var(--ink-800), var(--ink-700)); color: var(--paper); }
.hero-plate__cover .book__placeholder svg { opacity: 0.25; }
.hero-plate__title { font-weight: 600; font-size: 1.1rem; line-height: 1.3; }
.hero-plate__author { font-size: 0.85rem; color: var(--on-dark-3); }
.hero-plate__price { font-weight: 600; color: var(--gold-300); }

@media (max-width: 900px) {
  .hero__layout { grid-template-columns: 1fr; }
  .hero-plate { display: none; }
}

/* ---------- Manifeste ---------- */
.manifesto { max-width: 820px; }
.manifesto__text { display: grid; gap: 1.2rem; justify-items: start; }

@keyframes heroUp {
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
</style>
