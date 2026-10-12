<script setup lang="ts">
import type { Book } from '~/types/api'

const config = useRuntimeConfig()

const { data, status } = await useAsyncData<{ books: Book[] }>(
  'catalog-books',
  () => $fetch(`${config.public.apiBase}/data/book`),
  { server: true },
)

const books = computed(() => data.value?.books ?? [])
const featured = computed(() => books.value[0] ?? null)
const rest = computed(() => books.value.slice(1))

const { query, filtered, visible, hasMore, loadMore, reset } = useListPage(
  books,
  b => [b.title, b.author, b.isbn ?? ''],
)

const featuredCover = featured.value ? coverUrl('book', featured.value.cover, config.public.apiBase) : null
const featuredBroken = ref(false)
const featuredPrice = featured.value?.price != null && Number(featured.value.price) > 0
  ? `${Number(featured.value.price).toFixed(2)} €`
  : null

const marquee = [
  'Romans & essais',
  'Poésie militante',
  'Essais de recherche',
  'Voix de la diaspora',
  'Littérature engagée',
  'Pensée critique',
]

useHead({ title: 'Catalogue — Les Éditions du Djembé d’Ébène' })
</script>

<template>
  <main>
    <PageHero
      eyebrow="Catalogue"
      title="Explorez nos"
      accent="collections"
      lead="Romans, essais et travaux de recherche — une diversité de genres et de disciplines, une même exigence éditoriale."
    />

    <div class="mq" aria-hidden="true">
      <div class="mq__track">
        <template v-for="n in 2" :key="n">
          <span v-for="m in marquee" :key="`${n}-${m}`" class="mq__item">{{ m }} <b>✦</b></span>
        </template>
      </div>
    </div>

    <!-- À la une -->
    <section v-if="featured" class="section section-paper">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">À la une</p>
          <h2 class="h2">Le titre du <em class="accent">moment</em></h2>
        </div>

        <NuxtLink :to="`/livres/${featured.slug || featured.id}`" class="featured reveal">
          <div class="featured__cover">
            <img
              v-if="featuredCover && !featuredBroken" :src="featuredCover" :alt="`Couverture — ${featured.title}`"
              width="400" height="600" @error="featuredBroken = true"
            >
            <div v-else class="book__placeholder" aria-hidden="true">
              <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="4" width="64" height="112" rx="3" fill="currentColor" opacity="0.12"/>
                <rect x="8" y="4" width="6" height="112" rx="1" fill="currentColor" opacity="0.2"/>
                <line x1="20" y1="28" x2="56" y2="28" stroke="currentColor" stroke-width="1.5" opacity="0.25"/>
                <circle cx="40" cy="68" r="12" stroke="currentColor" stroke-width="1.2" opacity="0.2"/>
              </svg>
            </div>
          </div>
          <div class="featured__body">
            <span class="chip chip--line">Nouveau</span>
            <h3 class="featured__title">{{ featured.title }}</h3>
            <p class="featured__author">{{ featured.author }}</p>
            <p v-if="featured.description" class="featured__excerpt">{{ featured.description }}</p>
            <span v-if="featuredPrice" class="featured__price">{{ featuredPrice }}</span>
            <span class="link-arrow">Découvrir <AppIcon name="arrow-right" :size="16" /></span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Grille complète -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Tous les ouvrages</p>
          <h2 class="h2">Le catalogue <em class="accent">complet</em></h2>
        </div>

        <div class="toolbar reveal">
          <input
            v-model="query" type="search" placeholder="Rechercher un titre, un auteur…"
            class="toolbar__input" aria-label="Rechercher un ouvrage"
          >
          <span class="toolbar__count">{{ filtered.length }} titre{{ filtered.length > 1 ? 's' : '' }}</span>
        </div>

        <div v-if="status === 'pending'" class="books-grid" aria-busy="true">
          <div v-for="i in 8" :key="i" class="book">
            <div class="skeleton" style="aspect-ratio:2/3;border-radius:6px 14px 14px 6px" />
            <div class="skeleton" style="height:1.1rem;width:70%" />
          </div>
        </div>

        <div v-else-if="!filtered.length" class="state-box">
          <p>Aucun ouvrage trouvé.</p>
          <button class="btn btn-ghost on-light" type="button" @click="reset()">Réinitialiser</button>
        </div>

        <template v-else>
          <div class="books-grid">
            <BookCard v-for="(b, i) in visible" :key="b.id" :book="b" :delay="i % 4" />
          </div>
          <div v-if="hasMore" class="section-foot" style="justify-content:center">
            <button class="btn btn-dark" type="button" @click="loadMore()">Charger plus</button>
          </div>
        </template>
      </div>
    </section>

    <!-- CTA -->
    <section class="section section-dark">
      <div class="container-narrow cta reveal" style="text-align:center">
        <h2 class="h2">Vous avez un manuscrit ?</h2>
        <p class="lead" style="margin-inline:auto;color:rgba(247,243,235,0.75)">
          Notre comité de lecture examine chaque proposition. Faire résonner votre voix commence ici.
        </p>
        <NuxtLink to="/soumettre-mon-travail" class="btn btn-primary">Soumettre un manuscrit <AppIcon name="arrow-right" /></NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-bottom: clamp(1.5rem, 2vw, 2.5rem); }
.toolbar__input {
  flex: 1; min-width: 220px; min-height: 48px;
  padding: 0.7rem 1.2rem; border: 1px solid var(--line); border-radius: 999px;
  background: var(--ivory); font: inherit; font-size: 0.95rem;
}
.toolbar__input:focus { outline: 2px solid var(--gold); outline-offset: 2px; border-color: transparent; }
.toolbar__count { font-size: 0.88rem; color: var(--muted); white-space: nowrap; }

.featured {
  display: grid; grid-template-columns: minmax(160px, 260px) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3.5rem); align-items: center;
  color: inherit; transition: transform 0.3s var(--ease);
}
.featured:hover { transform: translateY(-3px); }
.featured:hover .featured__title { color: var(--gold-600); }
.featured__cover {
  aspect-ratio: 2/3; border-radius: 6px 14px 14px 6px; overflow: hidden;
  background: var(--paper-2); box-shadow: var(--shadow-lg);
}
.featured__cover img { width: 100%; height: 100%; object-fit: cover; }
.featured__body { display: grid; gap: 0.7rem; justify-items: start; }
.featured__title { font-size: var(--step-3); font-weight: 700; line-height: 1.15; transition: color 0.2s; }
.featured__author { font-size: 1.1rem; color: var(--muted); }
.featured__excerpt { font-size: 0.95rem; color: var(--ink-2); line-height: 1.65; max-width: 52ch; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.featured__price { font-size: 1.4rem; color: var(--gold-600); font-weight: 700; }
.cta { display: grid; gap: 1.25rem; justify-items: center; }
@media (max-width: 760px) {
  .featured { grid-template-columns: 1fr; }
  .featured__cover { width: min(55%, 200px); margin-inline: auto; }
}
</style>
