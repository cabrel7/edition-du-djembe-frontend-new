<script setup lang="ts">
definePageMeta({ hero: 'light' })

useHead({ title: 'Services — Les Éditions du Djembé d’Ébène' })

const services = [
  {
    id: 'edition',
    icon: 'book',
    title: 'Édition Traditionnelle',
    description: 'Accompagnement complet pour la publication de vos ouvrages, de la correction à la distribution.',
    features: ['Correction et relecture professionnelle', 'Mise en page et conception graphique', 'Impression papier de qualité', 'Distribution en librairies'],
  },
  {
    id: 'correction',
    icon: 'file-check',
    title: 'Correction et Relecture',
    description: 'Un travail minutieux sur vos textes pour garantir leur qualité linguistique et stylistique.',
    features: ['Correction orthographique et grammaticale', 'Relecture syntaxique et stylistique', 'Harmonisation typographique', 'Conseils éditoriaux personnalisés'],
  },
  {
    id: 'impression',
    icon: 'printer',
    title: 'Impression et Fabrication',
    description: 'Fabrication de vos ouvrages avec des matériaux de première qualité.',
    features: ['Choix des papiers et couvertures', 'Reliure professionnelle', 'Impression numérique et offset', 'Packaging et expédition'],
  },
  {
    id: 'numerique',
    icon: 'hash',
    title: 'Édition Numérique',
    description: 'Création et distribution de vos ouvrages au format numérique (PDF, EPUB, etc.).',
    features: ['Conversion aux formats numériques', 'Mise en page adaptative', 'Distribution sur les plateformes en ligne', 'Protection des droits d’auteur'],
  },
  {
    id: 'universitaire',
    icon: 'graduation',
    title: 'Édition Universitaire',
    description: 'Publication spécialisée pour les travaux de recherche, thèses et mémoires académiques.',
    features: ['Comité de lecture spécialisé', 'Normes académiques respectées', 'Indexation dans les bases de données', 'Distribution institutionnelle'],
  },
  {
    id: 'traduction',
    icon: 'languages',
    title: 'Traduction',
    description: 'Ce processus essentiel permet de diffuser des livres, essais, revues et autres contenus à un public international.',
    features: ['Traduction littéraire', 'Localisation', 'Révision et contrôle qualité', 'Post-édition'],
  },
]

const processSteps = [
  { step: '01', title: 'Consultation', description: 'Étude de votre projet et de vos objectifs' },
  { step: '02', title: 'Évaluation', description: 'Analyse du manuscrit et proposition éditoriale' },
  { step: '03', title: 'Production', description: 'Correction, mise en page et impression' },
  { step: '04', title: 'Distribution', description: 'Mise en vente et promotion de l’ouvrage' },
]

const faqs = [
  { q: 'Comment proposer un manuscrit aux Éditions du Djembé d’Ébène ?', a: 'Rendez-vous sur la page « Soumettre un manuscrit ». Remplissez le formulaire en ligne, téléversez votre fichier PDF et ajoutez un résumé. Un retour du comité de lecture vous sera donné sous 6 à 8 semaines.' },
  { q: 'Quels sont vos délais de publication ?', a: 'Après acceptation du manuscrit, le processus complet prend généralement entre 6 et 9 mois (édition, correction, mise en page, impression). Les délais peuvent varier selon le travail éditorial et la période de l’année.' },
  { q: 'Quels formats proposez-vous ?', a: 'Nous publions en format papier (broché) et numérique (e-book EPUB/PDF). Vous pourrez indiquer votre préférence lors de la signature du contrat.' },
  { q: 'Comment sont fixés vos tarifs et vos droits d’auteur ?', a: 'Nous fonctionnons à compte d’éditeur et à compte auteur. Tous les détails financiers et contractuels sont précisés dans le contrat d’édition.' },
  { q: 'Puis-je commander directement vos ouvrages ?', a: 'Oui, il est possible de commander directement via notre boutique en ligne.' },
  { q: 'Comment suivre une commande ou un pré-achat ?', a: 'Après paiement, vous recevez un email de confirmation avec un numéro de suivi pour les envois physiques ou un lien de téléchargement pour les e-books. Pour toute question, contactez-nous via la page Contact, par email ou par appel direct.' },
  { q: 'Organisez-vous des ateliers ou des conférences ?', a: 'Oui, nous proposons régulièrement des ateliers d’écriture, des conférences et des résidences. Consultez la page Actualités pour le calendrier.' },
  { q: 'Comment devenir partenaire ou librairie affiliée ?', a: 'Nous collaborons avec librairies, bibliothèques, festivals et universités. Envoyez-nous un email présentant votre structure, vos attentes et votre proposition de partenariat.' },
  { q: 'Quels sont vos critères de sélection éditoriale ?', a: 'Nous privilégions les voix fortes et authentiques, une écriture engagée et esthétique. Nos axes éditoriaux principaux sont : littérature, poésie, essais & pensée critique, jeunesse et voix de la diaspora.' },
  { q: 'Comment rester informé de vos nouveautés ?', a: 'Abonnez-vous à notre newsletter « Rejoignez le cercle du Djembé », suivez-nous sur nos réseaux sociaux, ou consultez régulièrement notre rubrique Actualités.' },
]
</script>

<template>
  <main>
    <PageHero
      eyebrow="Services"
      title="Un accompagnement complet"
      lead="De la première ligne à la dernière page — édition, correction, impression et diffusion."
    />

    <section class="section section-paper">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Notre savoir-faire</p>
          <h2 class="h2">Six pôles d’expertise</h2>
        </div>

        <ul class="index-list">
          <li v-for="(s, i) in services" :id="s.id" :key="s.title" class="index-list__item">
            <a :href="`#${s.id}`" class="index-list__link" @click.prevent>
              <span class="index-list__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="index-list__name">{{ s.title }}</span>
              <AppIcon name="arrow-right" :size="18" class="index-list__arrow" />
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Le détail</p>
          <h2 class="h2">Ce que nous faisons</h2>
        </div>

        <div class="services-grid">
          <article v-for="s in services" :id="`detail-${s.id}`" :key="s.title" class="service-card">
            <span class="service-card__icon"><AppIcon :name="s.icon" :size="24" /></span>
            <h3 class="service-card__title">{{ s.title }}</h3>
            <p class="service-card__text">{{ s.description }}</p>
            <ul class="feature-list">
              <li v-for="f in s.features" :key="f">{{ f }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-warm">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Notre processus</p>
          <h2 class="h2">Quatre étapes clés</h2>
          <p class="lead">Un accompagnement structuré pour garantir le succès de votre projet éditorial.</p>
        </div>
        <div class="process-grid">
          <article v-for="p in processSteps" :key="p.step" class="process-step">
            <div class="process-step__num">{{ p.step }}</div>
            <h3 class="process-step__title">{{ p.title }}</h3>
            <p class="process-step__text">{{ p.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container-narrow cta-block" style="text-align:center">
        <h2 class="h2">Besoin d'un devis personnalisé ?</h2>
        <p class="lead" style="margin-inline:auto;color:var(--on-dark-2)">
          Chaque projet est unique. Contactez-nous pour discuter de vos besoins et recevoir une proposition adaptée.
        </p>
        <div class="cta-actions">
          <NuxtLink to="/contact" class="btn btn-light">Demander un devis</NuxtLink>
          <NuxtLink to="/soumettre-mon-travail" class="btn btn-ghost">Soumettre un manuscrit</NuxtLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">FAQ</p>
          <h2 class="h2">Questions fréquentes</h2>
        </div>
        <div class="faq-list">
          <article v-for="f in faqs" :key="f.q" class="faq-item">
            <h3 class="faq-item__q">{{ f.q }}</h3>
            <p class="faq-item__a">{{ f.a }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.2rem, 2vw, 1.8rem); }
@media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) { .services-grid { grid-template-columns: 1fr; } }
.service-card { display: grid; gap: 0.55rem; padding: clamp(1.25rem, 2vw, 1.75rem); background: var(--ivory); border: 1px solid var(--line); border-radius: var(--radius); }
.service-card__icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 12px; background: color-mix(in srgb, var(--green) 10%, transparent); color: var(--green); }
.service-card__title { font-size: 1.15rem; font-weight: 700; color: var(--ink-900); margin-top: 0.25rem; }
.service-card__text { font-size: 0.95rem; color: var(--ink-2); line-height: 1.6; }
.cta-block { display: grid; gap: 1.25rem; justify-items: center; }
.cta-actions { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-top: 0.5rem; }
</style>
