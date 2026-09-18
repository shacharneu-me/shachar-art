import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { WorkModalProvider } from '@/components/work-modal-provider'
import { fallbackArtistName } from '@/lib/site'
import { getSettings } from '@/sanity/lib/content'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const artistName = settings?.artistName || fallbackArtistName

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-paper focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <WorkModalProvider>
        <SiteHeader artistName={artistName} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter
          artistName={artistName}
          email={settings?.email}
          instagram={settings?.instagram}
        />
      </WorkModalProvider>
    </div>
  )
}
