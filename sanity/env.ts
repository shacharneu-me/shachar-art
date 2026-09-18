export const apiVersion = '2025-02-19'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

/**
 * The site is buildable and runnable before a Sanity project exists, so that
 * `npm run dev` works on a fresh clone. Every page falls back to an empty state
 * until a project id is set in the environment.
 */
export const isSanityConfigured = projectId.length > 0

export const studioBasePath = '/studio'
