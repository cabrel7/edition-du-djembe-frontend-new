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
