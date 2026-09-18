import type { Metadata } from 'next'

import { JsonLd } from '@/components/json-ld'
import { fallbackArtistName, siteUrl } from '@/lib/site'
import { getSettings } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName
  const description =
    settings?.siteDescription || `Selected works and exhibitions by ${artistName}.`

  return {
    title: { absolute: artistName },
    description,
    alternates: { canonical: '/' },
    openGraph: { title: artistName, description, url: '/' },
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
          url: `${siteUrl}/`,
          inLanguage: 'en',
        }}
      />
      <h1 className="sr-only">{artistName}</h1>
    </div>
  )
}
