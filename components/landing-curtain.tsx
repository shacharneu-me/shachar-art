'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const SLIDE_MS = 1500

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
      // The scroll that left the landing keeps running under the curtain, so
      // the page would be uncovered part-way down with its jump bar already
      // tucked away. Hold it still at the top until the curtain has gone.
      const { style } = document.documentElement
      const previous = style.overflow
      style.overflow = 'hidden'
      window.scrollTo(0, 0)

      const timer = setTimeout(() => setPhase('gone'), SLIDE_MS)
      return () => {
        style.overflow = previous
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
