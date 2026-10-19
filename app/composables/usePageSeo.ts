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
 * Cover brute (ex. 1024×1024, ratio livre) → image de partage recadrée au
 * ratio ~1,91:1 (1200×630) via IPX (JPEG, fit cover, sans upscaling : la
 * largeur reste celle de la source). Sans recadrage, WhatsApp/Facebook
 * affichent le carré avec bandes ou coupent le titre de couverture.
 */
export function ogShareImage(cover: MaybeRefOrGetter<string | null | undefined>) {
  const siteUrl = useRuntimeConfig().public.siteUrl // top-level setup (NUXT_E1001)
  return computed(() => {
    const url = toValue(cover)
    return url ? `${siteUrl}/_ipx/f_jpg&s_1200x630&fit_cover/${url}` : undefined
  })
}

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
