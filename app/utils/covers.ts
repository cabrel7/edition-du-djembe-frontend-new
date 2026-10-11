/**
 * Les endpoints publics renvoient des noms de fichiers ; les fichiers sont
 * servis par le backend hors /api (ex. /books/covers/xxx.jpg).
 * Résout l'URL complète à partir de la base API configurée.
 */
function apiOrigin(): string {
  const base = useRuntimeConfig().public.apiBase // ex. http://localhost:8000/api
  return base.replace(/\/api\/?$/, '')
}

export function coverUrl(kind: 'book' | 'article' | 'memoir' | 'video', filename: string | null | undefined): string | null {
  if (!filename) return null
  if (/^https?:\/\//.test(filename)) return filename
  const dirs: Record<typeof kind, string> = {
    book: 'books/covers',
    article: 'articles',
    memoir: 'memoirs/covers',
    video: 'video',
  }
  // Les anciennes lignes stockent un chemin déjà préfixé (books/covers/xxx.jpg) ;
  // les plus récentes un simple nom de fichier.
  const path = filename.includes('/') ? filename : `${dirs[kind]}/${filename}`
  return `${apiOrigin()}/${path}`
}

/** Rend une URL de plateforme vidéo en embed (YouTube/Vimeo) ou null. */
export function videoEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}
