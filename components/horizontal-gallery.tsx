/** Shared shell for the sideways-scrolling strips: a quiet label, then the rail. */
export function GalleryLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 text-nav tracking-[0.14em] text-muted/60 uppercase">{children}</p>
  )
}

export function GalleryRail({ children }: { children: React.ReactNode }) {
  return (
    // Runs to the right edge of the screen so the strip reads as continuing.
    <div className="-mr-5 overflow-x-auto overscroll-x-contain pb-2 sm:-mr-10">
      <ul className="flex snap-x snap-proximity items-end gap-6 pr-5 sm:gap-10 sm:pr-10">
        {children}
      </ul>
    </div>
  )
}
