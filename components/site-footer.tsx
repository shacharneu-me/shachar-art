import { shell } from '@/lib/site'

export function SiteFooter({
  artistName,
  email,
  instagram,
}: {
  artistName: string
  email?: string | null
  instagram?: string | null
}) {
  return (
    <footer className="mt-24">
      <div className={shell}>
        <div className="hairline" />
        <div className="flex flex-col gap-2 py-6 text-nav tracking-[0.06em] text-muted uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {artistName}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="transition-colors hover:text-ink">
                  {email}
                </a>
              </li>
            ) : null}
            {instagram ? (
              <li>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ink"
                >
                  Instagram
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </footer>
  )
}
