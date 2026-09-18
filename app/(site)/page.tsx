import type { Metadata } from 'next'

import { JsonLd } from '@/components/json-ld'
import { fallbackArtistName, shell, siteUrl } from '@/lib/site'
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

export default async function LandingPage() {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName

  return (
    <div className={shell}>
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

      <div className="py-8 sm:py-10">
        <div className="hairline flex aspect-[4/5] items-center justify-center border border-dashed border-rule text-nav tracking-[0.14em] text-muted uppercase sm:aspect-[16/10]">
          Landing image
        </div>
      </div>
    </div>
  )
}
