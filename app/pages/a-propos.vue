<script setup lang="ts">
definePageMeta({ hero: 'light' })

useHead({ title: 'À propos' })

const history = `Les Éditions du Djembé d'Ébène sont nées en 2025 de la conviction de leur fondateur, Dr Nono Gaël Tanguy, qu'un nombre considérable de travaux d'envergure — mémoires, thèses et essais universitaires sur l'éveil, le changement et la contribution sociétale — demeurent trop souvent confinés aux étagères des bibliothèques et aux tiroirs de leurs auteur·rice·s. Frustré de voir ces recherches de haute qualité inaccessibles au public, il a décidé de créer une maison d'édition indépendante dont la vocation première est de faire éclore ces idées pertinentes. Rapidement, cette initiative s'est élargie pour accueillir non seulement des publications académiques, mais également des romans engagés, de la poésie militante et d'autres genres porteurs de sens.`

const mission = `La mission du Djembé d'Ébène est simple et ambitieuse : sortir du domaine fermé de l'université et des cercles savants les écrits qui interrogent, inspirent et éveillent les consciences. Nous offrons un accompagnement éditorial complet — de la relecture universitaire à la mise en page, de l'ISBN à la diffusion en librairies et plateformes numériques — afin de garantir à chaque auteur, qu'il vienne du monde de la recherche ou de la création littéraire, une visibilité et une portée maximale.`

const vision = `Devenir la référence de l'édition francophone en matière de qualité éditoriale et d'accompagnement des auteurs, tout en contribuant activement à la promotion du savoir.`

const values = `Portée par l'image du djembé — instrument d'alerte, de lien et d'éveil — et par l'ébène — symbole de résistance et de noblesse —, notre maison défend une édition fière, exigeante et engagée.`

const symbolism = `Chaque récit est un tambour, chaque livre un battement. Notre vocation est de faire résonner la parole des afro-descendants, enracinée dans la mémoire, tendue vers l'avenir. Inspirés par le djembé, instrument d'appel, de rythme et de transmission, et par le bois d'ébène, symbole de noblesse, de profondeur et de résistance, nous défendons une édition exigeante, poétique et libre.`

const founderQuote = `Notre mission est de donner une voix aux idées qui méritent d'être partagées, et une plateforme aux auteurs qui ont quelque chose à dire au monde.`

const coreValues = [
  { icon: 'award', title: 'Excellence', description: 'Nous visons la plus haute qualité dans chacune de nos publications.' },
  { icon: 'users', title: 'Accompagnement', description: 'Un suivi personnalisé pour chaque auteur, à chaque étape du projet.' },
  { icon: 'book', title: 'Accessibilité', description: 'Rendre le savoir accessible au plus grand nombre est notre priorité.' },
  { icon: 'heart', title: 'Passion', description: "L'amour des livres et de la transmission anime notre équipe." },
]

</script>

<template>
  <main>
    <PageHero
      eyebrow="La maison"
      title="Faire résonner l’invisible"
      lead="Une maison d’édition indépendante dédiée aux voix africaines et diasporiques, fondée en 2025 à Québec."
    />

    <!-- Histoire -->
    <section class="section section-paper">
      <div class="container about-history">
        <div class="about-history__text">
          <p class="eyebrow">Notre histoire</p>
          <h2 class="h2" style="margin-top:0.75rem">Née d’une conviction</h2>
          <p class="detail-prose">{{ history }}</p>
        </div>
        <div class="about-history__visual" aria-hidden="true">
          <AppIcon name="book" :size="64" />
        </div>
      </div>
    </section>

    <!-- Mission / Vision / Valeurs -->
    <section class="section section-warm">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">Ce qui nous guide</p>
          <h2 class="h2">Mission, vision & valeurs</h2>
        </div>
        <div class="stat-grid">
          <article class="stat-card">
            <span class="stat-card__icon"><AppIcon name="target" :size="22" /></span>
            <h3 class="stat-card__title">Notre Mission</h3>
            <p class="stat-card__text">{{ mission }}</p>
          </article>
          <article class="stat-card">
            <span class="stat-card__icon"><AppIcon name="eye" :size="22" /></span>
            <h3 class="stat-card__title">Notre Vision</h3>
            <p class="stat-card__text">{{ vision }}</p>
          </article>
          <article class="stat-card">
            <span class="stat-card__icon"><AppIcon name="heart" :size="22" /></span>
            <h3 class="stat-card__title">Nos Valeurs</h3>
            <p class="stat-card__text">{{ values }}</p>
          </article>
        </div>
        <article class="stat-card" style="margin-top:clamp(1rem,2vw,1.5rem)">
          <h3 class="stat-card__title">La symbolique</h3>
          <p class="stat-card__text">{{ symbolism }}</p>
        </article>
      </div>
    </section>

    <!-- Ce qui nous définit -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <p class="eyebrow">Ce qui nous définit</p>
          <h2 class="h2">Quatre piliers</h2>
        </div>
        <div class="value-grid">
          <article v-for="v in coreValues" :key="v.title" class="value-card">
            <span class="value-card__icon"><AppIcon :name="v.icon" :size="24" /></span>
            <h3 class="value-card__title">{{ v.title }}</h3>
            <p class="value-card__text">{{ v.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Fondateur -->
    <section class="section section-dark">
      <div class="container-narrow founder">
        <p class="eyebrow">Fondateur</p>
        <h2 class="h2" style="margin-top:0.75rem;color: var(--paper)">Dr Nono Gaël Tanguy</h2>
        <blockquote class="founder__quote">« {{ founderQuote }} »</blockquote>
        <p class="founder__bio">
          Passionné par la diffusion du savoir et la promotion des auteurs, il a créé Les Éditions du Djembé d'Ébène avec la conviction que chaque voix mérite d'être entendue.
        </p>
      </div>
    </section>

    <!-- Mentions légales -->
    <section class="section section-paper">
      <div class="container-narrow">
        <p class="eyebrow">Mentions légales</p>
        <h2 class="h2" style="margin-top:0.75rem">Éditeur & propriété</h2>
        <div class="legal" style="margin-top:1.25rem">
          <h3 class="protocol-h">Éditeur</h3>
          <p class="detail-prose">
            Les Éditions du Djembé d'Ébène
            12263 boulevard Saint Claude
            Québec, Canada
            Directeur de la publication : Dr Nono Gaël Tanguy
          </p>
          <h3 class="protocol-h">Propriété intellectuelle</h3>
          <p class="detail-prose">
            L'ensemble du contenu de ce site (textes, images, vidéos, etc.) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-history { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: clamp(1.5rem, 4vw, 3.5rem); align-items: center; }
.about-history__text { display: grid; gap: 1rem; }
.about-history__visual { aspect-ratio: 4/3; border-radius: var(--radius); background: linear-gradient(145deg, var(--paper-2), var(--paper)); border: 1px solid var(--line); display: grid; place-items: center; color: var(--green); }
.founder { text-align: center; display: grid; gap: 1rem; justify-items: center; }
.founder__quote { margin: 1rem 0 0; padding: 1.25rem 1.75rem; border-left: 3px solid var(--gold); font-size: 1.2rem; font-style: italic; color: var(--paper); text-align: left; max-width: 58ch; }
.founder__bio { color: var(--on-dark-2); max-width: 54ch; line-height: 1.65; }
.legal { display: grid; gap: 0.5rem; }
.protocol-h { font-weight: 700; font-size: 1.05rem; margin-top: 1.25rem; margin-bottom: 0.4rem; color: var(--ink-900); }
@media (max-width: 760px) {
  .about-history { grid-template-columns: 1fr; }
  .about-history__visual { display: none; }
}
</style>
