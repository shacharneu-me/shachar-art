import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'
import { ExhibitionsList } from '@/components/exhibitions-list'
import { fallbackArtistName, shell } from '@/lib/site'
import { getExhibitions, getSettings } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName
  const description = `Selected exhibitions by ${artistName}.`

  return {
    title: 'Selected Exhibitions',
    description,
    alternates: { canonical: '/exhibitions' },
    openGraph: {
      title: `Selected Exhibitions — ${artistName}`,
      description,
      url: '/exhibitions',
    },
  }
}

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions()

  return (
    <div className={`${shell} pt-6 sm:pt-8`}>
      <h1 className="sr-only">Selected Exhibitions</h1>
      {exhibitions.length ? (
        <ExhibitionsList exhibitions={exhibitions} />
      ) : (
        <EmptyState label="your first exhibition" />
      )}
    </div>
  )
}
