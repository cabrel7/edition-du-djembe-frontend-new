/**
 * URL d'un endpoint de données.
 *
 * - SSR : appel direct vers `apiBase` (aucun CORS côté serveur).
 * - Navigateur (dev ET prod) : pont Nitro `/__api` — même domaine que la page,
 *   connexion HTTP déjà ouverte : pas de handshake TLS cross-origin ni de
 *   preflight CORS à chaque navigation. Le fetch direct vers `apiBase` en prod
 *   coûtait ~1 s au 1er clic (dns+tls) sur le pont, d'où la page « figée »
 *   avec l'URL déjà changée.
 *
 * Les URL d'assets (`coverUrl`, téléchargements) restent directes : ni fetch
 * ni CORS concernés.
 */
export function apiUrl(path: string): string {
  if (import.meta.client) return `/__api${path}`
  return `${useRuntimeConfig().public.apiBase}${path}`
}
