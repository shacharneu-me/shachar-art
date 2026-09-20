'use client'

import { useState } from 'react'

import { GalleryLabel, GalleryRail } from '@/components/horizontal-gallery'
import { Lightbox, type LightboxItem } from '@/components/lightbox'
import { SanityImage } from '@/components/sanity-image'
import type { InstallationImage } from '@/sanity/lib/types'

/**
 * The installation views: the large and detail shots that open the page, then
 * the rest as a strip you scroll sideways. Every one opens the same lightbox,
 * so the arrows walk the whole set.
 */
export function InstallationSection({
  images,
  fallbackAlt,
}: {
  images: InstallationImage[]
  fallbackAlt: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  const leads = images.filter((image) => image.placement !== 'gallery')
  const gallery = images.filter((image) => image.placement === 'gallery')
  // The lightbox walks them in the order they appear down the page.
  const ordered = [...leads, ...gallery]
  const items: LightboxItem[] = ordered.map((image) => ({ image, note: image.caption }))

  return (
    <>
      {leads.length ? (
        <div className="space-y-[12vh] sm:space-y-[18vh]">
          {leads.map((image, index) => (
            <figure
              key={image.asset?._id ?? index}
              className={image.placement === 'detail' ? 'mx-auto max-w-xl' : ''}
            >
              <button
                type="button"
                onClick={() => setOpen(ordered.indexOf(image))}
                aria-label={image.alt || 'Installation view'}
                className="block w-full cursor-zoom-in"
              >
                <SanityImage
                  image={image}
                  fallbackAlt={fallbackAlt}
                  sizes={image.placement === 'detail' ? '(min-width: 640px) 36rem, 100vw' : '100vw'}
                  className="h-auto w-full"
                  priority={index === 0}
                />
              </button>
            </figure>
          ))}
        </div>
      ) : null}

      {gallery.length ? (
        <section className="pt-[14vh] sm:pt-[20vh]">
          <GalleryLabel>Installation View</GalleryLabel>
          <GalleryRail>
            {gallery.map((image, index) => (
              <li key={image.asset?._id ?? index} className="shrink-0 snap-start">
                <figure>
                  <button
                    type="button"
                    onClick={() => setOpen(ordered.indexOf(image))}
                    aria-label={image.alt || 'Installation view'}
                    className="block cursor-zoom-in"
                  >
                    <SanityImage
                      image={image}
                      fallbackAlt={fallbackAlt}
                      sizes="(min-width: 640px) 60vh, 80vw"
                      className="h-[44vh] w-auto max-w-none sm:h-[62vh]"
                    />
                  </button>
                    </figure>
              </li>
            ))}
          </GalleryRail>
        </section>
      ) : null}

      <Lightbox
        items={items}
        index={open}
        label="Installation View"
        onClose={() => setOpen(null)}
        onIndex={setOpen}
      />
    </>
  )
}
