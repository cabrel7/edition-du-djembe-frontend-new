<script setup lang="ts">
const props = defineProps<{ name: string; size?: number }>()

const paths: Record<string, string> = {
  'arrow-right': 'M4 12h16m0 0-6-6m6 6-6 6',
  'arrow-up-right': 'M7 17 17 7m0 0H8m9 0v9',
  play: 'M8 5.5v13l11-6.5-11-6.5Z',
  star: 'M12 2.5l2.2 6.8H21l-5.5 4 2.1 6.7-5.6-4.1-5.6 4.1 2.1-6.7-5.5-4h6.8L12 2.5Z',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Zm0 0V21',
  film: 'M3.5 5h17v14h-17V5Zm0 4.5h17m-17 4.5h17M8 5v14m8-14v14',
  newspaper: 'M4 5h13v14H4V5Zm13 3h3.5L21 10.5V19h-4M7.5 9h6m-6 3.5h6m-6 3.5h4',
  scroll: 'M7 4h9.5A2.5 2.5 0 0 1 19 6.5V19l-3-2-3 2-3-2-3 2V6.5A2.5 2.5 0 0 1 7 4Zm2 4h6M9 12h6',
  download: 'M12 3v11m0 0-4-4m4 4 4-4M4 20h16',
  external: 'M14 4h6v6m0-6-9 9M9 5H6.5A2.5 2.5 0 0 0 4 7.5v10A2.5 2.5 0 0 0 6.5 20h10a2.5 2.5 0 0 0 2.5-2.5V15',
  mail: 'M4 6h16v12H4V6Zm0 0 8 7 8-7',
  phone: 'M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z',
  pin: 'M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 1 1 13 0c0 4.8-6.5 10-6.5 10Zm0-8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2',
  send: 'M4 12 20 4l-4 16-4-6-8-2Zm8 2 8-10',
  check: 'M5 13l4 4L19 7',
  upload: 'M12 16V5m0 0-4 4m4-4 4 4M4 19h16',
  'file-text': 'M7 3h7l5 5v13H7V3Zm7 0v5h5',
  x: 'M6 6l12 12M18 6 6 18',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M17 20a5 5 0 0 1 4-4',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-4h.01',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  heart: 'M12 20s-7-4.5-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.5 12 20 12 20Z',
  award: 'M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-3.5 0-1 6 4.5-2.5L16.5 21l-1-6',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z',
  languages: 'M4 6h10M9 4v2c0 5-2.5 8-5 9m3-5c1.5 2.5 3.5 4 5.5 4.5M13 20l4-10 4 10m-6.5-3h5',
  printer: 'M7 8V4h10v4M7 16H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 13h10v7H7v-7Z',
  graduation: 'M12 4 2.5 9 12 14l9.5-5L12 4Zm-5 7.5V16c0 1.5 3 3 5 3s5-1.5 5-3v-4.5',
  hash: 'M9 4 7 20m10-16-2 16M4.5 9h15m-15 6h15',
  'file-check': 'M7 3h7l5 5v13H7V3Zm7 0v5h5m-8 7 2 2 4-4',
  building: 'M4 21V5l8-2v18m0-12h8v12M8 8h.01M8 12h.01M8 16h.01M14 13h.01M14 17h.01',
  quote: 'M9 8c-2.5 0-4 2-4 4.5S6.5 17 9 17c0 2-1 3-3 4m11-13c-2.5 0-4 2-4 4.5S17.5 17 20 17c0 2-1 3-3 4',
}

const d = computed(() => paths[props.name] ?? paths.star)
</script>

<template>
  <svg
    :width="size ?? 20" :height="size ?? 20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="d" :fill="name === 'play' || name === 'star' ? 'currentColor' : 'none'" :stroke="name === 'play' || name === 'star' ? 'none' : 'currentColor'" />
  </svg>
</template>
