import Link from 'next/link'

import { shell } from '@/lib/site'

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className={shell}>
      <div className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <h1 className="text-nav tracking-[0.14em] uppercase">Page not found</h1>
      </div>
      <div className="hairline py-8">
        <p className="text-muted">This page does not exist, or has been moved.</p>
        <p className="mt-6">
          <Link href="/" className="underline decoration-1 underline-offset-4">
            Back to the beginning
          </Link>
        </p>
      </div>
    </div>
  )
}
