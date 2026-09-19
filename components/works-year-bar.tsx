'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { yearAnchorId } from '@/lib/works'

/** Ignore jitter, so the bar does not flicker while the page settles. */
const THRESHOLD = 8

export function WorksYearBar({ years }: { years: string[] }) {
  const [hidden, setHidden] = useState(false)
  const [top, setTop] = useState(0)
  // A year jump scrolls down, which would otherwise hide the bar mid-click.
  const jumping = useRef(false)
  const settle = useRef<number | undefined>(undefined)

  // The bar parks directly under the site header, whose height changes with the
  // breakpoint, so it is measured rather than guessed.
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
      const y = window.scrollY

      // Hold the bar open until a jump's smooth scroll has actually stopped.
      if (jumping.current) {
        window.clearTimeout(settle.current)
        settle.current = window.setTimeout(() => {
          jumping.current = false
        }, 200)
        last = y
        return
      }

      if (Math.abs(y - last) < THRESHOLD) return
      setHidden(y > last && y > top)
      last = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(settle.current)
    }
  }, [top])

  const jumpTo = (year: string) => {
    jumping.current = true
    setHidden(false)
    document.getElementById(yearAnchorId(year))?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      style={{ top }}
      className={`sticky z-20 -mx-5 bg-paper/70 backdrop-blur-sm transition-[translate,opacity] duration-500 sm:-mx-10 ${
        hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="flex items-baseline justify-between gap-4 px-5 py-3 sm:px-10">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => jumpTo(year)}
              className="cursor-pointer text-nav tracking-[0.1em] text-muted/60 uppercase transition-colors duration-500 hover:text-ink"
            >
              {year}
            </button>
          ))}
        </div>

        <p className="flex shrink-0 items-baseline gap-2 text-nav tracking-[0.1em] text-muted/60 uppercase">
          <span aria-hidden="true">/</span>
          <Link href="/works/index" className="transition-colors duration-500 hover:text-ink">
            Index
          </Link>
        </p>
      </div>
    </div>
  )
}
