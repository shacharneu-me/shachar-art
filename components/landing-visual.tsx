import Image from 'next/image'

import { EmptyState } from '@/components/empty-state'
import { SiteHeader } from '@/components/site-header'
import { shell } from '@/lib/site'
import { imageBlur, imagePosition, imageUrl } from '@/sanity/lib/image'
import type { SanityImage } from '@/sanity/lib/types'

export function LandingVisual({
  artistName,
  image,
}: {
  artistName: string
  image?: SanityImage | null
}) {
  const src = imageUrl(image)
  const blur = imageBlur(image)

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper">
      {src ? (
        <>
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition(image) }}
            {...(blur ? { placeholder: 'blur' as const, blurDataURL: blur } : {})}
          />
          <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        </>
      ) : (
        <div className={`${shell} absolute inset-x-0 bottom-0 pb-6`}>
          <EmptyState label="a landing image" />
        </div>
      )}

      <SiteHeader artistName={artistName} overlay light={Boolean(src)} />
    </div>
  )
}
