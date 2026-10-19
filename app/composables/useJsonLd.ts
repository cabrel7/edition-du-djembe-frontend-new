export type JsonLdNode = Record<string, unknown>

/**
 * Injecte un bloc `application/ld+json` via unhead.
 * Le getter doit rester pur : un getter unhead qui rappelle un composable sort
 * du contexte Nuxt (NUXT_E1001).
 */
export function useJsonLd(key: string, data: MaybeRefOrGetter<JsonLdNode>) {
  useHead({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify(toValue(data))),
      },
    ],
  })
}

/** Date de la base → ISO 8601 attendu par schema.org, undefined si illisible. */
export function isoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? undefined : new Date(time).toISOString()
}
