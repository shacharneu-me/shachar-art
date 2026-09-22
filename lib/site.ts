/** The one address the live site answers on; s-neuhaus.com redirects here. */
const productionUrl = 'https://www.s-neuhaus.com'

// Fixed for the live site, so canonicals and the sitemap always name the address
// the domain settles on rather than one that redirects.
export const siteUrl = (
  process.env.VERCEL_ENV === 'production'
    ? productionUrl
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/+$/, '')

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

/**
 * The name as it is written in Hebrew, so a search for it finds the site too.
 * It is only ever given to search engines, never shown: the site stays English.
 */
export const hebrewArtistName = 'שחר נויהאוז'

/**
 * A profile link as pasted from an app's share sheet carries tracking and stray
 * spaces ("…/shachar.neu?utm_source=qr "). Search engines match the bare address.
 */
export function cleanProfileUrl(url?: string | null): string | null {
  const trimmed = url?.trim()
  if (!trimmed) return null
  try {
    const parsed = new URL(trimmed)
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return trimmed
  }
}
