'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const SLIDE_MS = 1500

/** How long the scrolling has to have stopped before the page is let go. */
const QUIET_MS = 400

/**
 * Lives in the root layout so it outlives the landing route. Leaving the landing
 * page rides this panel up while the destination renders underneath, so the page
 * is uncovered rather than swapped in; coming back rides it down again.
 */
export function LandingCurtain({ children }: { children: React.ReactNode }) {
  const onLanding = usePathname() === '/'
  const [phase, setPhase] = useState<'shown' | 'lifting' | 'gone' | 'entering'>(
    onLanding ? 'shown' : 'gone',
  )
  const [wasOnLanding, setWasOnLanding] = useState(onLanding)

  if (wasOnLanding !== onLanding) {
    setWasOnLanding(onLanding)
    setPhase(onLanding ? 'entering' : 'lifting')
  }

  useEffect(() => {
    if (phase === 'lifting') {
      // The scroll that left the landing keeps running under the curtain, and a
      // trackpad's drift outlasts it, so the page would be uncovered part-way
      // down with its jump bar already tucked away. Pin it to the top until the
      // curtain has gone and the scrolling that carried you here has stopped.
      const { style } = document.documentElement
      const previous = style.overflow
      style.overflow = 'hidden'
      window.scrollTo(0, 0)

      // overflow alone does not stop every browser, so anything that does get
      // through is put back.
      const pin = () => {
        if (window.scrollY !== 0) window.scrollTo(0, 0)
      }

      let release: number | undefined
      const unpin = () => {
        style.overflow = previous
        window.removeEventListener('scroll', pin)
        window.removeEventListener('wheel', wait)
        window.removeEventListener('touchmove', wait)
      }

      /** Each further push restarts the wait, so drift never lands scrolled. */
      function wait() {
        window.clearTimeout(release)
        release = window.setTimeout(unpin, QUIET_MS)
      }

      window.addEventListener('scroll', pin, { passive: true })
      window.addEventListener('wheel', wait, { passive: true })
      window.addEventListener('touchmove', wait, { passive: true })

      const timer = setTimeout(() => {
        setPhase('gone')
        wait()
      }, SLIDE_MS)

      return () => {
        window.clearTimeout(release)
        unpin()
        clearTimeout(timer)
      }
    }

    if (phase === 'entering') {
      // Paint it off-screen once, so dropping it back down actually animates.
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('shown')))
      return () => cancelAnimationFrame(frame)
    }
  }, [phase])

  if (phase === 'gone') return null

  return (
    <div
      aria-hidden={phase === 'lifting' || undefined}
      style={{ transitionDuration: `${SLIDE_MS}ms` }}
      className={`fixed inset-0 z-50 transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
        phase === 'shown' ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {children}
    </div>
  )
}
