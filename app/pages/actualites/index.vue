<script setup lang="ts">
import type { Article } from '~/types/api'

const config = useRuntimeConfig()

const { data, status } = await useAsyncData<{ articles: Article[] }>(
  'news-articles',
  () => $fetch(`${config.public.apiBase}/data/article`),
  { server: true },
)

const articles = computed(() => data.value?.articles ?? [])
const featured = computed(() => articles.value[0] ?? null)
const rest = computed(() => articles.value.slice(1))

const { query, filtered, visible, hasMore, loadMore, reset } = useListPage(
  articles,
  a => [a.title, a.excerpt ?? '', a.author ?? ''],
)

const broken = ref(new Set<number>())
function fmtDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const marquee = [
  'La vie de la maison',
  'Distinctions',
  'Événements',
  'Nouveautés',
  'Auteurs & autrices',
  'Coulisses',
]

useHead({ title: 'Actualités — Les Éditions du Djembé d’Ébène' })
</script>

<template>
  <main>
    <PageHero
      eyebrow="Actualités"
      title="La vie de"
      accent="la maison"
      lead="Dernières nouvelles, événements et distinctions de nos auteurs."
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
          <h2 class="h2">L’actualité du <em class="accent">moment</em></h2>
        </div>

        <NuxtLink :to="`/actualites/${featured.slug || featured.id}`" class="featured reveal">
          <div class="featured__media">
            <img
              v-if="featured.image && !broken.has(featured.id)" :src="featured.image" :alt="featured.title"
              width="1200" height="675" @error="broken.add(featured.id)"
            >
            <div v-else class="featured__fallback" aria-hidden="true">
              <AppIcon name="newspaper" :size="48" />
            </div>
          </div>
          <div class="featured__body">
            <time v-if="featured.published_date" class="featured__date">{{ fmtDate(featured.published_date) }}</time>
            <h3 class="featured__title">{{ featured.title }}</h3>
            <p v-if="featured.excerpt" class="featured__excerpt">{{ featured.excerpt }}</p>
            <span class="link-arrow">Lire l’article <AppIcon name="arrow-right" :size="16" /></span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Liste -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Toutes les nouvelles</p>
          <h2 class="h2">Dernières <em class="accent">parutions</em></h2>
        </div>

        <div class="toolbar reveal">
          <input
            v-model="query" type="search" placeholder="Rechercher un article…"
            class="toolbar__input" aria-label="Rechercher un article"
          >
          <span class="toolbar__count">{{ filtered.length }} article{{ filtered.length > 1 ? 's' : '' }}</span>
        </div>

        <div v-if="status === 'pending'" class="news-grid" aria-busy="true">
          <div v-for="i in 6" :key="i" class="news-card">
            <div class="skeleton" style="aspect-ratio:16/9;border-radius:var(--radius)" />
            <div class="skeleton" style="height:1.1rem;width:80%" />
          </div>
        </div>

        <div v-else-if="!filtered.length" class="state-box">
          <p>Aucun article trouvé.</p>
          <button class="btn btn-ghost on-light" type="button" @click="reset()">Réinitialiser</button>
        </div>

        <template v-else>
          <div class="news-grid">
            <NuxtLink
              v-for="(a, i) in visible" :key="a.id"
              :to="`/actualites/${a.slug || a.id}`" class="news-card reveal" :style="{ '--d': `${(i % 3) * 80}ms` }"
            >
              <div class="news-card__media">
                <img
                  v-if="a.image && !broken.has(a.id)" :src="a.image" :alt="a.title"
                  loading="lazy" width="640" height="360" @error="broken.add(a.id)"
                >
                <div v-else class="news-card__fallback" aria-hidden="true">
                  <AppIcon name="newspaper" :size="36" />
                </div>
              </div>
              <div class="news-card__body">
                <time v-if="a.published_date" class="news-card__date">{{ fmtDate(a.published_date) }}</time>
                <h3 class="news-card__title">{{ a.title }}</h3>
                <p v-if="a.excerpt" class="news-card__excerpt">{{ a.excerpt }}</p>
              </div>
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
.toolbar__input { flex: 1; min-width: 220px; min-height: 48px; padding: 0.7rem 1.2rem; border: 1px solid var(--line); border-radius: 999px; background: var(--ivory); font: inherit; font-size: 0.95rem; }
.toolbar__input:focus { outline: 2px solid var(--gold); outline-offset: 2px; border-color: transparent; }
.toolbar__count { font-size: 0.88rem; color: var(--muted); white-space: nowrap; }

.featured { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: clamp(1.5rem, 4vw, 3rem); align-items: center; color: inherit; transition: transform 0.3s var(--ease); }
.featured:hover { transform: translateY(-3px); }
.featured:hover .featured__title { color: var(--gold-600); }
.featured__media { aspect-ratio: 16/9; border-radius: var(--radius); overflow: hidden; background: var(--paper-2); }
.featured__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s var(--ease); }
.featured:hover .featured__media img { transform: scale(1.03); }
.featured__fallback { display: grid; place-items: center; width: 100%; height: 100%; background: linear-gradient(135deg, var(--paper-2), var(--paper)); color: var(--muted); }
.featured__body { display: grid; gap: 0.7rem; justify-items: start; }
.featured__date { font-size: 0.82rem; color: var(--muted); }
.featured__title { font-size: var(--step-2); font-weight: 700; line-height: 1.2; transition: color 0.2s; }
.featured__excerpt { font-size: 0.95rem; color: var(--ink-2); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
@media (max-width: 860px) { .featured { grid-template-columns: 1fr; } }
</style>
