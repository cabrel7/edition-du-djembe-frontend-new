<script setup lang="ts">
const route = useRoute()

const open = ref(false)
const scrolled = ref(false)
const hidden = ref(false)

const links = [
  { to: '/catalogue', label: 'Catalogue', desc: 'Romans, essais & collections' },
  { to: '/actualites', label: 'Actualités', desc: 'La vie de la maison' },
  { to: '/cahiers-du-djembe', label: 'Les Cahiers du Djembé', desc: 'La revue de presse & d’idées' },
  { to: '/memoires', label: 'Mémoires', desc: 'Recherche & universités' },
  { to: '/videos', label: 'Vidéos', desc: 'Entretiens & documentaires' },
  { to: '/a-propos', label: 'À propos', desc: 'L’histoire de la maison' },
]

let lastY = 0
function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 40
  hidden.value = y > 400 && y > lastY && !open.value
  lastY = y
}

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (import.meta.client) document.documentElement.style.overflow = ''
})

watch(() => route.fullPath, () => (open.value = false))
watch(open, (v) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = v ? 'hidden' : ''
    const { $lenis } = useNuxtApp()
    const l = $lenis as { stop: () => void, start: () => void } | null
    if (v) l?.stop()
    else l?.start()
  }
})
</script>

<template>
  <header class="hdr" :class="{ 'is-scrolled': scrolled, 'is-hidden': hidden, 'is-open': open }">
    <div class="hdr__bar container">
      <NuxtLink to="/" class="hdr__logo" aria-label="Les Éditions du Djembé d’Ébène — accueil">
        <img src="/logo.png" alt="" width="40" height="40">
        <span class="hdr__word">Les Éditions<br>du Djembé d’<em>Ébène</em></span>
      </NuxtLink>

      <nav class="hdr__nav" aria-label="Navigation principale">
        <NuxtLink
          v-for="l in links" :key="l.to" :to="l.to"
          class="hdr__link" :class="{ active: isActive(l.to) }"
        >{{ l.label }}</NuxtLink>
      </nav>

      <div class="hdr__actions">
        <NuxtLink to="/soumettre-mon-travail" class="btn btn-primary hdr__cta">
          <span class="hdr__cta-short">Soumettre</span>
          <span class="hdr__cta-full">Soumettre un manuscrit</span>
        </NuxtLink>
        <button
          class="hdr__burger" :aria-expanded="open" aria-controls="mobile-menu"
          @click="open = !open"
        >
          <span class="sr-only">{{ open ? 'Fermer le menu' : 'Ouvrir le menu' }}</span>
          <i /><i />
        </button>
      </div>
    </div>

    <div id="mobile-menu" class="mm" :class="{ 'is-open': open }" :aria-hidden="!open">
      <div class="mm__inner container">
        <nav class="mm__nav" aria-label="Navigation mobile">
          <NuxtLink
            v-for="(l, i) in links" :key="l.to" :to="l.to" class="mm__link"
            :style="{ '--i': i }" :tabindex="open ? 0 : -1"
          >
            <span class="mm__num">0{{ i + 1 }}</span>
            <span class="mm__body">
              <span class="mm__label">{{ l.label }}</span>
              <span class="mm__desc">{{ l.desc }}</span>
            </span>
          </NuxtLink>
        </nav>
        <div class="mm__foot">
          <NuxtLink
            to="/soumettre-mon-travail" class="btn btn-primary btn-block"
            :tabindex="open ? 0 : -1"
          >Soumettre un manuscrit</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  color: var(--paper);
  transition: transform 0.5s var(--ease), color 0.3s;
}
.hdr.is-hidden { transform: translateY(-110%); }
.hdr.is-open { color: var(--paper); }

.hdr__bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: var(--header-h);
  margin-top: 10px;
  padding-inline: 1rem 0.6rem;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: background 0.4s, border-color 0.4s, box-shadow 0.4s, backdrop-filter 0.4s;
}
.is-scrolled:not(.is-open) .hdr__bar {
  background: rgba(12, 26, 18, 0.82);
  border-color: var(--line-light);
  box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.55);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  backdrop-filter: blur(14px) saturate(160%);
}

.hdr__logo { display: flex; align-items: center; gap: 0.6rem; color: inherit; }
.hdr__logo img { width: 38px; height: 38px; filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.18)); }
.hdr__word { font-size: 0.95rem; letter-spacing: -0.01em; line-height: 1.15; white-space: nowrap; }
.hdr__word em { font-style: normal; color: var(--gold); }

.hdr__nav { display: none; gap: 0.25rem; }
.hdr__link {
  position: relative;
  padding: 0.5rem 0.8rem;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 999px;
  opacity: 0.85;
  transition: opacity 0.2s, background 0.2s;
  white-space: nowrap;
}
.hdr__link:hover { opacity: 1; background: rgba(232, 163, 76, 0.14); }
.hdr__link.active { opacity: 1; }
.hdr__link.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
  transform: translateX(-50%);
}

.hdr__actions { display: flex; align-items: center; gap: 0.5rem; }
.hdr__cta { min-height: 44px; padding: 0.6rem 1rem; font-size: 0.85rem; }
.hdr__cta-short { display: inline; }
.hdr__cta-full { display: none; }

.hdr__burger {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 0;
  background: var(--gold);
  cursor: pointer;
  flex: none;
}
.hdr__burger:focus-visible { outline: 2px solid var(--paper); outline-offset: 2px; }
.hdr__burger i {
  position: absolute;
  left: 14px;
  right: 14px;
  height: 2px;
  background: var(--ink-950);
  border-radius: 2px;
  transition: transform 0.4s var(--ease), top 0.4s var(--ease);
}
.hdr__burger i:first-of-type { top: 19px; }
.hdr__burger i:last-of-type { top: 26px; right: 18px; }
.is-open .hdr__burger i:first-of-type { top: 22px; transform: rotate(45deg); }
.is-open .hdr__burger i:last-of-type { top: 22px; right: 14px; transform: rotate(-45deg); }

/* Menu mobile plein écran — révélation circulaire depuis le burger */
.mm {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: var(--ink-950);
  color: var(--paper);
  clip-path: circle(0 at calc(100% - 44px) 46px);
  transition: clip-path 0.8s var(--ease);
  overflow-y: auto;
}
.mm.is-open { clip-path: circle(150% at calc(100% - 44px) 46px); }
.mm__inner {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: calc(var(--header-h) + 3rem);
  padding-bottom: 2rem;
  gap: 2rem;
}
.mm__nav { display: grid; }
.mm__link {
  display: flex;
  align-items: baseline;
  gap: 1.1rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--line-light);
  color: var(--paper);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease), color 0.2s;
}
.mm.is-open .mm__link { opacity: 1; transform: none; transition-delay: calc(0.15s + var(--i) * 0.05s); }
.mm__link:hover, .mm__link.router-link-active { color: var(--gold); }
.mm__num { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; color: var(--gold); }
.mm__body { display: grid; gap: 0.2rem; }
.mm__label { font-size: clamp(1.3rem, 5vw, 1.7rem); line-height: 1.15; }
.mm__desc { font-size: 0.8rem; color: rgba(245, 239, 226, 0.5); }
.mm__foot { display: grid; gap: 1rem; justify-items: stretch; }
.btn-block { justify-content: center; }

@media (min-width: 640px) {
  .hdr__cta-short { display: none; }
  .hdr__cta-full { display: inline; }
  .hdr__cta { padding: 0.6rem 1.1rem; }
  .hdr__word { font-size: 1.05rem; }
}
@media (min-width: 1100px) {
  .hdr__nav { display: flex; }
  .hdr__burger, .mm { display: none; }
}
</style>
