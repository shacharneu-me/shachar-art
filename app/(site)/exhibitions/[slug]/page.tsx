import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/json-ld'
import { RichText } from '@/components/rich-text'
import { WorksList } from '@/components/works-list'
import { absoluteUrl, fallbackArtistName, shell } from '@/lib/site'
import { excerpt, toPlainText } from '@/lib/text'
import { socialImageUrl } from '@/sanity/lib/image'
import { getExhibition, getExhibitionSlugs, getSettings } from '@/sanity/lib/content'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getExhibitionSlugs()
  return slugs.filter(({ slug }) => Boolean(slug)).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [settings, exhibition] = await Promise.all([getSettings(), getExhibition(slug)])

  if (!exhibition) return { title: 'Exhibition not found' }

  const artistName = settings?.artistName || fallbackArtistName
  const description =
    exhibition.seoDescription ||
    excerpt(toPlainText(exhibition.curatorialText)) ||
    [exhibition.title, exhibition.venue, exhibition.dateText].filter(Boolean).join(', ')
  const social =
    socialImageUrl(exhibition.coverImage) || socialImageUrl(exhibition.works[0]?.coverImage)
  const url = `/exhibitions/${exhibition.slug}`

  return {
    title: exhibition.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `${exhibition.title} — ${artistName}`,
      description,
      url,
      ...(social ? { images: [{ url: social, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default async function ExhibitionPage({ params }: Props) {
  const { slug } = await params
  const [settings, exhibition] = await Promise.all([getSettings(), getExhibition(slug)])

  if (!exhibition) notFound()

  const artistName = settings?.artistName || fallbackArtistName

  return (
    <div className={shell}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ExhibitionEvent',
          name: exhibition.title,
          url: absoluteUrl(`/exhibitions/${exhibition.slug}`),
          ...(exhibition.venue ? { location: { '@type': 'Place', name: exhibition.venue } } : {}),
          ...(exhibition.dateText ? { description: exhibition.dateText } : {}),
          performer: { '@type': 'Person', name: artistName },
          ...(exhibition.works.length
            ? {
                workPerformed: exhibition.works.map((work) => ({
                  '@type': 'VisualArtwork',
                  name: work.title,
                  creator: { '@type': 'Person', name: artistName },
                })),
              }
            : {}),
        }}
      />

      <div className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <Link
          href="/exhibitions"
          className="text-nav tracking-[0.1em] text-muted uppercase transition-colors hover:text-ink"
        >
          ← Selected Exhibitions
        </Link>
        <h1 className="mt-5 text-xl leading-tight sm:text-2xl">{exhibition.title}</h1>
        <p className="mt-2 text-muted">
          {[exhibition.dateText, exhibition.venue].filter(Boolean).join(', ')}
        </p>
      </div>

      {exhibition.curatorialText?.length ? (
        <div className="hairline py-8 sm:py-10">
          <RichText value={exhibition.curatorialText} />
        </div>
      ) : null}

      {exhibition.works.length ? (
        <section className="pt-4">
          <h2 className="pb-6 text-nav tracking-[0.14em] text-muted uppercase">Works</h2>
          <WorksList works={exhibition.works} />
        </section>
      ) : null}
    </div>
  )
}
