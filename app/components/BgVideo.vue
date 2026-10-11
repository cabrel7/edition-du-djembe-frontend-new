<script setup lang="ts">
/**
 * Vidéo de fond performante et sans « flash » :
 * - fond CSS du conteneur visible dès le départ (pas de flash blanc) ;
 * - la vidéo apparaît en fondu dès qu'elle joue réellement ;
 * - une seule source, chargée en différé (idle ou IntersectionObserver) ;
 * - image fixe seule si « économie de données », 2G, animations réduites,
 *   ou (desktopOnly) sur mobile.
 */
const props = withDefaults(defineProps<{
  poster?: string
  mp4: string
  eager?: boolean
  desktopOnly?: boolean
  rate?: number
}>(), { rate: 1 })

const el = ref<HTMLVideoElement | null>(null)
const playing = ref(false)

onMounted(() => {
  const v = el.value
  if (!v) return
  const nav = navigator as Navigator & { connection?: { saveData?: boolean, effectiveType?: string } }
  const saveData = nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType || '')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = window.matchMedia('(max-width: 767px)').matches
  if (saveData || reduced || (props.desktopOnly && mobile)) return

  const reveal = () => { playing.value = true }
  v.addEventListener('playing', reveal, { once: true })
  if (props.rate !== 1) {
    const keepRate = () => { if (v.playbackRate !== props.rate) v.playbackRate = props.rate }
    for (const ev of ['playing', 'seeked', 'ratechange', 'loadeddata']) v.addEventListener(ev, keepRate)
  }

  const start = () => {
    v.src = props.mp4
    v.playbackRate = props.rate
    v.defaultPlaybackRate = props.rate
    v.play().catch(() => {})
  }
  if (props.eager) {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1200 })
    else setTimeout(start, 400)
    return
  }
  const io = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      start()
      io.disconnect()
    }
  }, { rootMargin: '100px' })
  io.observe(v)
})
</script>

<template>
  <div class="bgv" :style="poster ? { backgroundImage: `url(${poster})` } : undefined">
    <video
      ref="el"
      class="bgv__video"
      :class="{ 'is-playing': playing }"
      muted
      loop
      playsinline
      autoplay
      preload="none"
      aria-hidden="true"
      disablepictureinpicture
      disableremoteplayback
    />
  </div>
</template>

<style scoped>
.bgv { position: absolute; inset: 0; background-size: cover; background-position: center; }
.bgv__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1); }
.bgv__video.is-playing { opacity: 1; }
</style>
