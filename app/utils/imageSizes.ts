/**
 * Attributs `sizes` des couvertures pour NuxtImg (@nuxt/image v2).
 *
 * Sémantique v2 (getSizes + finaliseSizeVariants) : la CLÉ joue deux rôles.
 *  1. Media : l'entrée i porte `(max-width: clé_{i+1} - 1)`, la dernière n'a
 *     aucun media. La valeur i s'applique donc sur le bandeau
 *     [clé_i, clé_{i+1} - 1] (le premier bandeau n'a pas de borne basse).
 *  2. Base vw : pour une valeur `NNvw`, la largeur srcset est calculée à partir
 *     de la CLÉ (NN % × clé). La première clé doit donc être la largeur MAX du
 *     premier bandeau (sinon srcset est calculé pour quelques pixels) ; les
 *     clés suivantes sont la largeur MIN de leur bandeau (densité ×2 couvre le
 *     haut du bandeau). Une valeur en px est indifférente à la clé.
 *
 * Bandeaux = grilles de main.css (conteneur 1240px, gouttière max 2.5rem →
 * plafond atteint vers 1320px de viewport) :
 *   books   : 2 col <= 540 | 3 col <= 900 | 4 col au-delà (~288px)
 *   videos  : 2 col <= 900 | 3 col au-delà (~394px)
 *   news/memoirs/cahiers : 1 col <= 540 | 2 col <= 900 | 3 col au-delà (~395px)
 * Toute modification des grilles se répercute ici.
 */
export const BOOK_SIZES = '540:45vw,541:30vw,901:22vw,1320:290px'
export const VIDEO_SIZES = '900:46vw,901:31vw,1320:400px'
export const GRID3_SIZES = '540:92vw,541:46vw,901:31vw,1320:400px'
/** Plaque du hero : cover en pleine largeur de la plaque — ~210px à 901vw, ~330px >=1320 (masquée <= 900px). */
export const HOME_FEATURED_SIZES = '901:210px,1320:330px'
/** Couverture « à la une » du catalogue : 260px en colonne, 200px empilée <= 759px. */
export const CATALOGUE_FEATURED_SIZES = '1:200px,760:260px'
/** Article à la une : pleine largeur empilée <= 859px, ~656px en colonne 1.3fr. */
export const FEATURED_ARTICLE_SIZES = '859:92vw,860:660px'
