<script setup lang="ts">
definePageMeta({ hero: 'light' })

useHead({ title: 'Soumettre un manuscrit' })

const types = [
  { value: 'book', label: 'Livre' },
  { value: 'memoir', label: 'Mémoire / thèse' },
  { value: 'article', label: 'Article' },
]

const form = reactive({
  type: 'book',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  title: '',
  summary: '',
  rgpd_consent: false,
})
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'pending' | 'ok' | 'err'>('idle')
const showProtocol = ref(false)
const protocolDialog = ref<HTMLElement | null>(null)
let protocolTrigger: HTMLElement | null = null

function openProtocol(trigger: EventTarget | null) {
  protocolTrigger = trigger instanceof HTMLElement ? trigger : null
  showProtocol.value = true
}

function closeProtocol() {
  showProtocol.value = false
  protocolTrigger?.focus()
  protocolTrigger = null
}

/** Esc ferme, Tab cycle dans le dialog (focus trap). */
function onProtocolKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeProtocol()
    return
  }
  if (event.key !== 'Tab' || !protocolDialog.value) return
  const focusables = Array.from(
    protocolDialog.value.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter(el => !el.hasAttribute('disabled'))
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(showProtocol, (open) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (open) {
    nextTick(() => protocolDialog.value?.querySelector<HTMLElement>('.modal__close')?.focus())
  }
})
onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})

function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  if (f.type !== 'application/pdf') {
    errors.file = 'Seuls les fichiers PDF sont acceptés.'
    file.value = null
    input.value = ''
    return
  }
  if (f.size > 20 * 1024 * 1024) {
    errors.file = 'Le fichier ne doit pas dépasser 20 Mo.'
    file.value = null
    input.value = ''
    return
  }
  delete errors.file
  file.value = f
}

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  let ok = true
  if (!form.first_name.trim() || form.first_name.trim().length < 2) { errors.first_name = 'Prénom requis (min. 2 caractères)'; ok = false }
  if (!form.last_name.trim() || form.last_name.trim().length < 2) { errors.last_name = 'Nom requis (min. 2 caractères)'; ok = false }
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Adresse email invalide'; ok = false }
  if (!form.title.trim() || form.title.trim().length < 3) { errors.title = 'Titre requis (min. 3 caractères)'; ok = false }
  if (!form.summary.trim() || form.summary.trim().length < 100) { errors.summary = 'Résumé requis (min. 100 caractères)'; ok = false }
  if (!file.value) { errors.file = 'Veuillez joindre votre manuscrit (PDF)'; ok = false }
  if (!form.rgpd_consent) { errors.rgpd_consent = 'Vous devez accepter les conditions'; ok = false }
  return ok
}

async function submit() {
  if (!validate()) return
  status.value = 'pending'
  try {
    const fd = new FormData()
    fd.append('type', form.type)
    fd.append('first_name', form.first_name)
    fd.append('last_name', form.last_name)
    fd.append('email', form.email)
    if (form.phone) fd.append('phone', form.phone)
    fd.append('title', form.title)
    fd.append('summary', form.summary)
    fd.append('rgpd_consent', '1')
    if (file.value) fd.append('file', file.value)

    await $fetch(apiUrl('/submissions'), {
      method: 'POST',
      body: fd,
    })
    status.value = 'ok'
  } catch {
    status.value = 'err'
  }
}

function reset() {
  form.type = 'book'
  form.first_name = ''; form.last_name = ''; form.email = ''; form.phone = ''
  form.title = ''; form.summary = ''; form.rgpd_consent = false
  file.value = null
  if (fileInput.value) fileInput.value.value = ''
  status.value = 'idle'
}
</script>

<template>
  <main>
    <PageHero
      eyebrow="Auteurs"
      title="Faire écho votre voix"
      lead="Vous avez un manuscrit ou un article à nous proposer ? Remplissez le formulaire et notre comité de lecture l’examinera avec attention."
    >
      <button class="btn btn-primary protocol-btn" type="button" @click="openProtocol($event.currentTarget)">
        Avis aux auteurs — protocole <AppIcon name="file-text" :size="16" />
      </button>
    </PageHero>

    <section class="section section-paper">
      <div class="container-narrow">
        <div v-if="status === 'ok'" class="success-box">
          <span class="success-box__icon"><AppIcon name="check" :size="32" /></span>
          <h2 class="h2">Manuscrit envoyé avec succès !</h2>
          <p class="lead" style="margin-inline:auto">
            Nous avons bien reçu votre soumission. Notre comité de lecture examinera votre manuscrit et vous contactera dans les meilleurs délais.
          </p>
          <button class="btn btn-dark" type="button" @click="reset()">Soumettre une autre œuvre</button>
        </div>

        <form v-else class="submit-form" novalidate @submit.prevent="submit">
          <div class="form-status form-status--err" v-if="status === 'err'" role="alert">
            Une erreur est survenue lors de l'envoi. Vérifiez les champs et réessayez.
          </div>

          <fieldset class="form-card">
            <legend class="form-card__title">Informations personnelles</legend>
            <div class="form-grid">
              <div class="field">
                <label for="s-type">Type d'œuvre *</label>
                <select id="s-type" v-model="form.type">
                  <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
              </div>
              <div class="field">
                <label for="s-phone">Téléphone</label>
                <input id="s-phone" v-model="form.phone" type="tel" autocomplete="tel">
              </div>
              <div class="field">
                <label for="s-first">Prénom *</label>
                <input id="s-first" v-model="form.first_name" type="text" autocomplete="given-name" required>
                <span v-if="errors.first_name" class="field-error">{{ errors.first_name }}</span>
              </div>
              <div class="field">
                <label for="s-last">Nom *</label>
                <input id="s-last" v-model="form.last_name" type="text" autocomplete="family-name" required>
                <span v-if="errors.last_name" class="field-error">{{ errors.last_name }}</span>
              </div>
              <div class="field" style="grid-column:1/-1">
                <label for="s-email">Email *</label>
                <input id="s-email" v-model="form.email" type="email" autocomplete="email" required>
                <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-card">
            <legend class="form-card__title">Informations sur l'œuvre</legend>
            <div class="field">
              <label for="s-title">Titre de l'œuvre *</label>
              <input id="s-title" v-model="form.title" type="text" required>
              <span v-if="errors.title" class="field-error">{{ errors.title }}</span>
            </div>
            <div class="field">
              <label for="s-summary">Résumé * <span class="field-hint">({{ form.summary.length }}/2000, min. 100)</span></label>
              <textarea id="s-summary" v-model="form.summary" rows="6" maxlength="2000" required placeholder="Décrivez votre œuvre en quelques paragraphes…" />
              <span v-if="errors.summary" class="field-error">{{ errors.summary }}</span>
            </div>
          </fieldset>

          <fieldset class="form-card">
            <legend class="form-card__title">Manuscrit</legend>
            <div class="file-drop">
              <input ref="fileInput" id="s-file" type="file" accept=".pdf,application/pdf" class="sr-only" @change="onFile">
              <label for="s-file" class="file-drop__label">
                <AppIcon :name="file ? 'file-check' : 'upload'" :size="36" />
                <span v-if="file" class="file-drop__name">{{ file.name }}</span>
                <span v-else class="file-drop__hint">Cliquez pour téléverser votre manuscrit<br>PDF uniquement · max 20 Mo</span>
              </label>
              <span v-if="errors.file" class="field-error">{{ errors.file }}</span>
            </div>
          </fieldset>

          <div class="form-card">
            <div class="checkbox-field">
              <input id="s-rgpd" v-model="form.rgpd_consent" type="checkbox" required>
              <label for="s-rgpd">
                J'accepte que mes données personnelles soient traitées par les Éditions conformément à leur politique de confidentialité. Je comprends que mes données seront utilisées uniquement dans le cadre de l'évaluation de mon manuscrit. *
              </label>
            </div>
            <span v-if="errors.rgpd_consent" class="field-error">{{ errors.rgpd_consent }}</span>
          </div>

          <button class="btn btn-primary btn-block" type="submit" :disabled="status === 'pending'">
            {{ status === 'pending' ? 'Envoi…' : 'Envoyer ma soumission' }}
            <AppIcon name="send" :size="16" />
          </button>
        </form>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="showProtocol" ref="protocolDialog" class="modal-backdrop"
        role="dialog" aria-modal="true" aria-labelledby="protocol-title"
        @click.self="closeProtocol" @keydown="onProtocolKeydown"
      >
        <div class="modal">
          <header class="modal__head">
            <h2 id="protocol-title" class="modal__title">Protocole de présentation des manuscrits</h2>
            <button class="modal__close" type="button" aria-label="Fermer le protocole" @click="closeProtocol">
              <AppIcon name="x" :size="20" />
            </button>
          </header>
          <div class="modal__body">
            <p class="protocol-brand">Les Éditions du Djembé d'Ébène</p>

            <h3 class="protocol-h">1. Présentation matérielle</h3>
            <ul class="protocol-list">
              <li>Rédiger le manuscrit dans un seul fichier complet et définitif, incluant la date dans le nom du fichier.</li>
              <li>Utiliser la police <strong>Times New Roman</strong>, taille <strong>12 points</strong>, interligne <strong>double</strong>.</li>
              <li>Appliquer le double interligne à l'ensemble du texte, y compris notes de bas de page, citations et bibliographies.</li>
            </ul>

            <h3 class="protocol-h">2. Détails méthodologiques</h3>
            <p class="protocol-sub">2.1 Caractères typographiques</p>
            <ul class="protocol-list">
              <li>Respecter les accents, trémas et cédilles même sur les majuscules.</li>
              <li>Différencier clairement les chiffres (0, 1) des lettres (O, l).</li>
              <li>Utiliser les guillemets français (« ») ; les guillemets anglais sont réservés aux citations à l'intérieur de citations.</li>
              <li>Employer le tiret demi-cadratin pour isoler une portion de phrase.</li>
              <li>Privilégier le symbole <strong>%</strong> au mot « pour cent ».</li>
            </ul>
            <p class="protocol-sub">2.2 Appels de notes</p>
            <p class="protocol-p">Placer les appels de notes <strong>avant</strong> toute ponctuation. Exemple : « … et les populations aiment le partage¹ ».</p>
            <p class="protocol-sub">2.3 Titres et sous-titres</p>
            <ul class="protocol-list">
              <li>Titres courts, en majuscules pour les parties/chapitres, minuscules pour les sous-titres.</li>
              <li>Pas de point final aux titres.</li>
              <li>Structurer les niveaux avec le système décimal : 1, 1.1, 1.1.1, etc.</li>
            </ul>
            <p class="protocol-sub">2.4 Sigles et acronymes</p>
            <ul class="protocol-list">
              <li>Préparer une liste préliminaire des acronymes.</li>
              <li>Au début de chaque chapitre : nom complet suivi du sigle, puis sigle seul.</li>
            </ul>
            <p class="protocol-sub">2.5 À éviter</p>
            <ul class="protocol-list">
              <li>Points médians (sauf dans les tableaux)</li>
              <li>Soulignement ou gras dans le texte courant</li>
              <li>Styles automatiques Word, formatage excessif, coupures manuelles</li>
              <li>Justification à droite, doubles espaces, sauts de paragraphe multiples, alinéas</li>
            </ul>
            <p class="protocol-sub">2.6 Usage des italiques</p>
            <p class="protocol-p">Italiques pour : titres d'ouvrages et périodiques, mots en langue étrangère non traduits, <em>verbatim</em>, mises en relief stylistiques.</p>

            <h3 class="protocol-h">3. Chiffres, citations, tableaux et figures</h3>
            <p class="protocol-sub">3.1 Chiffres et nombres</p>
            <ul class="protocol-list">
              <li>Nombres en lettres jusqu'à <strong>dix</strong>, puis en chiffres.</li>
              <li>À partir de 1 000 : espace insécable (1 150) ; décimales avec virgule (1,5 %).</li>
            </ul>
            <p class="protocol-sub">3.2 Citations</p>
            <ul class="protocol-list">
              <li>Fidèles à la source.</li>
              <li><strong>Courtes (3 lignes maximum)</strong> : intégrées dans le texte entre guillemets.</li>
              <li><strong>Longues</strong> : paragraphe distinct en retrait sans guillemets ; utiliser « […] » pour les retraits.</li>
            </ul>
            <p class="protocol-sub">3.3 Tableaux &amp; figures</p>
            <ul class="protocol-list">
              <li>Tableaux : titre, numérotation, création via « Insertion &gt; Tableau », sources indiquées.</li>
              <li>Figures : fichier séparé haute résolution (300 dpi), titre, numéro et source requis. Formats : Excel, jpg, png, eps, tiff.</li>
            </ul>

            <h3 class="protocol-h">4. Bibliographie et références</h3>
            <p class="protocol-p">
              Style <strong>Chicago</strong> (classique) privilégié : notes de bas de page ou fin de chapitre. Chaque note inclut le prénom et le nom (majuscule) de l'auteur·rice, le titre, le lieu de publication, la maison d'édition, la date, et le cas échéant les pages consultées/citées.
            </p>
            <p class="protocol-p protocol-example">
              Exemple : Mélanie OUELLETTE, « Les Canadiens français, l'histoire et la démocratie : l'interprétation de Pierre Elliott Trudeau », <em>Mens. Revue du Centre de recherche en civilisation canadienne-française</em>, vol. 1, no 1, 2000, p. 37–50.
            </p>
            <ul class="protocol-list">
              <li><strong>Ouvrage (1 auteur·rice)</strong> : MENGUELE MENYENGUE Aristide Michel, <em>Forces occultes, religion et politique au Cameroun</em>, Verlaag, Presses Universitaires Francophones, 2014.</li>
              <li><strong>Ouvrage (2 auteur·rice·s)</strong> : LEMAIRE Louis-Philippe et TREMBLAY Bertrand, <em>Les politiques publiques au Québec</em>, Presses de l'Université Laval, Québec, 2014.</li>
              <li><strong>Ouvrage collectif</strong> : EKAMBI DIBONGUÈ Guillaume (dir.), <em>Le chef, la famille et le pouvoir</em>, Yaoundé, Ifrikiya, 2016.</li>
              <li><strong>Article de revue</strong> : TSANA NGUEGANG Ramses, « Entrepreneurs-politiciens… », <em>Cahiers d'Études africaines</em>, n° 220, 2015, pp. 811-835.</li>
              <li><strong>Thèse ou mémoire</strong> : NONO Gael Tanguy, <em>Militer dans une ville rebelle…</em>, Thèse de Doctorat Université de Douala, 2023, 429 p.</li>
              <li><strong>Source internet</strong> : KENMOGNE Faustin Marie, « Des chercheurs… », <em>Lebled-parle</em>, 11 nov. 2021, https://… (consulté le 27 oct. 2024).</li>
            </ul>

            <h3 class="protocol-h">5. Rédaction épiscène</h3>
            <p class="protocol-p">
              Les Éditions du Djembé d'Ébène recommandent la <strong>rédaction inclusive</strong> et se basent sur les normes proposées par l'Office québécois de la langue française (OQLF).
            </p>
          </div>
          <footer class="modal__foot">
            <button class="btn btn-primary" type="button" @click="closeProtocol">J’ai compris</button>
          </footer>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.protocol-btn { margin-top: 1.25rem; }
.submit-form { display: grid; gap: 1.25rem; }
fieldset.form-card { border: 1px solid var(--line); margin: 0; }
.form-card__title { font-weight: 600; font-size: 1.1rem; padding: 0; }
.field-hint { font-weight: 400; color: var(--muted); font-size: 0.78rem; }
.file-drop { display: grid; gap: 0.5rem; }
.file-drop__label {
  display: grid; place-items: center; gap: 0.6rem;
  min-height: 160px; padding: 1.5rem;
  border: 2px dashed var(--line); border-radius: var(--radius);
  cursor: pointer; color: var(--muted); text-align: center;
  transition: border-color 0.2s, background 0.2s;
}
.file-drop__label:hover { border-color: var(--green); background: color-mix(in srgb, var(--green) 4%, transparent); }
.file-drop__name { font-weight: 600; color: var(--ink-900); font-size: 0.95rem; word-break: break-all; }
.file-drop__hint { font-size: 0.88rem; line-height: 1.5; }
.btn-block { width: 100%; justify-content: center; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
.success-box { display: grid; gap: 1.1rem; justify-items: center; text-align: center; padding: 2rem 0; }
.success-box__icon { width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--green) 12%, transparent); color: var(--green); }

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--ink-950) 62%, transparent);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: start center;
  padding: clamp(1rem, 4vw, 3rem) 1rem;
  overflow-y: auto;
  animation: modal-fade 0.2s ease-out;
}
.modal {
  width: min(100%, 820px);
  max-height: min(90vh, 900px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: modal-rise 0.28s var(--ease);
}
@keyframes modal-fade { from { opacity: 0; } }
@keyframes modal-rise { from { opacity: 0; transform: translateY(14px); } }
.modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem clamp(1.25rem, 3vw, 2rem);
  border-bottom: 1px solid var(--line);
}
.modal__title {
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 600;
  color: var(--ink-950);
  line-height: 1.2;
}
.modal__close {
  flex: none;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--ink-2);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.modal__close:hover { background: var(--paper-2); border-color: var(--ink-2); color: var(--ink-950); }
.modal__body { overflow-y: auto; padding: clamp(1.25rem, 3vw, 2rem); }
.modal__foot {
  display: flex;
  justify-content: flex-end;
  padding: 1rem clamp(1.25rem, 3vw, 2rem);
  border-top: 1px solid var(--line);
  background: var(--paper);
}
.protocol-brand { text-align: center; font-style: italic; color: var(--muted); margin-bottom: 1rem; }
.protocol-p { font-size: 0.92rem; color: var(--ink-2); line-height: 1.65; }
.protocol-example { padding: 0.85rem 1rem; background: var(--paper-2); border-radius: 8px; font-size: 0.88rem; }
@media (max-width: 540px) {
  .modal { max-height: 95vh; }
  .modal__body { padding: 1rem; }
}
</style>
