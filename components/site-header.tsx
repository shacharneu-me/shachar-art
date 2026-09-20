import Link from 'next/link'

import { shell } from '@/lib/site'
import { SiteNav } from '@/components/site-nav'

/**
 * The same row on every page, so the name and the three links never move as you
 * navigate. `overlay` lifts it onto the landing image instead of the paper.
 */
export function SiteHeader({
  artistName,
  overlay = false,
  light = false,
}: {
  artistName: string
  overlay?: boolean
  light?: boolean
}) {
  return (
    <header className={overlay ? 'absolute inset-x-0 top-0 z-20' : 'sticky top-0 z-30 bg-paper'}>
      <div className={`${shell} py-4 sm:py-5`}>
        <div
          className={`flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
            light ? 'text-white [text-shadow:0_0_28px_rgba(0,0,0,0.45)]' : ''
          }`}
        >
          <Link
            href="/"
            className={`text-nav tracking-[0.14em] whitespace-nowrap uppercase transition-opacity duration-500 hover:opacity-60 ${
              light ? '' : 'text-ink'
            }`}
          >
            {artistName}
          </Link>
          <SiteNav light={light} />
        </div>
      </div>
      {overlay ? null : (
        <div className={shell}>
          {/* No rule, but it still holds the line's height so nothing shifts. */}
          <div className="h-px" />
        </div>
      )}
    </header>
  )
}
