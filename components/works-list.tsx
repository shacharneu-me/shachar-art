'use client'

import { useEffect, useRef, useState } from 'react'

import { SanityImage } from '@/components/sanity-image'
import { useWorkModal } from '@/components/work-modal-provider'
import { imageDimensions } from '@/sanity/lib/image'
import { buildWorkRows, type WorkRow } from '@/lib/works'
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

/** A chosen size overrides the rotation's width, but keeps its side of the page. */
const widths = {
  large: 'max-w-full sm:max-w-[92%]',
  medium: 'max-w-[88%] sm:max-w-[58%]',
  small: 'max-w-[60%] sm:max-w-[32%]',
} as const

const heightCaps = { large: 94, medium: 66, small: 44 } as const

export function WorksList({ works }: { works: Work[] }) {
  const rows = buildWorkRows(works)

  return (
    <ul>
      {rows.map((row, index) =>
        row.works.length > 1 ? (
          <SeriesRow key={row.key} row={row} />
        ) : (
          <WorkFigure
            key={row.key}
            work={row.works[0]}
            placement={placements[index % placements.length]}
            priority={index === 0}
            anchorId={row.anchorId}
          />
        ),
      )}
    </ul>
  )
}

/** Reveals its contents once, slowly, when they first come into view. */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true)
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, revealed }
}

const revealClass = (revealed: boolean) =>
  `transition-[opacity,transform] duration-[2200ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
    revealed ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
  }`

/** The tallest a series row is allowed to get, so a pair of tall works fits. */
const SERIES_HEIGHT_VH = 58

/**
 * A series reads as one piece. Giving each work a flex-grow of its aspect ratio
 * makes the row fill the width exactly with every work the same height, so they
 * line up without any measuring. On a phone they fall into two columns instead,
 * which keeps them from shrinking to nothing.
 */
function SeriesRow({ row }: { row: WorkRow }) {
  const { openWork } = useWorkModal()
  const { ref, revealed } = useReveal()

  const ratios = row.works.map((work) => {
    const { width, height } = imageDimensions(work.coverImage)
    return width / height
  })
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0)
  const name = row.works.find((work) => work.series?.title)?.series?.title

  return (
    <li id={row.anchorId} className="my-[14vh] scroll-mt-32 first:mt-[6vh] sm:my-[24vh]">
      <div ref={ref} className={revealClass(revealed)}>
        <div
          // Capping the row's width is what caps its height.
          style={{ '--series-max': `calc(${SERIES_HEIGHT_VH}vh * ${total.toFixed(4)})` } as React.CSSProperties}
          className="mx-auto grid grid-cols-2 items-end gap-x-4 gap-y-8 sm:flex sm:max-w-(--series-max) sm:gap-8"
        >
          {row.works.map((work, index) => (
            <button
              key={work._id}
              type="button"
              onClick={() => openWork(work)}
              aria-label={`${work.title}${work.displayDate ? `, ${work.displayDate}` : ''}`}
              style={{ flexGrow: ratios[index], flexBasis: 0 }}
              className="group min-w-0 cursor-pointer"
            >
              <SanityImage
                image={work.coverImage}
                fallbackAlt={work.title}
                sizes="(min-width: 640px) 45vw, 45vw"
                className="h-auto w-full shadow-[0_50px_90px_-50px_rgba(0,0,0,0.4)] transition-opacity duration-1000 group-hover:opacity-90"
              />
            </button>
          ))}
        </div>

        {name ? (
          <p className="mt-5 text-[0.6875rem] tracking-[0.08em] text-muted uppercase sm:text-center">
            {name} Series
          </p>
        ) : null}
      </div>
    </li>
  )
}

function WorkFigure({
  work,
  placement,
  priority,
  anchorId,
}: {
  work: Work
  placement: (typeof placements)[number]
  priority: boolean
  anchorId?: string
}) {
  const { openWork } = useWorkModal()
  const revealRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  const { width, height } = imageDimensions(work.coverImage)
  const ratio = width / height
  const chosen = work.scale && work.scale !== 'auto' ? widths[work.scale] : null
  // Tall works hit the height cap long before the width one, so each chosen
  // size needs its own cap or they all come out the same.
  const heightCap = chosen ? heightCaps[work.scale as keyof typeof heightCaps] : MAX_HEIGHT_VH

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
    <li
      id={anchorId}
      className={`my-[14vh] flex scroll-mt-32 first:mt-[6vh] sm:my-[24vh] ${placement.row}`}
    >
      <div
        ref={revealRef}
        className={`w-full ${chosen ?? placement.width} ${revealClass(revealed)}`}
        // Never wider than the work would be at its tallest allowed height.
        style={{ width: `min(100%, calc(${heightCap}vh * ${ratio.toFixed(4)}))` }}
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
