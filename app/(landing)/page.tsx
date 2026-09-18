import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { EmptyState } from '@/components/empty-state'
import { JsonLd } from '@/components/json-ld'
import { fallbackArtistName, navItems, shell, siteUrl } from '@/lib/site'
import { imageBlur, imagePosition, imageUrl } from '@/sanity/lib/image'
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

/** Where each link sits across the top on wide viewports: 2/6, 3/6 and 4/6. */
const positions = ['lg:left-[33.3333%]', 'lg:left-[50%]', 'lg:left-[66.6667%]']

export default async function LandingPage() {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName
  const image = settings?.landingImage
  const src = imageUrl(image)
  const blur = imageBlur(image)

  return (
    <div className="relative h-dvh w-full overflow-hidden">
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

      {src ? (
        <>
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition(image) }}
            {...(blur ? { placeholder: 'blur' as const, blurDataURL: blur } : {})}
          />
          <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        </>
      ) : (
        <div className={`${shell} absolute inset-x-0 bottom-0 pb-6`}>
          <EmptyState label="a landing image" />
        </div>
      )}

      <nav aria-label="Main" className="absolute inset-x-0 top-0">
        <ul className="relative flex items-baseline justify-between gap-3 px-5 pt-6 lg:block lg:px-0 lg:pt-0">
          {navItems.map(({ href, label }, index) => (
            <li
              key={href}
              className={`lg:absolute lg:top-8 lg:-translate-x-1/2 ${positions[index]}`}
            >
              <Link
                href={href}
                className={`block px-1 py-2 text-nav tracking-[0.1em] sm:tracking-[0.18em] whitespace-nowrap uppercase transition-opacity duration-700 hover:opacity-60 ${
                  src ? 'text-white [text-shadow:0_0_28px_rgba(0,0,0,0.4)]' : 'text-ink'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
