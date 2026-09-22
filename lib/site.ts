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
 * Search engines only match what the page actually carries.
 */
export const hebrewArtistName = 'שחר נויהאוז'
