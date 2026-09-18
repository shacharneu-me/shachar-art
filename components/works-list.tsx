'use client'

import { useEffect, useRef, useState } from 'react'

import { SanityImage } from '@/components/sanity-image'
import { useWorkModal } from '@/components/work-modal-provider'
import { imageDimensions } from '@/sanity/lib/image'
import type { Work } from '@/sanity/lib/types'

/**
 * Works are hung down a tall, mostly empty wall: each at its own size and
 * position. `drift` is how far (px) a work floats against the scroll; only some
 * works move, so the movement stays occasional.
 */
const placements = [
  { row: 'justify-start sm:pl-[4%]', width: 'max-w-full sm:max-w-[78%]', drift: 0 },
  { row: 'justify-end sm:pr-[8%]', width: 'max-w-[74%] sm:max-w-[46%]', drift: 70 },
  { row: 'justify-center', width: 'max-w-full sm:max-w-[88%]', drift: 0 },
  { row: 'justify-start pl-[8%] sm:pl-[24%]', width: 'max-w-[66%] sm:max-w-[36%]', drift: -60 },
  { row: 'justify-end sm:pr-[5%]', width: 'max-w-full sm:max-w-[70%]', drift: 0 },
]

const MAX_HEIGHT_VH = 88

export function WorksList({ works }: { works: Work[] }) {
  return (
    <ul>
      {works.map((work, index) => (
        <WorkFigure
          key={work._id}
          work={work}
          placement={placements[index % placements.length]}
          priority={index === 0}
        />
      ))}
    </ul>
  )
}

function WorkFigure({
  work,
  placement,
  priority,
}: {
  work: Work
  placement: (typeof placements)[number]
  priority: boolean
}) {
  const { openWork } = useWorkModal()
  const revealRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  const { width, height } = imageDimensions(work.coverImage)
  const ratio = width / height

  useEffect(() => {
    const reveal = revealRef.current
    if (!reveal) return

    const { drift } = placement
    const canDrift = drift !== 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let listening = false

    const update = () => {
      frame = 0
      const target = driftRef.current
      if (!target) return
      const rect = reveal.getBoundingClientRect()
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      target.style.transform = `translate3d(0, ${(-progress * drift).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const stop = () => {
      if (!listening) return
      listening = false
      window.removeEventListener('scroll', onScroll)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (canDrift && !listening) {
            listening = true
            window.addEventListener('scroll', onScroll, { passive: true })
            update()
          }
        } else {
          stop()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(reveal)

    return () => {
      observer.disconnect()
      stop()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [placement])

  return (
    <li className={`my-[14vh] flex first:mt-[6vh] sm:my-[24vh] ${placement.row}`}>
      <div
        ref={revealRef}
        className={`w-full ${placement.width} transition-[opacity,transform] duration-[2200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
        // Never wider than the work would be at full viewport height.
        style={{ width: `min(100%, calc(${MAX_HEIGHT_VH}vh * ${ratio.toFixed(4)}))` }}
      >
        <div ref={driftRef} className="will-change-transform">
          <button
            type="button"
            onClick={() => openWork(work)}
            aria-label={`${work.title}${work.displayDate ? `, ${work.displayDate}` : ''}`}
            className="group block w-full cursor-pointer text-left"
          >
            <SanityImage
              image={work.coverImage}
              fallbackAlt={work.title}
              sizes="90vw"
              className="h-auto w-full shadow-[0_50px_90px_-50px_rgba(0,0,0,0.4)] transition-opacity duration-1000 group-hover:opacity-90"
              priority={priority}
            />
            <div className="mt-5 flex items-baseline gap-4 text-[0.6875rem] tracking-[0.08em] text-muted uppercase transition-colors duration-1000 group-hover:text-ink">
              <h2 className="font-normal">{work.title}</h2>
              {work.displayDate ? <p>{work.displayDate}</p> : null}
            </div>
          </button>
        </div>
      </div>
    </li>
  )
}
