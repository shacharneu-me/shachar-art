export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export const navItems = [
  { href: '/works', label: 'Works' },
  { href: '/exhibitions', label: 'Exhibitions' },
  { href: '/about', label: 'About' },
] as const

/** Used until the artist fills in Site settings in the Studio. */
export const fallbackArtistName = 'Artist'

/** The single horizontal measure every section lines up to. */
export const shell = 'mx-auto w-full max-w-5xl px-5 sm:px-8'
