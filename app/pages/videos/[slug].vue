<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

interface VideoDetail {
  id: number
  title: string
  slug: string | null
  description: string | null
  video_url: string
  thumbnail: string | null
}

const { data: video, error } = await useAsyncData<VideoDetail>(
  () => `video-${slug.value}`,
  () => $fetch(apiUrl(`/videos/${slug.value}`)),
  { server: true },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Vidéo introuvable', fatal: true })
}

const thumb = coverUrl('video', video.value?.thumbnail, config.public.apiBase)
const embed = computed(() => (video.value?.video_url ? videoEmbedUrl(video.value.video_url) : null))
const platform = computed(() => (video.value?.video_url ? videoPlatform(video.value.video_url) : null))

useSeoMeta({
  title: () => `${video.value?.title ?? 'Vidéo'} — Les Éditions du Djembé d’Ébène`,
  description: () => video.value?.description?.slice(0, 160) ?? 'Vidéo publiée par les Éditions du Djembé d’Ébène.',
  ogTitle: () => video.value?.title,
  ogDescription: () => video.value?.description?.slice(0, 160) ?? undefined,
  ogImage: thumb ?? undefined,
})
</script>

<template>
  <main>
    <section class="video-hero">
      <div class="video-hero__glow" aria-hidden="true" />
      <div class="container-narrow" style="position:relative">
        <p class="eyebrow">
          <NuxtLink to="/videos" class="crumb">Vidéos</NuxtLink>
        </p>
        <h1 class="video-hero__title">{{ video?.title }}</h1>
        <p v-if="video?.description" class="video-hero__lead">{{ video.description }}</p>

        <div class="embed-16x9" style="margin-top:1.75rem">
          <iframe
            v-if="embed" :src="embed" :title="video?.title"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy"
          />
          <a
            v-else-if="video?.video_url" :href="video.video_url" target="_blank" rel="noopener noreferrer"
            class="video-fallback"
          >
            <AppIcon name="play" :size="48" />
            <span>Voir la vidéo{{ platform ? ` sur ${platform}` : '' }}</span>
          </a>
          <span v-if="platform" class="chip video-hero__platform">{{ platform }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.video-hero {
  position: relative;
  padding-block: calc(var(--header-h) + clamp(2rem, 4vw, 4rem)) clamp(2.5rem, 4vw, 5rem);
  background: var(--ink-900);
  color: var(--paper);
  overflow: hidden;
  min-height: 80svh;
}
.video-hero__glow {
  position: absolute;
  inset: -30% -10% auto;
  height: 110%;
  background:
    radial-gradient(50% 55% at 70% 20%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 70%),
    radial-gradient(40% 50% at 20% 60%, color-mix(in srgb, var(--green) 18%, transparent), transparent 70%);
  pointer-events: none;
}
.video-hero__title { font-size: var(--step-4); color: var(--paper); line-height: 1.08; margin-top: 0.75rem; }
.video-hero__lead { color: var(--on-dark-2); margin-top: 1rem; max-width: 58ch; line-height: 1.65; }
.crumb { color: inherit; }
.crumb:hover { color: var(--gold-300); }
.video-fallback { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 0.75rem; color: var(--gold-300); text-decoration: none; background: linear-gradient(160deg, var(--ink-800), var(--ink-900)); }
.video-fallback span { font-size: 0.95rem; font-weight: 600; }
.video-hero__platform {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 3;
  pointer-events: none;
  background: color-mix(in srgb, var(--ink-950) 78%, transparent);
  border-color: color-mix(in srgb, var(--gold-300) 45%, transparent);
  color: var(--paper);
  font-weight: 600;
  letter-spacing: 0.08em;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}
</style>
