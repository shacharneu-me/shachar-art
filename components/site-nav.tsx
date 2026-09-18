'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems } from '@/lib/site'

/** Everything but the last link sits in the middle of the header; the last sits in the right corner. */
const middleItems = navItems.slice(0, -1)
const cornerItems = navItems.slice(-1)

export function SiteNav() {
  const pathname = usePathname()

  const renderList = (items: readonly (typeof navItems)[number][], className: string) => (
    <ul className={`-mx-2 flex flex-wrap items-center gap-x-1 gap-y-1 ${className}`}>
      {items.map(({ href, label }) => {
        const isActive = pathname.startsWith(href)

        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`block px-2 py-1 text-nav tracking-[0.08em] uppercase transition-colors hover:text-ink ${
                isActive ? 'text-ink underline decoration-1 underline-offset-4' : 'text-muted'
              }`}
            >
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <nav aria-label="Main" className="contents">
      {renderList(middleItems, 'sm:justify-center')}
      {renderList(cornerItems, 'sm:justify-end')}
    </nav>
  )
}
