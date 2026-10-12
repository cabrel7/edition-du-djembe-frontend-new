<script setup lang="ts">
useHead({ title: 'Contact — Les Éditions du Djembé d’Ébène' })

const contact = {
  street: '12263 boulevard Saint Claude',
  city: 'Québec, Canada',
  phone: '+1 (581) 928 85 85',
  email: 'contacteditiondudjembe@gmail.com',
  schedule: { weekdays: 'Lun – Ven : 9 h – 18 h', saturday: 'Sam : 10 h – 14 h' },
}

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'pending' | 'ok' | 'err'>('idle')

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  let ok = true
  if (!form.name.trim()) { errors.name = 'Le nom est requis'; ok = false }
  if (!form.email.trim()) errors.email = 'L’email est requis'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Adresse email invalide'; ok = false }
  if (!form.subject.trim()) { errors.subject = 'Le sujet est requis'; ok = false }
  if (!form.message.trim()) { errors.message = 'Le message est requis'; ok = false }
  return ok
}

async function submit() {
  if (!validate()) return
  status.value = 'pending'
  try {
    await $fetch(`${useRuntimeConfig().public.apiBase}/contacts`, {
      method: 'POST',
      body: { name: form.name, email: form.email, subject: form.subject, message: form.message },
    })
    status.value = 'ok'
    form.name = ''; form.email = ''; form.subject = ''; form.message = ''
  } catch {
    status.value = 'err'
  }
}
</script>

<template>
  <main>
    <PageHero
      eyebrow="Contact"
      title="Écrivons"
      accent="ensemble"
      lead="Une question, un projet, une collaboration ? Notre équipe est à votre écoute."
    />

    <section class="section section-paper">
      <div class="container contact-layout">
        <aside class="contact-aside reveal">
          <p class="eyebrow">Nos coordonnées</p>
          <h2 class="h3" style="margin-top:0.5rem">Parlons de votre projet</h2>
          <div class="contact-coords" style="margin-top:1.5rem">
            <div class="contact-coord">
              <span class="contact-coord__icon"><AppIcon name="pin" :size="20" /></span>
              <div>
                <p class="contact-coord__label">Adresse</p>
                <p class="contact-coord__value">{{ contact.street }}<br>{{ contact.city }}</p>
              </div>
            </div>
            <div class="contact-coord">
              <span class="contact-coord__icon"><AppIcon name="phone" :size="20" /></span>
              <div>
                <p class="contact-coord__label">Téléphone</p>
                <p class="contact-coord__value"><a :href="`tel:${contact.phone.replace(/[^+\d]/g, '')}`">{{ contact.phone }}</a></p>
              </div>
            </div>
            <div class="contact-coord">
              <span class="contact-coord__icon"><AppIcon name="mail" :size="20" /></span>
              <div>
                <p class="contact-coord__label">Email</p>
                <p class="contact-coord__value"><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></p>
              </div>
            </div>
            <div class="contact-coord">
              <span class="contact-coord__icon"><AppIcon name="clock" :size="20" /></span>
              <div>
                <p class="contact-coord__label">Horaires</p>
                <p class="contact-coord__value">{{ contact.schedule.weekdays }}<br>{{ contact.schedule.saturday }}</p>
              </div>
            </div>
          </div>
        </aside>

        <form class="form-card reveal" style="--d:100ms" novalidate @submit.prevent="submit">
          <h2 class="form-card__title">Envoyez-nous un message</h2>

          <div v-if="status === 'ok'" class="form-status form-status--ok" role="status">
            Message envoyé. Nous vous répondrons dans les meilleurs délais.
          </div>
          <div v-else-if="status === 'err'" class="form-status form-status--err" role="alert">
            Une erreur est survenue lors de l’envoi. Réessayez ou écrivez-nous par email.
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="c-name">Nom complet *</label>
              <input id="c-name" v-model="form.name" type="text" autocomplete="name" required>
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>
            <div class="field">
              <label for="c-email">Email *</label>
              <input id="c-email" v-model="form.email" type="email" autocomplete="email" required>
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>
          </div>

          <div class="field">
            <label for="c-subject">Sujet *</label>
            <input id="c-subject" v-model="form.subject" type="text" required>
            <span v-if="errors.subject" class="field-error">{{ errors.subject }}</span>
          </div>

          <div class="field">
            <label for="c-message">Message *</label>
            <textarea id="c-message" v-model="form.message" rows="6" required />
            <span v-if="errors.message" class="field-error">{{ errors.message }}</span>
          </div>

          <button class="btn btn-primary" type="submit" :disabled="status === 'pending'">
            {{ status === 'pending' ? 'Envoi…' : 'Envoyer le message' }}
            <AppIcon name="send" :size="16" />
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.contact-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: clamp(1.75rem, 4vw, 3.5rem); align-items: start; }
.contact-aside { display: grid; gap: 0.5rem; }
@media (max-width: 860px) {
  .contact-layout { grid-template-columns: 1fr; }
}
</style>
