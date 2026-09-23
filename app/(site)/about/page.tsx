import type { Metadata } from 'next'
import Link from 'next/link'

import { EmptyState } from '@/components/empty-state'
import { JsonLd } from '@/components/json-ld'
import { RichText } from '@/components/rich-text'
import { SanityImage } from '@/components/sanity-image'
import {
  absoluteUrl,
  cleanProfileUrl,
  fallbackArtistName,
  hebrewArtistName,
  shell,
  siteUrl,
} from '@/lib/site'
import { excerpt, toPlainText } from '@/lib/text'
import { getAbout, getSettings } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, about] = await Promise.all([getSettings(), getAbout()])
  const artistName = settings?.artistName || fallbackArtistName
  const description =
    about?.seoDescription ||
    settings?.siteDescription ||
    excerpt(toPlainText(about?.text)) ||
    `About ${artistName}.`

  return {
    title: 'About',
    description,
    alternates: { canonical: '/about' },
    openGraph: { title: `About — ${artistName}`, description, url: '/about' },
  }
}

const contactLink =
  'underline decoration-1 underline-offset-4 transition-colors hover:text-muted'

export default async function AboutPage() {
  const [settings, about] = await Promise.all([getSettings(), getAbout()])
  const artistName = settings?.artistName || fallbackArtistName
  const hasImage = Boolean(about?.image?.asset?.url)
  const instagram = cleanProfileUrl(settings?.instagram)
  // Gmail ignores capitals, and lower case sits quieter at reading size.
  const email = settings?.email?.trim().toLowerCase()

  return (
    <div className={shell}>
      <h1 className="sr-only">{about?.heading || 'About'}</h1>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: artistName,
          alternateName: hebrewArtistName,
          ...(settings?.role ? { jobTitle: settings.role } : {}),
          ...(settings?.email ? { email: settings.email } : {}),
          ...(instagram ? { sameAs: [instagram] } : {}),
          description: excerpt(toPlainText(about?.text), 300) || undefined,
          url: absoluteUrl('/about'),
        }}
      />

      {about?.text?.length || hasImage ? (
        <div
          className={`grid gap-8 py-8 sm:py-12 md:gap-12 ${
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
          <div>
            <RichText value={about?.text} />
            {/* The footer carries these too, but a reader who stops at the end
                of the text should not have to go looking for them. */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-nav tracking-[0.1em] uppercase">
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className={contactLink}>
                    {email}
                  </a>
                </li>
              ) : null}
              {instagram ? (
                <li>
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={contactLink}
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>
            {/* A line below, so it is not read as one of the ways to reach him. */}
            <p className="mt-2 text-nav tracking-[0.1em] uppercase">
              <Link href="/cv" className={contactLink}>
                CV
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <EmptyState label="your about text and image" />
      )}
    </div>
  )
}
