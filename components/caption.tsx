/**
 * Image captions carry the photographer's credit, so they sit quietly under the
 * image rather than reading as part of the work.
 */
export function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-1.5 text-[0.625rem] tracking-[0.07em] text-muted/55 uppercase">
      {children}
    </figcaption>
  )
}
