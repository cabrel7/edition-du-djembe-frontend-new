interface BootItem {
  id: number
  slug?: string | null
}

interface PressReviewItem {
  slug: string
}

interface PressReviewsResponse {
  data: {
    press_reviews: PressReviewItem[]
    pagination: { current_page: number; last_page: number }
  }
}

/**
 * Source de sitemap pour les routes dynamiques (livres, articles, mémoires,
 * vidéos, Cahiers) — @nuxtjs/sitemap ne découvre que les pages statiques
 * au runtime, un catalogue sans détails indexés reste le trou SEO majeur.
 *
 * Le JSON attendu : { urls: [...] }. Les listes sont paginées par cursor
 * côté Laravel (`{type}nexturl` = cursor encodé) — on suit la chaîne avec
 * un garde-fou pour ne jamais boucler sur une API défaillante.
 *
 * Si l'API tombe, on laisse l'erreur remonter : le module ne met pas en
 * cache un sitemap partiel vide et retentera au prochain crawl.
 */
const BOOT_LISTS = [
  { type: 'book', base: '/livres', dataKey: 'books', nextKey: 'booknexturl', moreKey: 'hasmorebook' },
  { type: 'article', base: '/actualites', dataKey: 'articles', nextKey: 'articlenexturl', moreKey: 'hasmorearticle' },
  { type: 'memoir', base: '/memoires', dataKey: 'memoirs', nextKey: 'memoirnexturl', moreKey: 'hasmorememoir' },
  { type: 'video', base: '/videos', dataKey: 'video', nextKey: 'videonextUrl', moreKey: 'hasmorevideo' },
] as const

const MAX_PAGES_PER_LIST = 50
const PRESS_REVIEWS_PER_PAGE = 100

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')

  const urls: string[] = []

  for (const list of BOOT_LISTS) {
    let cursor: string | null = null

    for (let page = 0; page < MAX_PAGES_PER_LIST; page++) {
      const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
      const response = await $fetch<Record<string, unknown>>(`${apiBase}/data/${list.type}${query}`)

      const items = response[list.dataKey]
      if (!Array.isArray(items)) {
        throw createError({
          statusCode: 502,
          statusMessage: 'API indisponible',
          message: `Sitemap : réponse inattendue pour la liste « ${list.type} ».`,
        })
      }

      for (const item of items as BootItem[]) {
        // Les vidéos publiées du dump prod ont un slug NULL : le front route
        // sur `slug || id`, le sitemap suit la même règle.
        const segment = item.slug || item.id
        urls.push(`${siteUrl}${list.base}/${segment}`)
      }

      const hasMore = response[list.moreKey] === true
      const next = response[list.nextKey]
      cursor = typeof next === 'string' && next.length > 0 ? next : null

      if (!hasMore || cursor === null) break
      if (page === MAX_PAGES_PER_LIST - 1) {
        console.warn(`[sitemap] liste « ${list.type} » tronquée à ${MAX_PAGES_PER_LIST} pages`)
      }
    }
  }

  let pressPage = 1
  let pressLastPage = 1

  do {
    const response = await $fetch<PressReviewsResponse>(
      `${apiBase}/press-reviews`,
      { query: { per_page: PRESS_REVIEWS_PER_PAGE, page: pressPage } },
    )
    const reviews = response.data?.press_reviews
    if (!Array.isArray(reviews)) {
      throw createError({
        statusCode: 502,
        statusMessage: 'API indisponible',
        message: 'Sitemap : réponse inattendue pour les Cahiers du Djembé.',
      })
    }

    for (const review of reviews) {
      urls.push(`${siteUrl}/cahiers-du-djembe/${review.slug}`)
    }

    pressLastPage = response.data?.pagination?.last_page ?? 1
    pressPage += 1
  } while (pressPage <= pressLastPage && pressPage <= MAX_PAGES_PER_LIST)

  return { urls }
})
