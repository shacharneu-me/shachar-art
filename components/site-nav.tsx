'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems } from '@/lib/site'

/**
 * On wide screens `contents` drops the nav out of the layout so its links become
 * siblings of the artist name, and the whole header spaces out as one even row.
 */
export function SiteNav({ light = false }: { light?: boolean }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Main" className="flex justify-between gap-3 sm:contents">
      {navItems.map(({ href, label }) => {
        const isActive = pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`text-nav tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-500 sm:tracking-[0.1em] ${
              light
                ? 'transition-opacity hover:opacity-60'
                : isActive
                  ? 'text-ink underline decoration-1 underline-offset-4'
                  : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
