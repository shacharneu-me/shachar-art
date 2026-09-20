import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'
import { ExhibitionCards } from '@/components/exhibition-cards'
import { fallbackArtistName, shell } from '@/lib/site'
import { getExhibitions, getSettings } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName
  const description = `Exhibitions by ${artistName}.`

  return {
    title: 'Exhibitions',
    description,
    alternates: { canonical: '/exhibitions' },
    openGraph: {
      title: `Exhibitions — ${artistName}`,
      description,
      url: '/exhibitions',
    },
  }
}

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions()

  return (
    <div className={`${shell} pt-6 sm:pt-8`}>
      <h1 className="pb-8 text-nav tracking-[0.14em] text-muted uppercase sm:pb-10">
        Exhibitions
      </h1>
      {exhibitions.length ? (
        <ExhibitionCards exhibitions={exhibitions} />
      ) : (
        <EmptyState label="your first exhibition" />
      )}
    </div>
  )
}
