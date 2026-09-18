import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'
import { getExhibitionSlugs } from '@/sanity/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getExhibitionSlugs()
  const lastModified = new Date()

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/works`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/exhibitions`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/cv`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
    ...slugs
      .filter(({ slug }) => Boolean(slug))
      .map(({ slug }) => ({
        url: `${siteUrl}/exhibitions/${slug}`,
        lastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.7,
      })),
  ]
}
