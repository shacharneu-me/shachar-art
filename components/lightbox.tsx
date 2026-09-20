'use client'

import { useCallback, useEffect, useRef } from 'react'

import { SanityImage } from '@/components/sanity-image'
import { imageBlur, imageUrl } from '@/sanity/lib/image'
import type { SanityImage as SanityImageType } from '@/sanity/lib/types'

export type LightboxItem = {
  image: SanityImageType
  /** Title of a work, or nothing for an installation view. */
  title?: string | null
  /** Date, or the photographer's credit. */
  note?: string | null
  /** A work's materials, on its own line under the title. */
  details?: string | null
}

/**
 * One picture at a time, held at 80% of the screen with the page blurred behind
 * it. The arrows sit out in that blurred margin.
 *
 * Deliberately not a <dialog>: an element in the top layer cannot sample the
 * page behind it, so `backdrop-filter` there blurs nothing.
 */
export function Lightbox({
  items,
  index,
  label,
  onClose,
  onIndex,
}: {
  items: LightboxItem[]
  index: number | null
  /** Which set you are looking at, e.g. Installation View or Works. */
  label: string
  onClose: () => void
  onIndex: (next: number) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const open = index !== null
  const many = items.length > 1

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndex((index + delta + items.length) % items.length)
    },
    [index, items.length, onIndex],
  )

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step, onClose])

  // Hold the page still, and hand focus over and back.
  useEffect(() => {
    if (!open) return

    returnTo.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const { style } = document.documentElement
    const previous = style.overflow
    style.overflow = 'hidden'

    return () => {
      style.overflow = previous
      returnTo.current?.focus()
    }
  }, [open])

  if (index === null) return null
  const item = items[index]
  // The surround is the picture itself, blown up and blurred. `backdrop-filter`
  // would blur the page instead, but it does not composite reliably here.
  const wash = imageBlur(item.image) ?? imageUrl(item.image)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title ?? 'Image'}
      className="lightbox fixed inset-0 z-50 flex items-center justify-center text-ink"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {wash ? (
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
            style={{ backgroundImage: `url(${wash})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-paper/85" />
      </div>

      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out"
      />

      <p className="absolute top-4 left-5 z-10 text-nav tracking-[0.14em] text-muted/60 uppercase sm:top-6 sm:left-8">
        {label}
      </p>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 cursor-pointer px-2 py-1 text-nav tracking-[0.1em] text-muted uppercase transition-colors hover:text-ink sm:top-6 sm:right-8"
      >
        Close
      </button>

      {many ? (
        <button
          type="button"
          aria-label="Previous"
          onClick={() => step(-1)}
          className="absolute left-1 z-10 cursor-pointer px-3 py-6 text-xl text-muted transition-colors hover:text-ink sm:left-5"
        >
          ←
        </button>
      ) : null}

      <figure className="relative flex max-h-[80dvh] max-w-[80vw] flex-col items-start">
        <SanityImage
          image={item.image}
          fallbackAlt={item.title ?? ''}
          sizes="80vw"
          className="h-auto max-h-[74dvh] w-auto max-w-full object-contain"
          priority
        />
        {item.title || item.note || item.details ? (
          // Tucked under the picture's bottom-left corner, quiet enough to ignore.
          <figcaption className="mt-1.5 max-w-full text-left text-[0.5625rem] leading-relaxed tracking-[0.07em] uppercase">
            {item.title || item.note ? (
              <span className="flex flex-wrap gap-x-3 text-muted/70">
                {item.title ? <span>{item.title}</span> : null}
                {item.note ? <span className="text-muted/50">{item.note}</span> : null}
              </span>
            ) : null}
            {item.details ? (
              <span className="block text-muted/50 normal-case">{item.details}</span>
            ) : null}
          </figcaption>
        ) : null}
      </figure>

      {many ? (
        <button
          type="button"
          aria-label="Next"
          onClick={() => step(1)}
          className="absolute right-1 z-10 cursor-pointer px-3 py-6 text-xl text-muted transition-colors hover:text-ink sm:right-5"
        >
          →
        </button>
      ) : null}
    </div>
  )
}
