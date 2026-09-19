import type { Metadata } from 'next'
import Link from 'next/link'

import { EmptyState } from '@/components/empty-state'
import { WorksIndex } from '@/components/works-index'
import { fallbackArtistName, shell } from '@/lib/site'
import { getSettings, getWorks } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName
  const description = `An index of works by ${artistName}.`

  return {
    title: 'Index',
    description,
    alternates: { canonical: '/works/index' },
    openGraph: { title: `Index — ${artistName}`, description, url: '/works/index' },
  }
}

export default async function WorksIndexPage() {
  const works = await getWorks()

  return (
    <div className={`${shell} pt-6 sm:pt-8`}>
      <h1 className="sr-only">Index of works</h1>

      <p className="flex items-baseline gap-2 py-3 text-nav tracking-[0.1em] text-muted/60 uppercase">
        <Link href="/works" className="transition-colors duration-500 hover:text-ink">
          Works
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">Index</span>
      </p>

      {works.length ? <WorksIndex works={works} /> : <EmptyState label="your first work" />}
    </div>
  )
}
