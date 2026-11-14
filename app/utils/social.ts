export interface SocialLink {
  name: string
  label: string
  href: string
  icon: string
}

/** Profils officiels de la maison (repris de l'ancien site). */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { name: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1NX7SYkGeL/', icon: 'facebook' },
  { name: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/les-%C3%A9ditions-du-djemb%C3%A9-d%E2%80%99%C3%A9b%C3%A8ne', icon: 'linkedin' },
  { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/editiondudjembe?igsh=bm82MGs5bjlraHk5', icon: 'instagram' },
]
