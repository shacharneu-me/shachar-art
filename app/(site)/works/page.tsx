import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'
import { JsonLd } from '@/components/json-ld'
import { PageHeading } from '@/components/page-heading'
import { WorksList } from '@/components/works-list'
import { absoluteUrl, fallbackArtistName, shell } from '@/lib/site'
import { imageUrl } from '@/sanity/lib/image'
import { getSettings, getWorks } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName
  const description = `Selected works by ${artistName}.`

  return {
    title: 'Works',
    description,
    alternates: { canonical: '/works' },
    openGraph: { title: `Works — ${artistName}`, description, url: '/works' },
  }
}

export default async function WorksPage() {
  const [settings, works] = await Promise.all([getSettings(), getWorks()])
  const artistName = settings?.artistName || fallbackArtistName

  return (
    <div className={shell}>
      {works.length ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Works by ${artistName}`,
            url: absoluteUrl('/works'),
            numberOfItems: works.length,
            itemListElement: works.map((work, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'VisualArtwork',
                name: work.title,
                creator: { '@type': 'Person', name: artistName },
                ...(work.displayDate ? { dateCreated: work.displayDate } : {}),
                ...(work.materials ? { artMedium: work.materials } : {}),
                ...(imageUrl(work.coverImage) ? { image: imageUrl(work.coverImage) } : {}),
              },
            })),
          }}
        />
      ) : null}

      <PageHeading title="Works" />

      {works.length ? <WorksList works={works} /> : <EmptyState label="your first work" />}
    </div>
  )
}
