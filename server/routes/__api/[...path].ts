import { proxyRequest } from 'h3'

/**
 * Pont same-origin vers l'API Laravel.
 *
 * Le navigateur ne peut pas interroger `apiBase` en CORS (l'origine du dev
 * est absente de CORS_DEV_ORIGINS côté backend) : la navigation client
 * échouait silencieusement — page titrée mais liste vide jusqu'à un F5 (SSR).
 * Ici la requête part de Nitro (pas de CORS) puis est retournée au front.
 *
 * Le SSR conserve l'appel direct : pas de traversée inutile côté serveur.
 * Une erreur réseau amont ressort en 502 gérée par le handler Nitro.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const target = `${config.public.apiBase}${event.path.replace(/^\/__api/, '')}`

  try {
    return await proxyRequest(event, target)
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'inconnue'
    throw createError({
      statusCode: 502,
      statusMessage: 'API indisponible',
      message: `Le proxy /__api n’a pas pu joindre l’API (${detail}).`,
      data: { target: `${config.public.apiBase}/…` },
    })
  }
})
