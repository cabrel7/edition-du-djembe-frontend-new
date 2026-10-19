import { createError, defineEventHandler, getRouterParam } from 'h3'

/**
 * Téléchargement same-origin (PDF) — pont vers l'API Laravel.
 *
 * Les liens pointaient directement vers `apiBase` : le navigateur suivait
 * la redirection vers l'origine de l'API (saut visible vers localhost:8000
 * ou api.domaine). Ici le binaire transite par Nitro (aucun CORS), le
 * client reste sur l'origine de l'app.
 *
 * Le body est streamé (Response web → h3 pipe) : un mémoire de plusieurs
 * Mo ne transitent pas en mémoire Node. Le 404 amont ressort en 404,
 * une erreur réseau en 502.
 */

const PDF_MIME = 'application/pdf'

const KINDS = {
  book: { endpoint: 'downloadbook', fallback: (id: string) => `extrait-${id}.pdf` },
  memoir: { endpoint: 'downloadmemoir', fallback: (id: string) => `memoire-${id}.pdf` },
} as const

type Kind = keyof typeof KINDS

/** Extrait `filename="…"` d'un en-tête Content-Disposition. */
function filenameFrom(header: string | null): string | null {
  if (!header) return null
  const match = header.match(/filename="([^"]+)"/i) ?? header.match(/filename=([^;]+)/i)
  return match?.[1]?.trim() || null
}

/**
 * Nom de fichier sûr pour le Content-Disposition : le backend émet parfois
 * un nom sans extension (colonne `extension` absente côté books → « Titre. »)
 * ou, en théorie, des guillemets dans un titre.
 */
function safeFilename(raw: string | null, fallback: string): string {
  const cleaned = (raw ?? '').replace(/["\\\r\n]/g, '').trim()
  const base = cleaned.replace(/\.pdf$/i, '').replace(/[. ]+$/, '')
  return base ? `${base}.pdf` : fallback
}

export default defineEventHandler(async (event) => {
  const rawType = getRouterParam(event, 'type')
  const id = getRouterParam(event, 'id') ?? ''
  const kind: Kind | undefined = rawType === 'book' || rawType === 'memoir' ? rawType : undefined

  if (!kind || !/^\d+$/.test(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Document introuvable' })
  }

  const target = `${useRuntimeConfig().public.apiBase}/${KINDS[kind].endpoint}/${id}`

  let upstream: globalThis.Response
  try {
    upstream = await globalThis.fetch(target, { headers: { accept: PDF_MIME } })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'inconnue'
    throw createError({
      statusCode: 502,
      statusMessage: 'API indisponible',
      message: `Le téléchargement n’a pas pu joindre l’API (${detail}).`,
    })
  }

  if (!upstream.ok || !upstream.body) {
    const notFound = upstream.status === 404
    throw createError({
      statusCode: notFound ? 404 : 502,
      statusMessage: notFound ? 'Document introuvable' : 'API indisponible',
      message: notFound
        ? 'Aucun document publié pour cet identifiant.'
        : `L’API a répondu ${upstream.status} pour ${KINDS[kind].endpoint}/${id}.`,
    })
  }

  const filename = safeFilename(
    filenameFrom(upstream.headers.get('content-disposition')),
    KINDS[kind].fallback(id),
  )

  return new globalThis.Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? PDF_MIME,
      'content-disposition': `attachment; filename="${filename}"`,
      'x-content-type-options': 'nosniff',
    },
  })
})
