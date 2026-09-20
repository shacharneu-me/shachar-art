import Link from 'next/link'

import { croppedImageUrl } from '@/sanity/lib/image'
import type { ExhibitionListItem } from '@/sanity/lib/types'

/** Square, so the crop set in the Studio decides what the small icon shows. */
const ICON = 96

export function ExhibitionsList({ exhibitions }: { exhibitions: ExhibitionListItem[] }) {
  return (
    <ul className="flex flex-col gap-10 sm:gap-14">
        {exhibitions.map((exhibition) => {
          const icon = croppedImageUrl(exhibition.cardImage, ICON, ICON)

          return (
            <li key={exhibition._id}>
              <Link
                href={`/exhibitions/${exhibition.slug}`}
                className="group flex items-start gap-4 sm:items-center sm:gap-6"
              >
                {icon ? (
                  // Sanity already returns this at exactly 96px with the crop
                  // baked in, so next/image would only re-request the same thing.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={icon}
                    alt=""
                    width={ICON}
                    height={ICON}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 shrink-0 object-cover transition-opacity duration-500 group-hover:opacity-80"
                  />
                ) : (
                  <div className="h-10 w-10 shrink-0 bg-ink/5" aria-hidden="true" />
                )}

                <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <div>
                    <h2 className="decoration-1 underline-offset-4 group-hover:underline">
                      {exhibition.title}
                    </h2>
                    {exhibition.venue ? <p className="text-muted">{exhibition.venue}</p> : null}
                  </div>
                  <p className="shrink-0 text-muted">{exhibition.dateText}</p>
                </div>
              </Link>
            </li>
          )
        })}
    </ul>
  )
}
