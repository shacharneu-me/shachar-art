import Link from 'next/link'

import { croppedImageUrl } from '@/sanity/lib/image'
import type { ExhibitionListItem } from '@/sanity/lib/types'

/**
 * The card is a fixed wide frame, so the picture's own proportions do not
 * decide the composition; the crop set in the Studio does. Each breakpoint asks
 * Sanity for that exact shape rather than letting the browser trim a wider one.
 */
const WIDE = { w: 2400, h: 600 } // 4 / 1
const NARROW = { w: 1100, h: 500 } // 2.2 / 1

export function ExhibitionCards({ exhibitions }: { exhibitions: ExhibitionListItem[] }) {
  return (
    <ul className="flex flex-col" style={{ gap: 'clamp(48px, 8vw, 120px)' }}>
      {exhibitions.map((exhibition, index) => {
        const wide = croppedImageUrl(exhibition.cardImage, WIDE.w, WIDE.h)
        const narrow = croppedImageUrl(exhibition.cardImage, NARROW.w, NARROW.h)
        const meta = [exhibition.venue, exhibition.year].filter(Boolean).join(' · ')

        return (
          <li key={exhibition._id}>
            <Link
              href={`/exhibitions/${exhibition.slug}`}
              className="group relative block aspect-[2.2/1] overflow-hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink sm:aspect-[4/1]"
            >
              {narrow ? (
                <picture>
                  <source media="(min-width: 640px)" srcSet={wide ?? narrow} />
                  <img
                    src={narrow}
                    // The title and venue sit in this same link, so the picture
                    // only speaks when the artist has given it something to say.
                    alt={exhibition.indexCardAlt || ''}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition duration-[220ms] ease-out group-hover:scale-[1.015] group-hover:brightness-90 group-focus-visible:scale-[1.015] group-focus-visible:brightness-90 motion-reduce:scale-100 motion-reduce:transition-none"
                  />
                </picture>
              ) : (
                <div className="absolute inset-0 bg-ink/5" />
              )}

              {/* Legibility only: the top of the picture stays untouched. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
              />

              <div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ padding: 'clamp(16px, 2vw, 32px)' }}
              >
                <h2
                  // A long title can wrap past the gradient onto a bright part
                  // of the picture; the shadow carries it without dimming more.
                  className="font-medium text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
                  style={{ fontSize: 'clamp(22px, 3vw, 42px)', lineHeight: 1.1 }}
                >
                  {exhibition.title}
                </h2>

                <p className="mt-2 flex items-center gap-2 text-[15px] text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
                  {meta ? <span>{meta}</span> : null}
                  <span
                    aria-hidden="true"
                    className="opacity-0 transition-opacity duration-[220ms] ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
