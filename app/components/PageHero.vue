<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  lead?: string
}>()
</script>

<template>
  <section class="page-hero">
    <div class="page-hero__glow" aria-hidden="true" />
    <div class="container page-hero__inner">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1 class="page-hero__title">{{ title }}</h1>
      <p v-if="lead" class="lead page-hero__lead">{{ lead }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  padding-block: calc(var(--header-h) + clamp(3rem, 6vw, 6.5rem)) clamp(2.5rem, 4vw, 5rem);
  background: linear-gradient(180deg, var(--paper-2) 0%, var(--paper) 100%);
  color: var(--ink);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}
.page-hero__glow {
  position: absolute;
  inset: -30% -10% auto;
  height: 110%;
  background:
    radial-gradient(50% 55% at 75% 15%, color-mix(in srgb, var(--gold) 16%, transparent), transparent 70%),
    radial-gradient(40% 50% at 15% 55%, color-mix(in srgb, var(--green) 10%, transparent), transparent 70%);
  pointer-events: none;
}
.page-hero__inner { position: relative; display: grid; gap: 1rem; max-width: 820px; }
.page-hero__inner > * { min-width: 0; }
.page-hero__title {
  font-size: var(--step-5);
  color: var(--ink-950);
  line-height: 1.04;
  letter-spacing: -0.015em;
  text-wrap: balance;
  overflow-wrap: break-word;
}
@media (max-width: 420px) {
  .page-hero__title { font-size: 2.25rem; }
}
.page-hero__lead { max-width: 54ch; }
.page-hero :deep(.btn) { margin-top: 0.75rem; justify-self: start; }
</style>
