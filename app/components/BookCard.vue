<script setup lang="ts">
import type { Book } from '~/types/api'

const props = defineProps<{ book: Book }>()

const cover = computed(() => coverUrl('book', props.book.cover))
const year = computed(() => props.book.published_date ? new Date(props.book.published_date).getFullYear() : null)
const price = computed(() => formatPrice(props.book.price))
const coverBroken = ref(false)
</script>

<template>
  <NuxtLink :to="`/livres/${book.slug || book.id}`" class="book">
    <div class="book__cover">
      <NuxtImg
        v-if="cover && !coverBroken" :src="cover" :alt="`Couverture — ${book.title}`"
        preset="cover" width="400" height="600" :sizes="BOOK_SIZES"
        loading="lazy" decoding="async"
        style="width:100%;height:100%;object-fit:cover"
        @error="coverBroken = true"
      />
      <div v-else class="book__placeholder" aria-hidden="true">
        <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="4" width="64" height="112" rx="3" ry="3" fill="currentColor" opacity="0.12"/>
          <rect x="8" y="4" width="6" height="112" rx="1" fill="currentColor" opacity="0.2"/>
          <line x1="20" y1="28" x2="56" y2="28" stroke="currentColor" stroke-width="1.5" opacity="0.25"/>
          <line x1="20" y1="36" x2="48" y2="36" stroke="currentColor" stroke-width="1" opacity="0.18"/>
          <circle cx="40" cy="68" r="12" stroke="currentColor" stroke-width="1.2" opacity="0.2"/>
          <path d="M34 68 L40 62 L46 68 L40 74 Z" fill="currentColor" opacity="0.15"/>
          <line x1="20" y1="96" x2="44" y2="96" stroke="currentColor" stroke-width="1" opacity="0.15"/>
        </svg>
      </div>
    </div>
    <h3 class="book__title">{{ book.title }}</h3>
    <div class="book__meta">
      <span>{{ book.author }}</span>
      <span v-if="price" class="book__price">{{ price }}</span>
      <span v-else-if="year">{{ year }}</span>
    </div>
  </NuxtLink>
</template>
