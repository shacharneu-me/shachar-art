import type { Metadata } from 'next'

import { JsonLd } from '@/components/json-ld'
import { ScrollGate } from '@/components/scroll-gate'
import {
  absoluteUrl,
  cleanProfileUrl,
  fallbackArtistName,
  hebrewArtistName,
  siteUrl,
} from '@/lib/site'
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
  const instagram = cleanProfileUrl(settings?.instagram)

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
          // Ties the site to the profile, which carries the Hebrew name in view.
          ...(instagram ? { sameAs: [instagram] } : {}),
          url: absoluteUrl('/about'),
        }}
      />
      {/* Scrolling down off the image carries on into the works. */}
      <ScrollGate to="/works" edge="bottom" />
      <h1 className="sr-only">
        {artistName} <span lang="he">{hebrewArtistName}</span>
      </h1>
    </div>
  )
}
