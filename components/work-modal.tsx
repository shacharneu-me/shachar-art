'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'

import { Caption } from '@/components/caption'
import { RichText } from '@/components/rich-text'
import { SanityImage } from '@/components/sanity-image'
import type { SanityImage as SanityImageType, Work } from '@/sanity/lib/types'

/** A flick shorter than this is a tap or a scroll, not a swipe. */
const SWIPE_PX = 50

export function WorkModal({
  works,
  index,
  onClose,
  onIndex,
}: {
  works: Work[]
  index: number | null
  onClose: () => void
  onIndex: (next: number) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const headingId = useId()
  const [zoomed, setZoomed] = useState<number | null>(null)

  const work = index === null ? null : (works[index] ?? null)
  const many = works.length > 1

  const [shownWork, setShownWork] = useState(work)

  if (shownWork !== work) {
    setShownWork(work)
    setZoomed(null)
  }

  // Paging to the next work in a series should start it from the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [work])

  const step = useCallback(
    (delta: number) => {
      if (index === null || works.length < 2) return
      onIndex((index + delta + works.length) % works.length)
    },
    [index, works.length, onIndex],
  )

  useEffect(() => {
    if (!work || !many) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [work, many, step])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (work && !dialog.open) {
      dialog.showModal()
      scrollRef.current?.scrollTo({ top: 0 })
    } else if (!work && dialog.open) {
      dialog.close()
    }
  }, [work])

  // The page behind a modal dialog still scrolls, which makes the overlay feel
  // loose. `scrollbar-gutter` on <html> keeps this from shifting the layout.
  useEffect(() => {
    if (!work) return

    const { style } = document.documentElement
    const previous = style.overflow
    style.overflow = 'hidden'

    return () => {
      style.overflow = previous
    }
  }, [work])

  const images: SanityImageType[] = work
    ? [work.coverImage, ...(work.images ?? [])].filter((image): image is SanityImageType =>
        Boolean(image?.asset?.url),
      )
    : []

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onClose={onClose}
      onClick={(event) => {
        // A click landing on the dialog itself is a click on the backdrop.
        if (event.target === dialogRef.current) onClose()
      }}
      className="work-dialog m-auto h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-none border border-ink bg-paper p-0 text-ink backdrop:bg-black/60 sm:h-[calc(100dvh-3rem)] sm:w-[calc(100vw-3rem)]"
    >
      {work ? (
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto overscroll-contain"
          onTouchStart={(event) => {
            const point = event.touches[0]
            touch.current = { x: point.clientX, y: point.clientY }
          }}
          onTouchEnd={(event) => {
            const start = touch.current
            touch.current = null
            if (!start || !many || zoomed !== null) return

            const point = event.changedTouches[0]
            const dx = point.clientX - start.x
            const dy = point.clientY - start.y
            // Sideways only, or every scroll would page the work.
            if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return
            step(dx < 0 ? 1 : -1)
          }}
        >
          <div className="sticky top-0 z-10 bg-paper px-5 pt-5 sm:px-8 sm:pt-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 id={headingId} className="text-lg leading-tight sm:text-xl">
                  {work.title}
                </h2>
                {work.displayDate ? <p className="mt-1 text-muted">{work.displayDate}</p> : null}
              </div>
              <div className="-mt-1 flex shrink-0 items-center gap-4">
                {many && index !== null ? (
                  <div className="flex items-center gap-3 text-nav tracking-[0.1em] text-muted uppercase">
                    <button
                      type="button"
                      aria-label="Previous in series"
                      onClick={() => step(-1)}
                      className="cursor-pointer px-1 transition-colors hover:text-ink"
                    >
                      ←
                    </button>
                    <span className="tabular-nums">
                      {index + 1}/{works.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Next in series"
                      onClick={() => step(1)}
                      className="cursor-pointer px-1 transition-colors hover:text-ink"
                    >
                      →
                    </button>
                  </div>
                ) : null}

                <button
                  type="button"
                  autoFocus
                  onClick={onClose}
                  className="cursor-pointer px-1 py-1 text-nav tracking-[0.1em] text-muted uppercase transition-colors hover:text-ink"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="hairline mt-4" />
          </div>

          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-12">
            <div className="space-y-8">
              {images.map((image, index) => {
                const isZoomed = zoomed === index

                return (
                  <figure key={image.asset?._id ?? index}>
                    <div className={isZoomed ? 'overflow-auto' : ''}>
                      <button
                        type="button"
                        onClick={() => setZoomed(isZoomed ? null : index)}
                        aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
                        className={`block ${isZoomed ? 'w-[220%] cursor-zoom-out' : 'w-full cursor-zoom-in'}`}
                      >
                        <SanityImage
                          image={image}
                          fallbackAlt={work.title}
                          sizes={isZoomed ? '220vw' : '(min-width: 768px) 62vw, 92vw'}
                          // Unzoomed, a work is held within the visible area so
                          // the whole thing is readable without scrolling.
                          className={
                            isZoomed
                              ? 'h-auto w-full'
                              : 'mx-auto h-auto max-h-[58dvh] w-auto max-w-full sm:max-h-[68dvh]'
                          }
                          priority={index === 0}
                        />
                      </button>
                    </div>
                    {image.caption ? <Caption>{image.caption}</Caption> : null}
                  </figure>
                )
              })}
            </div>

            <div className="rule-list md:sticky md:top-24 md:self-start">
              {work.materials ? (
                <div>
                  <p className="whitespace-pre-line">{work.materials}</p>
                </div>
              ) : null}

              {work.exhibition?.slug ? (
                <Detail label="Exhibition">
                  <Link
                    href={`/exhibitions/${work.exhibition.slug}`}
                    className="underline decoration-1 underline-offset-4 transition-colors hover:text-muted"
                  >
                    {work.exhibition.title}
                  </Link>
                  {work.exhibition.dateText ? (
                    <span className="text-muted">, {work.exhibition.dateText}</span>
                  ) : null}
                </Detail>
              ) : null}

              {work.text?.length ? (
                <div>
                  <RichText value={work.text} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-nav tracking-[0.1em] text-muted uppercase">{label}</h3>
      {children}
    </div>
  )
}
