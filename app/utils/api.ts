/**
 * URL d'un endpoint de données.
 *
 * - SSR : appel direct vers `apiBase` (aucun CORS côté serveur).
 * - Navigateur en dev : pont Nitro `/__api` — l'origine `localhost:3000`
 *   n'est pas dans `CORS_DEV_ORIGINS`, l'appel direct était bloqué et les
 *   listes restaient vides jusqu'au rechargement complet.
 * - Navigateur en prod : appel direct (origine couverte par la config CORS).
 *
 * Les URL d'assets (`coverUrl`, téléchargements) restent directes : ni fetch
 * ni CORS concernés.
 */
export function apiUrl(path: string): string {
  if (import.meta.client && import.meta.dev) return `/__api${path}`
  return `${useRuntimeConfig().public.apiBase}${path}`
}
