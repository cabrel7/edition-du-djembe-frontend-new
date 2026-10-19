/**
 * Prix en dollars canadiens (base = déjà en CAD, zéro conversion).
 * `fr-CA` + CAD → « 30,50 $ » (espace insécable, symbole après le montant —
 * norme canadienne-française), identique côté serveur et navigateur.
 */
const CAD = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
})

/** `30.50` → « 30,50 $ » ; null / 0 / non numérique → null (pas de prix affiché). */
export function formatPrice(value: unknown): string | null {
  const n = Number(value)
  return value != null && Number.isFinite(n) && n > 0 ? CAD.format(n) : null
}
