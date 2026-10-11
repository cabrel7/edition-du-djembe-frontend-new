export interface Book {
  id: number
  title: string
  author: string
  category: number
  cover: string | null
  description: string | null
  published_date: string | null
  price: string | number | null
  slug: string | null
  isbn: string | null
  amazon_url: string | null
  pages: number | null
  language: string | null
  publisher: string | null
  edition: string | null
}

export interface Article {
  id: number
  title: string
  excerpt: string | null
  content: string | null
  category: number
  image: string | null
  published_date: string | null
  author: string | null
  slug: string | null
  tags: string[] | null
  views_count: number | null
}

export interface Memoir {
  id: number
  title: string
  author: string
  university: string | null
  domain: number
  year: number | null
  abstract: string | null
  keywords: string[] | null
  supervisor: string | null
  grade: string | null
  cover: string | null
}

export interface Video {
  id: number
  title: string
  slug: string | null
  description: string | null
  video_url: string
  thumbnail: string | null
}

export interface NamedTaxonomy {
  id: number
  name: string
}

export interface BootData {
  domaine: NamedTaxonomy[]
  categories: NamedTaxonomy[]
  books: Book[]
  booknexturl: string | null
  hasmorebook: boolean
  articles: Article[]
  articlenexturl: string | null
  hasmorearticle: boolean
  memoirs: Memoir[]
  memoirnexturl: string | null
  hasmorememoir: boolean
  video: Video[]
  videonextUrl: string | null
  hasmorevideo: boolean
}

export interface PressReview {
  id: number
  title: string
  slug: string
  summary: string | null
  category: string
  cover_image: string | null
  published_at: string | null
  author: string | null
}
