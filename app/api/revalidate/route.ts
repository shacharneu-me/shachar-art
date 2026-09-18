import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

import { CONTENT_TAG } from '@/sanity/lib/fetch'

/**
 * Called by a Sanity webhook whenever content is published, so edits show up
 * immediately instead of waiting for the next scheduled refresh.
 * Setup instructions are in README.md → "Instant updates".
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!secret) {
    return new NextResponse('Missing SANITY_REVALIDATE_SECRET', { status: 501 })
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret)

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    // 'max' expires the tag straight away, whatever its remaining freshness.
    revalidateTag(CONTENT_TAG, 'max')

    return NextResponse.json({ revalidated: true, type: body?._type, now: Date.now() })
  } catch (error) {
    console.error('Revalidation webhook failed', error)
    return new NextResponse('Bad request', { status: 400 })
  }
}
