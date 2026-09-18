import type { PortableTextBlock } from '@portabletext/types'

export type SanityImage = {
  _key?: string
  alt?: string | null
  caption?: string | null
  hotspot?: { x: number; y: number } | null
  asset?: {
    _id: string
    url: string
    metadata?: {
      lqip?: string | null
      dimensions?: { width: number; height: number; aspectRatio: number } | null
    } | null
  } | null
}

export type Settings = {
  artistName: string
  role?: string | null
  siteDescription?: string | null
  email?: string | null
  instagram?: string | null
  socialImage?: SanityImage | null
}

export type About = {
  heading?: string | null
  image?: SanityImage | null
  text?: PortableTextBlock[] | null
  seoDescription?: string | null
}

export type Cv = {
  heading?: string | null
  text?: PortableTextBlock[] | null
  file?: { url: string; originalFilename?: string | null } | null
  seoDescription?: string | null
}

/** The exhibition reference shown inside a work's modal. */
export type WorkExhibitionLink = {
  _id: string
  title: string
  slug: string
  dateText?: string | null
}

export type Work = {
  _id: string
  title: string
  displayDate: string
  materials?: string | null
  text?: PortableTextBlock[] | null
  coverImage?: SanityImage | null
  images?: SanityImage[] | null
  exhibition?: WorkExhibitionLink | null
}

export type ExhibitionListItem = {
  _id: string
  title: string
  slug: string
  dateText: string
  venue?: string | null
  workCount: number
}

export type Exhibition = {
  _id: string
  title: string
  slug: string
  dateText: string
  venue?: string | null
  curatorialText?: PortableTextBlock[] | null
  coverImage?: SanityImage | null
  seoDescription?: string | null
  works: Work[]
}
