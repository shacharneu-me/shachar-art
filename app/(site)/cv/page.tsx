import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'
import { RichText } from '@/components/rich-text'
import { fallbackArtistName, shell } from '@/lib/site'
import { excerpt, toPlainText } from '@/lib/text'
import { getCv, getSettings } from '@/sanity/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, cv] = await Promise.all([getSettings(), getCv()])
  const artistName = settings?.artistName || fallbackArtistName
  const description =
    cv?.seoDescription ||
    excerpt(toPlainText(cv?.text)) ||
    `Curriculum vitae of ${artistName}: education, exhibitions and awards.`

  return {
    title: 'CV',
    description,
    alternates: { canonical: '/cv' },
    openGraph: { title: `CV — ${artistName}`, description, url: '/cv' },
  }
}

export default async function CvPage() {
  const cv = await getCv()

  return (
    <div className={shell}>
      <h1 className="sr-only">{cv?.heading || 'CV'}</h1>

      {cv?.text?.length ? (
        // Same distance from the header as the About text.
        <div className="py-8 sm:py-12">
          <RichText value={cv.text} />
          {cv.file?.url ? (
            <p className="mt-10">
              <a
                href={cv.file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nav tracking-[0.1em] uppercase underline decoration-1 underline-offset-4 transition-colors hover:text-muted"
              >
                Download CV (PDF)
              </a>
            </p>
          ) : null}
        </div>
      ) : (
        <EmptyState label="your CV" />
      )}
    </div>
  )
}
