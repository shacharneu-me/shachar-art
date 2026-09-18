import { client } from '@/sanity/lib/client'

/** Cache tag that every content query is registered under. */
export const CONTENT_TAG = 'content'

/**
 * Pages are statically rendered and refreshed at most once a minute. Publishing
 * in the Studio can also refresh them instantly through the webhook route at
 * `/api/revalidate`.
 */
const REVALIDATE_SECONDS = 60

export async function sanityFetch<T>({
  query,
  params = {},
  fallback,
}: {
  query: string
  params?: Record<string, unknown>
  fallback: T
}): Promise<T> {
  if (!client) return fallback

  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
    })

    return result ?? fallback
  } catch (error) {
    // A missing dataset or a network hiccup should degrade to an empty page
    // rather than take the whole site down.
    console.error('Sanity query failed', error)
    return fallback
  }
}
