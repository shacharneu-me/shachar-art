import Image from 'next/image'

import { imageBlur, imageDimensions, imageUrl } from '@/sanity/lib/image'
import type { SanityImage as SanityImageType } from '@/sanity/lib/types'

type Props = {
  image: SanityImageType | null | undefined
  /** Falls back to this when no description was entered in the Studio. */
  fallbackAlt?: string
  sizes: string
  className?: string
  priority?: boolean
}

export function SanityImage({ image, fallbackAlt = '', sizes, className, priority }: Props) {
  const src = imageUrl(image)
  if (!src) return null

  const { width, height } = imageDimensions(image)
  const blur = imageBlur(image)

  return (
    <Image
      src={src}
      alt={image?.alt || fallbackAlt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      {...(blur ? { placeholder: 'blur' as const, blurDataURL: blur } : {})}
    />
  )
}
