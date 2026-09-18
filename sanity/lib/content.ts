import { cache } from 'react'

import { sanityFetch } from '@/sanity/lib/fetch'
import {
  aboutQuery,
  cvQuery,
  exhibitionQuery,
  exhibitionSlugsQuery,
  exhibitionsQuery,
  settingsQuery,
  worksQuery,
} from '@/sanity/lib/queries'
import type {
  About,
  Cv,
  Exhibition,
  ExhibitionListItem,
  Settings,
  Work,
} from '@/sanity/lib/types'

/**
 * `cache` keeps a page's `generateMetadata` and its render from querying twice.
 */

export const getSettings = cache(() =>
  sanityFetch<Settings | null>({ query: settingsQuery, fallback: null }),
)

export const getAbout = cache(() => sanityFetch<About | null>({ query: aboutQuery, fallback: null }))

export const getCv = cache(() => sanityFetch<Cv | null>({ query: cvQuery, fallback: null }))

export const getWorks = cache(() => sanityFetch<Work[]>({ query: worksQuery, fallback: [] }))

export const getExhibitions = cache(() =>
  sanityFetch<ExhibitionListItem[]>({ query: exhibitionsQuery, fallback: [] }),
)

export const getExhibition = cache(async (slug: string) => {
  const exhibition = await sanityFetch<Exhibition | null>({
    query: exhibitionQuery,
    params: { slug },
    fallback: null,
  })

  if (!exhibition) return null

  // A reference to a deleted work comes back as null.
  return { ...exhibition, works: (exhibition.works ?? []).filter(Boolean) }
})

export const getExhibitionSlugs = cache(() =>
  sanityFetch<{ slug: string }[]>({ query: exhibitionSlugsQuery, fallback: [] }),
)
