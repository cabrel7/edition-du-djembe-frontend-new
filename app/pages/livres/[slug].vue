<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

interface BookDetail {
  id: number
  title: string
  slug: string | null
  author: string
  description: string | null
  cover: string | null
  published_date: string | null
  price: number | null
  isbn: string | null
  amazon_url: string | null
  pages: number | null
  language: string | null
  publisher: string | null
  edition: string | null
  category: string | null
  has_excerpt: boolean
}

const { data: book, error, status } = await useAsyncData<BookDetail>(
  () => `book-${slug.value}`,
  () => $fetch(`${config.public.apiBase}/books/${slug.value}`),
  { server: true },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Livre introuvable', fatal: true })
}

// Résolu dans le setup (pas dans un getter unhead : NUXT_E1001 hors contexte).
const cover = coverUrl('book', book.value?.cover, config.public.apiBase)
const coverBroken = ref(false)
const price = computed(() => {
  const p = book.value?.price
  return p != null && Number(p) > 0 ? `${Number(p).toFixed(2)} €` : null
})
const year = computed(() =>
  book.value?.published_date ? new Date(book.value.published_date).getFullYear() : null,
)

const canonical = computed(() => `/livres/${book.value?.slug || slug.value}`)

useSeoMeta({
  title: () => `${book.value?.title ?? 'Livre'} — Les Éditions du Djembé`,
  description: () => book.value?.description?.slice(0, 160) ?? 'Livre publié aux Éditions du Djembé.',
  ogTitle: () => book.value?.title,
  ogDescription: () => book.value?.description?.slice(0, 160) ?? undefined,
  ogImage: cover ?? undefined,
})
useHead({ link: [{ rel: 'canonical', href: canonical.value }] })
</script>

<template>
  <main class="page-book">
    <section class="section page-book__hero">
      <div class="container page-book__grid">
        <div class="page-book__cover reveal-img">
          <img
            v-if="cover && !coverBroken" :src="cover" :alt="`Couverture — ${book?.title}`"
            width="480" height="720" @error="coverBroken = true"
          >
          <div v-else class="page-book__cover-fallback" aria-hidden="true" />
        </div>

        <div class="page-book__info">
          <p class="eyebrow reveal">
            <NuxtLink to="/catalogue" class="crumb">Catalogue</NuxtLink>
            <template v-if="book?.category"> · {{ book.category }}</template>
          </p>
          <h1 class="h1 reveal">{{ book?.title }}</h1>
          <p class="page-book__author reveal">{{ book?.author }}</p>

          <dl class="page-book__specs reveal">
            <div v-if="year"><dt>Parution</dt><dd>{{ year }}</dd></div>
            <div v-if="book?.pages"><dt>Pages</dt><dd>{{ book.pages }}</dd></div>
            <div v-if="book?.language"><dt>Langue</dt><dd>{{ book.language }}</dd></div>
            <div v-if="book?.isbn"><dt>ISBN</dt><dd class="mono">{{ book.isbn }}</dd></div>
            <div v-if="book?.edition"><dt>Édition</dt><dd>{{ book.edition }}</dd></div>
          </dl>

          <div class="page-book__actions reveal">
            <span v-if="price" class="page-book__price">{{ price }}</span>
            <a
              v-if="book?.has_excerpt" :href="`${config.public.apiBase}/downloadbook/${book.id}`"
              class="btn btn-primary" download
            >
              Télécharger l’extrait <AppIcon name="download" :size="16" />
            </a>
            <a
              v-if="book?.amazon_url" :href="book.amazon_url" class="btn btn-ghost on-light"
              target="_blank" rel="noopener noreferrer"
            >
              Amazon <AppIcon name="external" :size="14" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section v-if="book?.description" class="section section-paper">
      <div class="container-narrow page-book__longform reveal">
        <h2 class="h3">Présentation</h2>
        <p class="prose">{{ book.description }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-book__hero { padding-top: calc(var(--header-h) + clamp(2rem, 5vw, 4rem)); }
.page-book__grid {
  display: grid;
  grid-template-columns: minmax(220px, 340px) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}
.page-book__cover {
  position: sticky;
  top: calc(var(--header-h) + 2rem);
  aspect-ratio: 2 / 3;
  border-radius: 6px 14px 14px 6px;
  overflow: hidden;
  background: var(--ink-800);
  box-shadow: var(--shadow-lg);
}
.page-book__cover img { width: 100%; height: 100%; object-fit: cover; }
.page-book__cover-fallback { width: 100%; height: 100%; background: linear-gradient(135deg, var(--ink-800), var(--ink-900)); }
.page-book__info { display: grid; gap: 1.1rem; padding-top: 0.5rem; }
.crumb { color: inherit; }
.crumb:hover { color: var(--gold); }
.page-book__author { font-size: 1.15rem; color: var(--muted); }
.page-book__specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  margin: 0.5rem 0 0;
  padding: 1.1rem 0;
  border-block: 1px solid var(--line);
}
.page-book__specs div { display: grid; gap: 0.2rem; }
.page-book__specs dt { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.page-book__specs dd { margin: 0; font-size: 0.95rem; }
.mono { font-variant-numeric: tabular-nums; }
.page-book__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
.page-book__price { font-size: 1.5rem; color: var(--gold); font-weight: 600; }
.page-book__longform { display: grid; gap: 1rem; padding-block: 0.5rem; }
.prose { white-space: pre-line; line-height: 1.7; color: var(--ink-800, #24382c); max-width: 65ch; }

@media (max-width: 760px) {
  .page-book__grid { grid-template-columns: 1fr; }
  .page-book__cover { position: static; width: min(70%, 260px); margin-inline: auto; }
}
</style>
