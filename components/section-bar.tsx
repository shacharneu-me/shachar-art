'use client'

import { useEffect, useRef, useState } from 'react'

/** Ignore jitter, so the bar does not flicker while the page settles. */
const THRESHOLD = 4

export type SectionBarItem = { id: string; label: string }

/**
 * A faint row of jump links that parks under the site header, slides out of
 * sight on the way down and comes back on the way up.
 */
export function SectionBar({
  items,
  trailing,
}: {
  items: SectionBarItem[]
  trailing?: React.ReactNode
}) {
  const [hidden, setHidden] = useState(false)
  const [top, setTop] = useState(0)
  // A jump scrolls down, which would otherwise hide the bar mid-click.
  const jumping = useRef(false)
  const settle = useRef<number | undefined>(undefined)

  // The header's height changes with the breakpoint, so it is measured.
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return

    const measure = () => setTop(header.getBoundingClientRect().height)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let last = window.scrollY

    const onScroll = () => {
      const y = Math.max(0, window.scrollY)

      // Hold the bar open until a jump's smooth scroll has actually stopped.
      if (jumping.current) {
        window.clearTimeout(settle.current)
        settle.current = window.setTimeout(() => {
          jumping.current = false
        }, 200)
        last = y
        return
      }

      const delta = y - last
      if (Math.abs(delta) < THRESHOLD) return
      // Near the top there is nothing to tuck behind, so always show it.
      setHidden(y > top && delta > 0)
      last = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(settle.current)
    }
  }, [top])

  const jumpTo = (id: string) => {
    jumping.current = true
    setHidden(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      style={{ top }}
      // Solid rather than blurred: iOS will not repaint a sticky element that
      // carries a backdrop-filter once it has been translated out of view.
      className={`sticky z-20 -mx-5 bg-paper transition-[translate,opacity] duration-500 sm:-mx-10 ${
        hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="flex items-baseline justify-between gap-4 px-5 py-3 sm:px-10">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          {items.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => jumpTo(id)}
              className="cursor-pointer text-nav tracking-[0.1em] text-muted/60 uppercase transition-colors duration-500 hover:text-ink"
            >
              {label}
            </button>
          ))}
        </div>

        {trailing ? (
          <p className="flex shrink-0 items-baseline gap-2 text-nav tracking-[0.1em] text-muted/60 uppercase">
            {trailing}
          </p>
        ) : null}
      </div>
    </div>
  )
}
