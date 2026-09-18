import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'
import { JsonLd } from '@/components/json-ld'
import { SanityImage } from '@/components/sanity-image'
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
  const hasImage = Boolean(settings?.landingImage?.asset?.url)

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
        {hasImage ? (
          <SanityImage
            image={settings?.landingImage}
            fallbackAlt={artistName}
            sizes="100vw"
            className="h-auto w-full"
            priority
          />
        ) : (
          <EmptyState label="a landing image" />
        )}
      </div>
    </div>
  )
}
