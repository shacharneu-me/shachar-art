import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'
import { ExhibitionsList } from '@/components/exhibitions-list'
import { PageHeading } from '@/components/page-heading'
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
    <div className={shell}>
      <PageHeading title="Selected Exhibitions" />

      {exhibitions.length ? (
        <ExhibitionsList exhibitions={exhibitions} />
      ) : (
        <EmptyState label="your first exhibition" />
      )}
    </div>
  )
}
