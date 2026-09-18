'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItems } from '@/lib/site'

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main">
      <ul className="-mx-2 flex flex-wrap items-center gap-x-1 gap-y-1 sm:justify-end">
        {navItems.map(({ href, label }) => {
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
    </nav>
  )
}
