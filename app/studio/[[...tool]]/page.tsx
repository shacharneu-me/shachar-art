import type { Metadata } from 'next'
import { NextStudio } from 'next-sanity/studio'
import { metadata as studioMetadata, viewport } from 'next-sanity/studio'

import config from '@/sanity.config'
import { isSanityConfigured } from '@/sanity/env'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Content editor',
  robots: { index: false, follow: false },
}

export { viewport }

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div style={{ maxWidth: '38rem', margin: '4rem auto', padding: '0 1.5rem', lineHeight: 1.6 }}>
        <h1 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
          The content editor is not connected yet
        </h1>
        <p>
          Create a free project at sanity.io, add its project ID to <code>.env.local</code> as{' '}
          <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>, then restart the server. See{' '}
          <code>README.md</code> for the full walkthrough.
        </p>
      </div>
    )
  }

  return <NextStudio config={config} />
}
