import { Caption } from '@/components/caption'
import { GalleryLabel, GalleryRail } from '@/components/horizontal-gallery'
import { SanityImage } from '@/components/sanity-image'
import type { InstallationImage } from '@/sanity/lib/types'

/** The large and detail shots that open the page, stacked full width. */
export function InstallationLeads({
  images,
  fallbackAlt,
}: {
  images: InstallationImage[]
  fallbackAlt: string
}) {
  return (
    <div className="space-y-[12vh] sm:space-y-[18vh]">
      {images.map((image, index) => (
        <figure
          key={image.asset?._id ?? index}
          className={image.placement === 'detail' ? 'mx-auto max-w-xl' : ''}
        >
          <SanityImage
            image={image}
            fallbackAlt={fallbackAlt}
            sizes={image.placement === 'detail' ? '(min-width: 640px) 36rem, 100vw' : '100vw'}
            className="h-auto w-full"
            priority={index === 0}
          />
          {image.caption ? <Caption>{image.caption}</Caption> : null}
        </figure>
      ))}
    </div>
  )
}

/** Everything else, as a strip you scroll sideways. */
export function InstallationGallery({
  images,
  fallbackAlt,
}: {
  images: InstallationImage[]
  fallbackAlt: string
}) {
  return (
    <section>
      <GalleryLabel>Installation View</GalleryLabel>
      <GalleryRail>
        {images.map((image, index) => (
          <li key={image.asset?._id ?? index} className="shrink-0 snap-start">
            <figure>
              <SanityImage
                image={image}
                fallbackAlt={fallbackAlt}
                sizes="(min-width: 640px) 60vh, 80vw"
                className="h-[44vh] w-auto max-w-none sm:h-[62vh]"
              />
              {image.caption ? <Caption>{image.caption}</Caption> : null}
            </figure>
          </li>
        ))}
      </GalleryRail>
    </section>
  )
}
