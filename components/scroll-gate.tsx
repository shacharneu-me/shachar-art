'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/** A flick should not navigate: the pull has to be meant. */
const WHEEL_PX = 160
const TOUCH_PX = 90

/** Let go for this long and the pull starts over. */
const LAPSE_MS = 400

/**
 * A flick up the page carries on throwing scroll events after it reaches the
 * top. The gate arms only once that has died down, so leaving the page takes a
 * fresh pull rather than the tail of the one that brought you to the edge.
 */
const ARM_MS = 250

/**
 * Turns scrolling past the edge of a page into a move to another page: down off
 * the landing image into the works, and back up out of the works to the landing.
 *
 * `edge` is the edge the pull happens at. 'bottom' is for a page that does not
 * scroll at all, like the landing, where any downward intent counts.
 */
export function ScrollGate({ to, edge }: { to: string; edge: 'top' | 'bottom' }) {
  const router = useRouter()
  const pulled = useRef(0)
  const left = useRef(false)
  const lapse = useRef<number | undefined>(undefined)
  const arm = useRef<number | undefined>(undefined)
  // The landing does not scroll, so there is nothing to wait out there.
  const armed = useRef(edge === 'bottom')
  const touch = useRef<number | null>(null)

  useEffect(() => {
    router.prefetch(to)

    const down = edge === 'bottom'

    /** At the edge the pull leads away from, with no page left to scroll. */
    const atEdge = () => (down ? true : window.scrollY <= 0)

    const reset = () => {
      pulled.current = 0
    }

    const go = () => {
      if (left.current) return
      left.current = true
      router.push(to)
    }

    const pull = (distance: number, threshold: number) => {
      if (!atEdge() || !armed.current) return
      // An open work leaves the page behind it at the top; scrolling inside it
      // must not count as pulling the page itself.
      if (document.querySelector('dialog[open]')) return reset()
      pulled.current += distance
      window.clearTimeout(lapse.current)
      lapse.current = window.setTimeout(reset, LAPSE_MS)
      if (pulled.current >= threshold) go()
    }

    /** Arm once the scrolling that reached the edge has died down. */
    const rearm = () => {
      if (down) return
      window.clearTimeout(arm.current)
      arm.current = window.setTimeout(() => {
        armed.current = atEdge()
      }, ARM_MS)
    }

    const onWheel = (event: WheelEvent) => {
      const distance = down ? event.deltaY : -event.deltaY
      if (!armed.current) rearm()
      if (distance <= 0) return reset()
      pull(distance, WHEEL_PX)
    }

    const onScroll = () => {
      if (atEdge()) {
        rearm()
      } else {
        armed.current = false
        reset()
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      touch.current = event.touches[0]?.clientY ?? null
      reset()
      // A finger landing on the page stops any drift, so the drag that follows
      // is deliberate whatever the page was doing a moment ago.
      if (atEdge()) armed.current = true
    }

    const onTouchMove = (event: TouchEvent) => {
      const start = touch.current
      const y = event.touches[0]?.clientY
      if (start === null || y === undefined) return
      touch.current = y
      // Dragging a finger up scrolls the page down, and the other way about.
      const distance = down ? start - y : y - start
      if (distance <= 0) return reset()
      pull(distance, TOUCH_PX)
    }

    const onKey = (event: KeyboardEvent) => {
      if (!down || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      // Never steal a key from the header's links or anything else focusable.
      if (target && target !== document.body) return
      if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        go()
      }
    }

    onScroll()
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(lapse.current)
      window.clearTimeout(arm.current)
    }
  }, [router, to, edge])

  return null
}
