/** Nombre maximal de nouvelles tentatives avant d'afficher le repli. */
const IMAGE_MAX_RETRIES = 2
/** Délai de base entre deux tentatives (multiplié par le n° de tentative). */
const IMAGE_RETRY_DELAY_MS = 800
const RETRY_PARAM = 'r'

/**
 * Handler `@error` d'une <img> : un échec réseau transitoire (connexion
 * coupée sous rafale HTTP/2) ne doit pas figer le repli jusqu'au F5.
 * Recharge l'image jusqu'à IMAGE_MAX_RETRIES fois (paramètre ignoré par le
 * serveur, il contourne seulement le cache d'erreur), puis appelle `onGiveUp`.
 */
export function retryImage(event: Event, onGiveUp: () => void): void {
  const img = event.target
  if (!(img instanceof HTMLImageElement)) {
    onGiveUp()
    return
  }
  const attempt = Number(img.dataset.retry ?? 0)
  if (attempt >= IMAGE_MAX_RETRIES) {
    onGiveUp()
    return
  }
  img.dataset.retry = String(attempt + 1)
  const url = new URL(img.currentSrc || img.src, window.location.href)
  url.searchParams.set(RETRY_PARAM, String(attempt + 1))
  window.setTimeout(() => { img.src = url.toString() }, IMAGE_RETRY_DELAY_MS * (attempt + 1))
}
