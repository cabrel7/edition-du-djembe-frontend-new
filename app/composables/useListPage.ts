/**
 * Liste filtrable côté client sur une collection déjà chargée (SSR).
 * `items` est la source de vérité ; la recherche filtre localement.
 */
export function useListPage<T extends { id: number }>(
  items: MaybeRefOrGetter<T[]>,
  searchFields: (item: T) => string[],
) {
  const source = computed(() => toValue(items))
  const query = ref('')
  const visibleCount = ref(12)

  const filtered = computed(() => {
    const list = source.value
    const q = query.value.trim().toLowerCase()
    if (!q) return list
    return list.filter(item =>
      searchFields(item).some(f => f?.toLowerCase().includes(q)),
    )
  })

  const visible = computed(() => filtered.value.slice(0, visibleCount.value))
  const hasMore = computed(() => visible.value.length < filtered.value.length)

  function loadMore() {
    visibleCount.value += 12
  }

  function reset() {
    query.value = ''
    visibleCount.value = 12
  }

  return { query, filtered, visible, hasMore, loadMore, reset }
}
