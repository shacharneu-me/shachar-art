import Link from 'next/link'

import { croppedImageUrl } from '@/sanity/lib/image'
import type { ExhibitionListItem } from '@/sanity/lib/types'

/** Square, so the crop set in the Studio decides what the small icon shows. */
const ICON = 128

/**
 * Titles are written as "Leaving Room | Solo Exhibition". Only the name belongs
 * on the first line; what kind of show it was reads as supporting text.
 */
function splitTitle(title: string): { name: string; kind: string | null } {
  const [name, ...rest] = title.split('|')
  const kind = rest.join('|').trim()
  return { name: name.trim(), kind: kind || null }
}

export function ExhibitionsList({ exhibitions }: { exhibitions: ExhibitionListItem[] }) {
  return (
    // Narrower than the page, so the years sit with the titles rather than
    // drifting off at the far edge.
    <ul className="mx-auto flex w-full flex-col gap-10 sm:w-[82%] sm:gap-14">
      {exhibitions.map((exhibition) => {
        const icon = croppedImageUrl(exhibition.cardImage, ICON, ICON)
        const { name, kind } = splitTitle(exhibition.title)
        const support = [kind, exhibition.venue].filter(Boolean).join(' · ')

        return (
          <li key={exhibition._id}>
            <Link
              href={`/exhibitions/${exhibition.slug}`}
              className="group flex items-start gap-5 sm:gap-6"
            >
              {icon ? (
                // Sanity already returns this at exactly the right size with the
                // crop baked in, so next/image would only re-request the same thing.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={icon}
                  alt=""
                  width={ICON}
                  height={ICON}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-14 shrink-0 object-cover transition-opacity duration-500 group-hover:opacity-80"
                />
              ) : (
                <div className="aspect-square w-14 shrink-0 bg-ink/5" aria-hidden="true" />
              )}

              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  <h2 className="text-[20px] leading-snug decoration-1 underline-offset-4 group-hover:underline sm:text-[22px]">
                    {name}
                  </h2>
                  {support ? (
                    <p className="mt-1 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                      {support}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 text-[14px] text-muted sm:text-[15px]">
                  {exhibition.dateText}
                </p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
