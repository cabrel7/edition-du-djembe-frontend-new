/**
 * Reveal au scroll : ajoute .is-in sur .reveal / .reveal-img dès l'entrée
 * dans le viewport (une seule fois). MutationObserver pour les rendus SSR
 * tardifs / navigations.
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  document.documentElement.classList.add('js')

  // Mode capture (?capture / ?capture=deep&off=Npx) : fige les reveals pour les captures QA.
  const params = new URLSearchParams(location.search)
  const capture = params.get('capture')
  if (capture !== null) {
    document.documentElement.classList.add('capture')
    if (capture === 'deep') {
      document.documentElement.classList.add('capture-deep')
      const off = Number(params.get('off'))
      if (Number.isFinite(off) && off > 0) {
        document.documentElement.style.setProperty('--capture-off', `${off}px`)
      }
    }
    return
  }

  const seen = new WeakSet<Element>()
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )

  function scan(root: ParentNode = document) {
    root.querySelectorAll<HTMLElement>('.reveal, .reveal-img').forEach((el) => {
      if (seen.has(el)) return
      seen.add(el)
      io.observe(el)
    })
  }

  scan()
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node instanceof HTMLElement) {
          if (node.matches('.reveal, .reveal-img')) {
            if (!seen.has(node)) { seen.add(node); io.observe(node) }
          }
          scan(node)
        }
      }
    }
  })
  mo.observe(document.body, { childList: true, subtree: true })
})
