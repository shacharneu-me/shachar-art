'use client'

import { useEffect, useId, useRef } from 'react'
import Link from 'next/link'

import { RichText } from '@/components/rich-text'
import { SanityImage } from '@/components/sanity-image'
import type { SanityImage as SanityImageType, Work } from '@/sanity/lib/types'

export function WorkModal({ work, onClose }: { work: Work | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const headingId = useId()

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
      className="m-auto w-[calc(100vw-1.5rem)] max-w-5xl border border-ink bg-paper p-0 text-ink backdrop:bg-black/45 sm:w-[calc(100vw-4rem)]"
    >
      {work ? (
        <div ref={scrollRef} className="max-h-[92dvh] overflow-y-auto overscroll-contain">
          <div className="sticky top-0 z-10 bg-paper px-5 pt-5 sm:px-8 sm:pt-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 id={headingId} className="text-lg leading-tight sm:text-xl">
                  {work.title}
                </h2>
                {work.displayDate ? <p className="mt-1 text-muted">{work.displayDate}</p> : null}
              </div>
              <button
                type="button"
                autoFocus
                onClick={onClose}
                className="-mt-1 shrink-0 cursor-pointer px-1 py-1 text-nav tracking-[0.1em] text-muted uppercase transition-colors hover:text-ink"
              >
                Close
              </button>
            </div>
            <div className="hairline mt-4" />
          </div>

          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:gap-12">
            <div className="space-y-6">
              {images.map((image, index) => (
                <figure key={image.asset?._id ?? index}>
                  <SanityImage
                    image={image}
                    fallbackAlt={work.title}
                    sizes="(min-width: 768px) 55vw, 92vw"
                    className="h-auto w-full"
                    priority={index === 0}
                  />
                  {image.caption ? (
                    <figcaption className="mt-2 text-nav text-muted">{image.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>

            <div className="rule-list md:sticky md:top-24 md:self-start">
              {work.materials ? (
                <Detail label="Materials">
                  <p className="whitespace-pre-line">{work.materials}</p>
                </Detail>
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
                <Detail label="Text">
                  <RichText value={work.text} />
                </Detail>
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
