export interface PageSeo {
  /** Sans suffixe : `titleTemplate` (nuxt.config) ajoute la marque. */
  title: string
  /** 140-160 caractères, unique par page. */
  description: string
  keywords?: string
  /** URL absolue fournie par la page (ref/getter accepté) — sinon repli `og-default.png`. */
  image?: MaybeRefOrGetter<string | null | undefined>
  type?: 'website' | 'article'
}

/** Repli d'aperçu de partage (ratio 1200×630), servi depuis public/. */
export const OG_DEFAULT_IMAGE = '/og-default.png'

/**
 * SEO des pages statiques : titre + description + balises Open Graph complètes.
 * NUXT_E1001 : useRuntimeConfig()/useRoute() uniquement au top-level du setup —
 * rien n'est rappelé à l'intérieur d'un getter unhead, tout est précalculé.
 */
export function usePageSeo(seo: PageSeo) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = config.public.siteUrl
  const image = toValue(seo.image) ?? `${siteUrl}${OG_DEFAULT_IMAGE}`
  const pageUrl = `${siteUrl}${route.path}`

  useHead({ title: seo.title })
  useSeoMeta({
    description: seo.description,
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    ogTitle: seo.title,
    ogDescription: seo.description,
    ogImage: image,
    ogUrl: pageUrl,
    ogType: seo.type ?? 'website',
  })
}
