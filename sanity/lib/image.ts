import { createImageUrlBuilder } from '@sanity/image-url'

import { dataset, projectId } from '@/sanity/env'
import type { SanityImage } from '@/sanity/lib/types'

const builder = createImageUrlBuilder({ projectId, dataset })

/** Raw, untransformed asset URL. `next/image` adds the sizing parameters. */
export function imageUrl(image: SanityImage | null | undefined): string | null {
  if (!image?.asset?.url) return null
  return image.asset.url
}

/** Fixed-size, cropped URL for social previews, where no resizing happens later. */
export function socialImageUrl(image: SanityImage | null | undefined): string | null {
  if (!image?.asset?._id) return null

  try {
    return builder
      .image(image.asset._id)
      .width(1200)
      .height(630)
      .fit('crop')
      .crop(image.hotspot ? 'focalpoint' : 'center')
      .auto('format')
      .url()
  } catch {
    // Never let a social preview take down a page's metadata.
    return null
  }
}

export function imageDimensions(image: SanityImage | null | undefined): {
  width: number
  height: number
} {
  const dimensions = image?.asset?.metadata?.dimensions
  return {
    width: dimensions?.width ?? 1600,
    height: dimensions?.height ?? 1200,
  }
}

/** Sanity's tiny base64 preview, used as a blur placeholder to avoid layout pop-in. */
export function imageBlur(image: SanityImage | null | undefined): string | null {
  return image?.asset?.metadata?.lqip ?? null
}

/**
 * Hotspot-aware focal point, so a cropped thumbnail keeps the part of the work
 * the artist marked as important in the Studio.
 */
export function imagePosition(image: SanityImage | null | undefined): string {
  if (!image?.hotspot) return '50% 50%'
  return `${(image.hotspot.x * 100).toFixed(2)}% ${(image.hotspot.y * 100).toFixed(2)}%`
}
