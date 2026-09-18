'use client'

import { SanityImage } from '@/components/sanity-image'
import { useWorkModal } from '@/components/work-modal-provider'
import type { Work } from '@/sanity/lib/types'

/**
 * The scrollable index of works. Each row shows only an image, the title and the
 * date; everything else lives in the overlay.
 */
export function WorksList({ works }: { works: Work[] }) {
  const { openWork } = useWorkModal()

  return (
    <>
      <ul>
        {works.map((work, index) => (
          <li key={work._id} className="hairline">
            <button
              type="button"
              onClick={() => openWork(work)}
              aria-label={`${work.title}${work.displayDate ? `, ${work.displayDate}` : ''}`}
              className="group grid w-full cursor-pointer gap-3 py-6 text-left sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 sm:py-7"
            >
              <SanityImage
                image={work.coverImage}
                fallbackAlt={work.title}
                sizes="(min-width: 640px) 12rem, 92vw"
                className="h-auto max-h-[60vh] w-full object-contain object-left transition-opacity group-hover:opacity-85"
                // The first row is the largest thing above the fold on mobile.
                priority={index === 0}
              />
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <h2 className="decoration-1 underline-offset-4 group-hover:underline">
                  {work.title}
                </h2>
                {work.displayDate ? (
                  <p className="shrink-0 text-muted">{work.displayDate}</p>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div className="hairline" />
    </>
  )
}
