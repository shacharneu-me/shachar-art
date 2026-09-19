import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { InstallationGallery, InstallationLeads } from '@/components/installation-images'
import { JsonLd } from '@/components/json-ld'
import { RichText } from '@/components/rich-text'
import { WorksGallery } from '@/components/works-gallery'
import { absoluteUrl, fallbackArtistName } from '@/lib/site'
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
    socialImageUrl(exhibition.coverImage) ||
    socialImageUrl(exhibition.installationImages?.[0]) ||
    socialImageUrl(exhibition.works[0]?.coverImage)
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
  const installations = exhibition.installationImages ?? []
  const leads = installations.filter((image) => image.placement !== 'gallery')
  const gallery = installations.filter((image) => image.placement === 'gallery')
  const credit = [exhibition.curator, exhibition.dateText].filter(Boolean).join(' | ')
  const hasText = Boolean(exhibition.curatorialText?.length)

  return (
    <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-10">
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

      <header className="pt-8 pb-8 sm:pt-10 sm:pb-10">
        <Link
          href="/exhibitions"
          className="text-nav tracking-[0.1em] text-muted/60 uppercase transition-colors duration-500 hover:text-ink"
        >
          ← Selected Exhibitions
        </Link>

        <h1 className="mt-8 text-2xl leading-tight tracking-[-0.01em] sm:text-4xl">
          {exhibition.title}
        </h1>

        {exhibition.venue ? <p className="mt-3 text-muted">{exhibition.venue}</p> : null}

        {credit ? (
          <p className="mt-1 text-nav tracking-[0.08em] text-muted/70 uppercase">{credit}</p>
        ) : null}
      </header>

      {leads.length ? <InstallationLeads images={leads} fallbackAlt={exhibition.title} /> : null}

      {gallery.length ? (
        <div className="pt-[14vh] sm:pt-[20vh]">
          <InstallationGallery images={gallery} fallbackAlt={exhibition.title} />
        </div>
      ) : null}

      {exhibition.works.length ? (
        <div className="pt-[14vh] sm:pt-[20vh]">
          <WorksGallery works={exhibition.works} />
        </div>
      ) : null}

      {hasText ? (
        <div className="mt-[14vh] mb-[6vh] max-w-text sm:mt-[20vh]">
          <RichText value={exhibition.curatorialText} />
        </div>
      ) : null}
    </div>
  )
}
