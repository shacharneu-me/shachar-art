import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'
import { JsonLd } from '@/components/json-ld'
import { PageHeading } from '@/components/page-heading'
import { RichText } from '@/components/rich-text'
import { SanityImage } from '@/components/sanity-image'
import { absoluteUrl, fallbackArtistName, shell, siteUrl } from '@/lib/site'
import { excerpt, toPlainText } from '@/lib/text'
import { getAbout, getSettings } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, about] = await Promise.all([getSettings(), getAbout()])
  const artistName = settings?.artistName || fallbackArtistName
  const title = [artistName, settings?.role].filter(Boolean).join(' — ')
  const description =
    about?.seoDescription ||
    settings?.siteDescription ||
    excerpt(toPlainText(about?.text)) ||
    `Selected works and exhibitions by ${artistName}.`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/' },
    openGraph: { title, description, url: '/' },
  }
}

export default async function AboutPage() {
  const [settings, about] = await Promise.all([getSettings(), getAbout()])
  const artistName = settings?.artistName || fallbackArtistName
  const hasImage = Boolean(about?.image?.asset?.url)

  return (
    <div className={shell}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': `${siteUrl}/#person`,
              name: artistName,
              ...(settings?.role ? { jobTitle: settings.role } : {}),
              ...(settings?.email ? { email: settings.email } : {}),
              ...(settings?.instagram ? { sameAs: [settings.instagram] } : {}),
              description: excerpt(toPlainText(about?.text), 300) || undefined,
              url: absoluteUrl('/'),
            },
            {
              '@type': 'WebSite',
              '@id': `${siteUrl}/#website`,
              name: artistName,
              url: absoluteUrl('/'),
              inLanguage: 'en',
              about: { '@id': `${siteUrl}/#person` },
            },
          ],
        }}
      />

      <PageHeading
        eyebrow={about?.heading || 'About'}
        title={artistName}
        subtitle={settings?.role}
        size="display"
      />

      {about?.text?.length || hasImage ? (
        <div
          className={`hairline grid gap-8 py-8 sm:py-10 md:gap-12 ${
            hasImage ? 'md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]' : ''
          }`}
        >
          {hasImage ? (
            <SanityImage
              image={about?.image}
              fallbackAlt={artistName}
              sizes="(min-width: 768px) 40vw, 92vw"
              className="h-auto w-full"
              priority
            />
          ) : null}
          <RichText value={about?.text} />
        </div>
      ) : (
        <EmptyState label="your about text and image" />
      )}
    </div>
  )
}
