'use client'

import { useWorkModal } from '@/components/work-modal-provider'
import type { Work } from '@/sanity/lib/types'

export function WorksIndex({ works }: { works: Work[] }) {
  const { openWork } = useWorkModal()

  return (
    <ul className="py-4">
      {works.map((work) => (
        <li key={work._id}>
          <button
            type="button"
            onClick={() => openWork(work)}
            className="group flex w-full cursor-pointer items-baseline gap-3 py-2 text-left transition-colors duration-500"
          >
            <span className="w-14 shrink-0 text-nav tracking-[0.08em] text-muted uppercase transition-colors duration-500 group-hover:text-ink">
              {work.displayDate}
            </span>
            <span aria-hidden="true" className="text-muted/60">
              —
            </span>
            <span className="text-muted transition-colors duration-500 group-hover:text-ink">
              {work.title}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
