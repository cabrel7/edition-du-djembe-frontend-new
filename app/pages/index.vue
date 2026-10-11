<script setup lang="ts">
import type { Book, BootData, Memoir, PressReview, Video } from '~/types/api'

const config = useRuntimeConfig()

const { data: boot, status: bootStatus, error: bootError, refresh: refreshBoot } = await useAsyncData<BootData>(
  'boot',
  () => $fetch(`${config.public.apiBase}/data/null`),
  { server: true },
)

const { data: press, status: pressStatus } = await useAsyncData<{ data?: { press_reviews?: PressReview[] } }>(
  'press-home',
  () => $fetch(`${config.public.apiBase}/press-reviews`, { query: { per_page: 3 } }),
  { server: true },
)

const featuredBook = computed<Book | null>(() => boot.value?.books?.[0] ?? null)
const books = computed<Book[]>(() => boot.value?.books?.slice(1, 5) ?? [])
const memoirs = computed<Memoir[]>(() => boot.value?.memoirs?.slice(0, 4) ?? [])
const videos = computed<Video[]>(() => boot.value?.video?.slice(0, 6) ?? [])
const categories = computed(() => boot.value?.categories ?? [])
const pressReviews = computed<PressReview[]>(() => press.value?.data?.press_reviews?.slice(0, 3) ?? [])

const brokenThumbs = ref(new Set<number>())
function markThumbBroken(id: number) {
  brokenThumbs.value.add(id)
}

const featuredCover = computed(() => coverUrl('book', featuredBook.value?.cover))
const featuredPrice = computed(() => {
  const p = featuredBook.value?.price
  return p != null && Number(p) > 0 ? `${Number(p).toFixed(2)} €` : null
})

const marquee = [
  'Les Cahiers du Djembé',
  'Romans & essais',
  'Mémoires de recherche',
  'Voix contemporaines',
  'Soumission ouverte',
  'Littérature & recherche',
]

function domainLabel(m: Memoir): string {
  const d: Record<string, string> = {
    informatique: 'Informatique',
    didactique: 'Didactique',
    philosophie: 'Philosophie',
    sociologie: 'Sociologie',
  }
  return d[String(m.domain).toLowerCase()] ?? (m.domain ? String(m.domain) : 'Recherche')
}

useHead({
  title: 'Les Éditions du Djembé — Faire résonner l’invisible',
  meta: [
    {
      name: 'description',
      content: 'Maison d’édition indépendante : romans, essais, mémoires de recherche, Cahiers du Djembé et vidéos culturelles.',
    },
  ],
})
</script>

<template>
  <main>
    <!-- ============ HERO ============ -->
    <section class="hero">
      <div class="hero__media" aria-hidden="true">
        <BgVideo eager desktop-only mp4="/hero-video.mp4" />
      </div>
      <div class="hero__shade" aria-hidden="true" />
      <div class="hero__glow" aria-hidden="true" />
      <div class="hero__layout container">
        <div class="hero__content">
          <p class="eyebrow hero__fade">Maison d’édition indépendante</p>
          <h1 class="hero__title">
            <span class="hero__line"><span>Faire résonner</span></span>
            <span class="hero__line"><span class="accent">l’invisible</span></span>
          </h1>
          <p class="lead hero__fade hero__lead">
            Nous accompagnons les auteurs dans la publication et la diffusion
            de leurs œuvres — romans, essais, mémoires et cahiers de recherche.
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
            <img
              v-if="featuredCover" :src="featuredCover" :alt="`Couverture — ${featuredBook.title}`"
              width="400" height="600"
            >
          </div>
          <div class="hero-plate__meta">
            <h2 class="hero-plate__title">{{ featuredBook.title }}</h2>
            <p class="hero-plate__author">
              {{ featuredBook.author }}
              <template v-if="featuredPrice"> · <span class="accent">{{ featuredPrice }}</span></template>
            </p>
          </div>
        </NuxtLink>
      </div>
      <div class="hero__scroll hero__fade" aria-hidden="true">
        <span>Défiler</span><i />
      </div>
    </section>

    <!-- ============ BANDEAU DÉFILANT ============ -->
    <div class="mq" aria-hidden="true">
      <div class="mq__track">
        <template v-for="n in 2" :key="n">
          <span v-for="m in marquee" :key="`${n}-${m}`" class="mq__item">
            {{ m }} <AppIcon name="star" :size="12" />
          </span>
        </template>
      </div>
    </div>

    <!-- ============ NOUVELLES PUBLICATIONS ============ -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">§ 01 — Nouvelles publications</p>
          <h2 class="h2">Des voix qui <em class="accent">traversent</em></h2>
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
            <BookCard v-for="(b, i) in books" :key="b.id" :book="b" :delay="i" />
          </div>
          <div class="section-foot reveal">
            <NuxtLink to="/catalogue" class="link-arrow">Voir tout le catalogue <AppIcon name="arrow-right" :size="16" /></NuxtLink>
          </div>
        </template>
      </div>
    </section>

    <!-- ============ COLLECTIONS — index ============ -->
    <section class="section section-paper">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">§ 02 — Nos collections</p>
          <h2 class="h2">Un catalogue <em class="accent">pluriel</em></h2>
          <p class="lead">De la fiction au document de recherche, chaque collection a son rythme et sa exigence.</p>
        </div>

        <ul v-if="categories.length" class="index-list reveal">
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
      <div class="container cahiers">
        <div class="cahiers__intro reveal">
          <p class="eyebrow">§ 03 — Les Cahiers du Djembé</p>
          <h2 class="h2">La revue de presse et d’idées</h2>
          <p class="lead">Entretiens, critiques et reportages — le regard de la maison sur les scènes culturelles.</p>
          <NuxtLink to="/cahiers-du-djembe" class="link-arrow cahiers__all">
            Tous les cahiers <AppIcon name="arrow-right" :size="16" />
          </NuxtLink>
        </div>

        <div class="cahiers__body">
          <div v-if="pressStatus === 'pending'" class="press-rows" aria-busy="true">
            <div v-for="i in 3" :key="i" class="skeleton" style="height:4.5rem;border-radius:var(--radius)" />
          </div>

          <ul v-else-if="pressReviews.length" class="press-rows reveal">
            <li v-for="pr in pressReviews" :key="pr.id" class="press-rows__item">
              <NuxtLink :to="`/cahiers-du-djembe/${pr.slug}`" class="press-rows__link">
                <span class="chip">{{ pr.category }}</span>
                <h3 class="press-rows__title">{{ pr.title }}</h3>
                <p v-if="pr.summary" class="press-rows__summary">{{ pr.summary }}</p>
              </NuxtLink>
            </li>
          </ul>

          <div v-else class="issue-teaser reveal">
            <span class="issue-teaser__num" aria-hidden="true">N°&nbsp;01</span>
            <p>Le prochain numéro se prépare — entretiens, critiques et reportages à paraître.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ MÉMOIRES — bibliographie ============ -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">§ 04 — Mémoires de recherche</p>
          <h2 class="h2">Le savoir <em class="accent">en partage</em></h2>
          <p class="lead">Mémoires et thèses issus des universités partenaires — consultation et téléchargement.</p>
        </div>

        <ul v-if="memoirs.length" class="biblio reveal">
          <li v-for="(m, i) in memoirs" :key="m.id" class="biblio__item">
            <NuxtLink :to="`/memoires/${m.slug || m.id}`" class="biblio__link">
              <span class="biblio__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="biblio__body">
                <h3 class="biblio__title">{{ m.title }}</h3>
                <p class="biblio__meta">
                  {{ m.author }}
                  <template v-if="m.university"> · {{ m.university }}</template>
                  <template v-if="m.year"> · {{ m.year }}</template>
                </p>
              </span>
              <span class="chip chip--line">{{ domainLabel(m) }}</span>
            </NuxtLink>
          </li>
        </ul>
        <div v-else class="state-box">
          <p>Aucun mémoire publié pour l’instant.</p>
        </div>

        <div class="section-foot reveal">
          <NuxtLink to="/memoires" class="link-arrow">Tous les mémoires <AppIcon name="arrow-right" :size="16" /></NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ VIDÉOS ============ -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">§ 05 — Vidéos</p>
          <h2 class="h2">La culture en <em class="accent">mouvement</em></h2>
          <p class="lead">Entretiens, lectures et documentaires — les voix de la maison à l’image.</p>
        </div>

        <div v-if="videos.length" class="videos-grid">
          <NuxtLink
            v-for="(v, i) in videos" :key="v.id"
            :to="`/videos/${v.slug || v.id}`" class="video-card reveal" :style="{ '--d': `${i * 80}ms` }"
          >
            <div class="video-card__media">
              <img
                v-if="v.thumbnail && coverUrl('video', v.thumbnail) && !brokenThumbs.has(v.id)" :src="coverUrl('video', v.thumbnail)" :alt="v.title"
                loading="lazy" width="640" height="360"
                @error="markThumbBroken(v.id)"
              >
              <div v-else class="video-card__fallback" aria-hidden="true" />
              <span class="video-card__play"><AppIcon name="play" :size="22" /></span>
            </div>
            <h3 class="video-card__title">{{ v.title }}</h3>
          </NuxtLink>
        </div>
        <div v-else class="state-box">
          <p>Aucune vidéo pour l’instant.</p>
        </div>

        <div class="section-foot reveal">
          <NuxtLink to="/videos" class="link-arrow">Toutes les vidéos <AppIcon name="arrow-right" :size="16" /></NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ MANIFESTE ============ -->
    <section class="section section-paper">
      <div class="container manifesto">
        <div class="manifesto__text reveal">
          <p class="eyebrow">La maison</p>
          <h2 class="h2">Chaque voix mérite <em class="accent">d’être entendue</em></h2>
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
/* ---------- Hero : composition asymétrique ---------- */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  padding-block: calc(var(--header-h) + 3rem) 5rem;
  background: var(--ink-950);
  color: var(--paper);
  overflow: hidden;
}
.hero__media { position: absolute; inset: 0; }
.hero__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(12, 26, 18, 0.55) 0%, rgba(12, 26, 18, 0.25) 40%, rgba(12, 26, 18, 0.88) 100%),
    linear-gradient(90deg, rgba(12, 26, 18, 0.7) 0%, transparent 55%);
}
.hero__glow {
  position: absolute;
  inset: -20% -10% auto;
  height: 90%;
  background:
    radial-gradient(55% 60% at 70% 20%, rgba(232, 163, 76, 0.22), transparent 70%),
    radial-gradient(40% 50% at 20% 60%, rgba(10, 85, 40, 0.35), transparent 70%);
  pointer-events: none;
}
.hero__layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.55fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: end;
}
.hero__content { display: grid; gap: 1.4rem; }
.hero__title { font-size: var(--step-5); }
.hero__line { display: block; overflow: hidden; }
.hero__line > span { display: inline-block; animation: heroUp 1.1s var(--ease) both; }
.hero__line:nth-child(2) > span { animation-delay: 0.12s; }
.hero__lead { max-width: 52ch; }
.hero__ctas { display: flex; flex-wrap: wrap; gap: 0.9rem; margin-top: 0.6rem; }
.hero__fade { animation: fadeUp 1s var(--ease) 0.4s both; }
.hero__scroll {
  position: absolute;
  right: var(--gutter);
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245, 239, 226, 0.55);
}
.hero__scroll i { display: block; width: 1px; height: 44px; background: linear-gradient(var(--gold), transparent); }

/* Plaque « à la une » */
.hero-plate {
  position: relative;
  display: grid;
  gap: 0.9rem;
  justify-items: start;
  padding: 1.4rem;
  border: 1px solid rgba(232, 163, 76, 0.35);
  border-radius: var(--radius);
  background: rgba(12, 26, 18, 0.55);
  backdrop-filter: blur(6px);
  color: var(--paper);
  transition: border-color 0.25s, transform 0.35s var(--ease);
}
.hero-plate:hover { border-color: var(--gold); transform: translateY(-4px); }
.hero-plate__tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
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
.hero-plate__title { font-family: var(--font-display); font-size: 1.15rem; line-height: 1.25; }
.hero-plate__author { font-size: 0.85rem; color: rgba(245, 239, 226, 0.65); }

@media (max-width: 900px) {
  .hero__layout { grid-template-columns: 1fr; }
  .hero-plate { display: none; }
}

/* ---------- Index collections ---------- */
.index-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.index-list__item { border-bottom: 1px solid var(--line); }
.index-list__link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: 1.25rem;
  padding: 1.15rem 0.35rem;
  color: inherit;
  transition: background 0.2s, padding-left 0.25s var(--ease);
}
.index-list__link:hover { background: rgba(20, 32, 26, 0.04); padding-left: 0.9rem; }
.index-list__link:hover .index-list__arrow { transform: translateX(4px); color: var(--gold); }
.index-list__num { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; color: var(--gold); }
.index-list__name { font-family: var(--font-display); font-size: clamp(1.25rem, 2.6vw, 1.7rem); }
.index-list__arrow { color: var(--muted); transition: transform 0.25s var(--ease), color 0.2s; align-self: center; }

/* ---------- Cahiers : grille revue ---------- */
.cahiers { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr); gap: clamp(2rem, 5vw, 4.5rem); align-items: start; }
.cahiers__intro { display: grid; gap: 1.1rem; justify-items: start; position: sticky; top: calc(var(--header-h) + 2rem); }
.cahiers__all { margin-top: 0.75rem; }
.press-rows { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line-light); }
.press-rows__item { border-bottom: 1px solid var(--line-light); }
.press-rows__link { display: grid; gap: 0.5rem; padding: 1.35rem 0.35rem; color: inherit; transition: background 0.2s, padding-left 0.25s var(--ease); }
.press-rows__link:hover { background: rgba(245, 239, 226, 0.04); padding-left: 0.9rem; }
.press-rows__link:hover .press-rows__title { color: var(--gold); }
.press-rows__title { font-family: var(--font-display); font-size: 1.25rem; line-height: 1.3; transition: color 0.2s; }
.press-rows__summary { font-size: 0.92rem; color: rgba(245, 239, 226, 0.6); max-width: 60ch; }

.issue-teaser {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  border: 1px dashed rgba(232, 163, 76, 0.4);
  border-radius: var(--radius);
  color: rgba(245, 239, 226, 0.75);
}
.issue-teaser__num {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 2.2rem;
  color: var(--gold);
  white-space: nowrap;
}

@media (max-width: 900px) {
  .cahiers { grid-template-columns: 1fr; }
  .cahiers__intro { position: static; }
}

/* ---------- Mémoires : bibliographie ---------- */
.biblio { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.biblio__item { border-bottom: 1px solid var(--line); }
.biblio__link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.25rem;
  align-items: baseline;
  padding: 1.2rem 0.35rem;
  color: inherit;
  transition: background 0.2s, padding-left 0.25s var(--ease);
}
.biblio__link:hover { background: rgba(20, 32, 26, 0.04); padding-left: 0.9rem; }
.biblio__link:hover .biblio__title { color: var(--gold); }
.biblio__num { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; color: var(--gold); }
.biblio__title { font-family: var(--font-display); font-size: 1.15rem; line-height: 1.3; transition: color 0.2s; }
.biblio__meta { font-size: 0.85rem; color: var(--muted); margin-top: 0.3rem; }

@media (max-width: 540px) {
  .biblio__link { grid-template-columns: auto 1fr; }
  .biblio__link .chip { display: none; }
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
