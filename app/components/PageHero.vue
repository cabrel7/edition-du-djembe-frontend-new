<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  /** Mot mis en valeur en or dans le titre (optionnel) */
  accent?: string
  lead?: string
}>()
</script>

<template>
  <section class="page-hero">
    <div class="page-hero__glow" aria-hidden="true" />
    <div class="container page-hero__inner">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1 class="page-hero__title">
        <template v-if="accent">
          {{ title }} <em class="accent">{{ accent }}</em>
        </template>
        <template v-else>{{ title }}</template>
      </h1>
      <p v-if="lead" class="lead page-hero__lead">{{ lead }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  padding-block: calc(var(--header-h) + clamp(3rem, 6vw, 6.5rem)) clamp(2.5rem, 4vw, 5rem);
  background: var(--ink-900);
  color: var(--paper);
  overflow: hidden;
}
.page-hero__glow {
  position: absolute;
  inset: -30% -10% auto;
  height: 110%;
  background:
    radial-gradient(50% 55% at 75% 15%, rgba(232, 163, 76, 0.14), transparent 70%),
    radial-gradient(40% 50% at 15% 55%, rgba(45, 106, 79, 0.18), transparent 70%);
  pointer-events: none;
}
.page-hero__inner { position: relative; display: grid; gap: 1rem; max-width: 820px; }
.page-hero__title {
  font-size: var(--step-5);
  color: #fff;
  line-height: 1.02;
  letter-spacing: -0.02em;
}
.page-hero__title .accent { color: var(--gold); font-style: normal; }
.page-hero__lead { color: rgba(247, 243, 235, 0.8); max-width: 54ch; }
.page-hero :deep(.btn) { margin-top: 0.75rem; justify-self: start; }
</style>
