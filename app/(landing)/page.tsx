import type { Metadata } from 'next'

import { JsonLd } from '@/components/json-ld'
import { absoluteUrl, fallbackArtistName, hebrewArtistName, siteUrl } from '@/lib/site'
import { getSettings } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName
  const description =
    settings?.siteDescription || `Selected works and exhibitions by ${artistName}.`
  // Both spellings, so a search in either language lands here.
  const title = `${artistName} | ${hebrewArtistName}`

  return {
    title: { absolute: title },
    description: `${description} ${hebrewArtistName}.`,
    alternates: { canonical: '/' },
    openGraph: { title, description, url: '/' },
  }
}

/** The image and header are drawn by the curtain in the root layout, which stays
 *  mounted through navigation so it can lift away and uncover the next page. */
export default async function LandingPage() {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName

  return (
    <div className="h-dvh">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          name: artistName,
          alternateName: hebrewArtistName,
          url: `${siteUrl}/`,
          inLanguage: 'en',
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: artistName,
          alternateName: hebrewArtistName,
          url: absoluteUrl('/about'),
        }}
      />
      <h1 className="sr-only">
        {artistName} <span lang="he">{hebrewArtistName}</span>
      </h1>
    </div>
  )
}
