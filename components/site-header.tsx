import Link from 'next/link'

import { shell } from '@/lib/site'
import { SiteNav } from '@/components/site-nav'

export function SiteHeader({ artistName }: { artistName: string }) {
  return (
    <header className="sticky top-0 z-30 bg-paper">
      <div
        className={`${shell} flex flex-col gap-2 py-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-baseline sm:py-5`}
      >
        <Link
          href="/"
          className="text-nav tracking-[0.14em] uppercase transition-colors hover:text-muted"
        >
          {artistName}
        </Link>
        <SiteNav />
      </div>
      <div className={shell}>
        <div className="hairline" />
      </div>
    </header>
  )
}
