import type { Metadata } from 'next'

import './globals.css'

import { fallbackArtistName, siteUrl } from '@/lib/site'
import { socialImageUrl } from '@/sanity/lib/image'
import { getSettings } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName
  const description =
    settings?.siteDescription || `Selected works and exhibitions by ${artistName}.`
  const social = socialImageUrl(settings?.socialImage)

  return {
    metadataBase: new URL(siteUrl),
    title: { default: artistName, template: `%s — ${artistName}` },
    description,
    applicationName: artistName,
    authors: [{ name: artistName }],
    creator: artistName,
    openGraph: {
      type: 'website',
      siteName: artistName,
      locale: 'en_US',
      url: '/',
      title: artistName,
      description,
      ...(social ? { images: [{ url: social, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: social ? 'summary_large_image' : 'summary',
      title: artistName,
      description,
      ...(social ? { images: [social] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

/**
 * Deliberately minimal: the visible site chrome lives in `app/(site)/layout.tsx`
 * so that the Studio at /studio renders on its own.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
