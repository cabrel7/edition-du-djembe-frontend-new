# Design — Espace public « Les Éditions du Djembé »

Proposition contextualisée, inspirée du code réel de Les Mielleries (Nuxt, Fraunces+Inter,
tokens CSS, reveals IO, hero vidéo + GSAP). Validée par le user avant implémentation.

## 1. Direction : « La bibliothèque vivante »

L'espace public devient une **galerie éditoriale** : l'univers du miel (ambre, ruche,
terroir) se traduit en univers **maison d'édition culturelle** : encre vert-nuit,
or typographique, papier crème, livres traités comme des objets d'art. Le mouvement
est sobre mais continu — rien ne clignote, tout respire.

Invariants du brief ui-ux : un point focal par section, états loading/empty/error
sur chaque donnée serveur, contraste AA, `prefers-reduced-motion` respecté,
zéro couleur en dur (tokens uniquement), cibles ≥ 44px.

## 2. Tokens (traduction du système Mielleries)

### Palette — encre & papier
| Token Mielleries | Token Djembé | Valeur | Rôle |
|---|---|---|---|
| honey-950 | `--ink-950` | `#0C1A12` | fond HTML (rebord iOS), footer |
| honey-900 | `--ink-900` | `#12241A` | sections sombres (hero, vidéo, presse) |
| honey-800 | `--ink-800` | `#1A3223` | surfaces élevées sur sombre |
| honey-700 | `--ink-700` | `#274733` | bordures sur sombre, hover |
| orange | `--gold` | `#D4A437` | accent primaire (CTA, italiques, liens) |
| orange-600 | `--gold-600` | `#B8922D` | hover CTA |
| yellow | `--gold-300` | `#E8C96A` | accents sur sombre (équiv. jaune) |
| — | `--clay` | `#C4562A` | accent secondaire terracotta (badges, catégories) |
| cream | `--paper` | `#F5EFE2` | sections respiration |
| cream-2 | `--paper-2` | `#EDE4D0` | surfaces sur crème |
| ivory | `--ivory` | `#FBF7EE` | fond body clair |
| ink | `--ink` | `#14201A` | texte principal sur clair |
| ink-2 | `--ink-2` | `#4A5C50` | texte secondaire |
| muted | `--muted` | `#6B7C6F` | metadata |
| line | `--line` | `rgba(20,32,26,.12)` | traits sur clair |
| line-light | `--line-light` | `rgba(245,239,226,.16)` | traits sur sombre |

Le vert profond reprend l'ADN vert actuel de la marque (hero « Faire résonner
l'invisible ») ; l'or remplace l'orange miel — plus « prix littéraire », plus
maison d'édition.

### Typographie — identique à l'inspo
- `--font-display` : **Fraunces Variable** (@fontsource, axes SOFT 50) — titres, prix, hero.
- `--font-body` : **Inter Variable** — texte, UI.
- Échelle fluide `clamp()` : `--step--1 … --step-5` (copier la table Mielleries telle quelle).
- Règle signature : **un mot en `em.accent`** (Fraunces italic, couleur or) par titre majeur.

### Système de layout — identique à l'inspo
`.container` (1240px), `.container-narrow` (820px), `.section` / `.section-dark` /
`.section-cream` alternés, `.eyebrow` (label uppercase + trait), `.section-head`,
`.lead`, `.btn` pilule + balayage lumineux au hover, `.link-arrow`, `.chip`.
Rayons 18/28px, `--ease: cubic-bezier(.22,1,.36,1)`, `--shadow` / `--shadow-lg`
teintés vert-nuit (pas de gris).

### Motion — le kit Mielleries, adapté
| Pattern | Implémentation | Usage |
|---|---|---|
| `.reveal` (IO) | opacity + translateY(28px), delay `--d` | toutes sections |
| `.reveal-img` | clip-path inset + scale 1.06 | visuels éditoriaux |
| Page transition | Nuxt `pageTransition` out-in 0.35s | global |
| Hero lines | masque overflow + translateY 110% (CSS anim au load) | H1 hero |
| Marquee | dual-track CSS infini | bandeau titres/mots |
| Hero scroll | parallax léger (media scale 1.1, contenu fade-up) | hero |
| Book tilt | perspective + rotateY 6° au hover, ombre portée | cartes livres |
| Lenis | scroll doux (option, activable) | global |

`prefers-reduced-motion` : tout coupé (règle globale, comme l'inspo).
**Pas de GSAP au départ** — CSS + 1 composable IO (`useReveal`) + `@vueuse/motion`
si besoin ponctuel. Si le hero l'exige, GSAP limité au seul hero.

### Composants vidéo — reprendre `BgVideo.vue` tel quel
Poster en fond, fondu vidéo au playing, coupure saveData/2G/reduced-motion,
source mobile dédiée. Prêt pour une future vidéo d'ambiance (librairie, djembé,
pages qui tournent) ; en attendant, image seule + Ken Burns discret.

## 3. Spécificités « édition » (notre univers)

- **BookCard** : ratio 2:3, tilt 3D, spine (liseré or sur la tranche gauche),
  ombre profonde, titre Fraunces, auteur Inter muted, prix or. État skeleton/empty.
- **Bandeau marquee** : `Titres récents · Cahiers du Djembé · Mémoires · …` + glyphe
  djembé/étoile (SVG maison, pas d'emoji).
- **Sections accueil** (ordre) : hero immersif → manifeste/chiffres (bandeau or) →
  Nouvelles publications (carrousel BookCard) → Collections (grande section crème,
  imagery) → Cahiers du Djembé (une éditoriale) → Mémoires (galerie sobre) →
  Vidéos (grille play immersif) → Manifeste + photo → CTA soumission → footer riche.
- **Fiche livre** : hero couverture (grand tilt + halo or), métadonnées en colonne
  éditoriale, CTA Amazon pilule or, extraits PDF via endpoint dédié.
- **Lecture articles** : `container-narrow`, Fraunces pour les pull-quotes,
  ligne de lecture 65ch max.
- **Vidéos** : grille + ouverture lecteur en overlay animé (focus trap, Esc).

## 4. Architecture (rappel)

- App `web/` Nuxt 4, SSR, API Laravel existante (`API.md`), `useFetch` server-side
  sur `/api/data/null` (boot) + pagination curseur load-more.
- Modules : `@nuxt/image`, `@vueuse/nuxt` (+ `lenis` option). Fonts via @fontsource
  (auto-hébergées, zéro Google Fonts call).
- SEO : meta/OG par page (titre, description, image cover), sitemap, canonical
  (`runtimeConfig.public.siteUrl`), JSON-LD `Book`/`Article` plus tard.
- Admin : reste sur l'app Vue `frontend/` (sous-domaine dédié), hors périmètre.

## 5. Anti-patterns bannis (checklist ui-ux)

Cards partout · boutons fantômes en série · gradients violets · skeletons à répétition ·
modals pour tout · emojis-icônes · padding géant sans densité · centrage systématique ·
placeholder=label · toasts pour erreurs de formulaire (messages inline sous champ).
