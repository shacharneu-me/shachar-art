import Link from 'next/link'

import type { ExhibitionListItem } from '@/sanity/lib/types'

export function ExhibitionsList({ exhibitions }: { exhibitions: ExhibitionListItem[] }) {
  return (
    <>
      <ul className="[&>li:first-child]:border-t-0">
        {exhibitions.map((exhibition) => (
          <li key={exhibition._id} className="hairline">
            <Link
              href={`/exhibitions/${exhibition.slug}`}
              className="group flex flex-col gap-0.5 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-7"
            >
              <div>
                <h2 className="decoration-1 underline-offset-4 group-hover:underline">
                  {exhibition.title}
                </h2>
                {exhibition.venue ? (
                  <p className="text-muted">{exhibition.venue}</p>
                ) : null}
              </div>
              <p className="shrink-0 text-muted">{exhibition.dateText}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="hairline" />
    </>
  )
}
