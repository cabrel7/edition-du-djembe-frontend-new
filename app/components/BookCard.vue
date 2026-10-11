<script setup lang="ts">
import type { Book } from '~/types/api'

const props = defineProps<{ book: Book; delay?: number }>()

const cover = computed(() => coverUrl('book', props.book.cover))
const year = computed(() => props.book.published_date ? new Date(props.book.published_date).getFullYear() : null)
const price = computed(() => (props.book.price != null && Number(props.book.price) > 0 ? `${Number(props.book.price).toFixed(2)} €` : null))
const coverBroken = ref(false)
</script>

<template>
  <NuxtLink :to="`/livres/${book.slug || book.id}`" class="book reveal" :style="{ '--d': `${(delay ?? 0) * 90}ms` }">
    <div class="book__cover">
      <img
        v-if="cover && !coverBroken" :src="cover" :alt="`Couverture — ${book.title}`" loading="lazy" width="400" height="600"
        style="width:100%;height:100%;object-fit:cover"
        @error="coverBroken = true"
      >
      <div v-else class="skeleton" style="width:100%;height:100%;border-radius:0" aria-hidden="true" />
    </div>
    <h3 class="book__title">{{ book.title }}</h3>
    <div class="book__meta">
      <span>{{ book.author }}</span>
      <span v-if="price" class="book__price">{{ price }}</span>
      <span v-else-if="year">{{ year }}</span>
    </div>
  </NuxtLink>
</template>
