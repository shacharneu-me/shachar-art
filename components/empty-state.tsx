import { isSanityConfigured, studioBasePath } from '@/sanity/env'

/**
 * Shown when a section has no content yet, so a freshly deployed site explains
 * itself instead of rendering a blank page.
 */
export function EmptyState({ label }: { label: string }) {
  return (
    <div className="hairline py-10 text-muted">
      {isSanityConfigured ? (
        <p>
          Nothing here yet. Add {label} in the{' '}
          <a href={studioBasePath} className="underline underline-offset-4">
            content editor
          </a>
          .
        </p>
      ) : (
        <p>
          The content editor is not connected yet. Add your Sanity project ID to{' '}
          <code>.env.local</code> to load {label}.
        </p>
      )}
    </div>
  )
}
