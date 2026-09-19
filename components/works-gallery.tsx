'use client'

import { useState } from 'react'

import { GalleryLabel, GalleryRail } from '@/components/horizontal-gallery'
import { Lightbox, type LightboxItem } from '@/components/lightbox'
import { SanityImage } from '@/components/sanity-image'
import type { SanityImage as SanityImageType, Work } from '@/sanity/lib/types'

/** The works of one exhibition, as a strip you scroll sideways. */
export function WorksGallery({ works }: { works: Work[] }) {
  const [open, setOpen] = useState<number | null>(null)

  const shown = works.filter((work) => work.coverImage?.asset?.url)
  const items: LightboxItem[] = shown.map((work) => ({
    image: work.coverImage as SanityImageType,
    title: work.title,
    note: work.displayDate,
  }))

  return (
    <section>
      <GalleryLabel>Works</GalleryLabel>
      <GalleryRail>
        {shown.map((work, index) => (
          <li key={work._id} className="shrink-0 snap-start">
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`${work.title}${work.displayDate ? `, ${work.displayDate}` : ''}`}
              className="group block cursor-zoom-in text-left"
            >
              <SanityImage
                image={work.coverImage}
                fallbackAlt={work.title}
                sizes="(min-width: 640px) 60vh, 80vw"
                className="h-[44vh] w-auto max-w-none transition-opacity duration-1000 group-hover:opacity-90 sm:h-[62vh]"
              />
              <div className="mt-4 flex items-baseline gap-4 text-[0.6875rem] tracking-[0.08em] text-muted uppercase transition-colors duration-1000 group-hover:text-ink">
                <h3 className="font-normal">{work.title}</h3>
                {work.displayDate ? <p>{work.displayDate}</p> : null}
              </div>
            </button>
          </li>
        ))}
      </GalleryRail>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  )
}
