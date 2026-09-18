'use client'

import type { ImageLoaderProps } from 'next/image'

/**
 * Hands resizing off to Sanity's image CDN. Anything not served from there is
 * passed through untouched.
 */
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith('https://cdn.sanity.io/')) return src

  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality ?? 80))
  url.searchParams.set('fit', 'max')
  url.searchParams.set('auto', 'format')

  return url.toString()
}
