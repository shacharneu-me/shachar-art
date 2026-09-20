'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { usePathname } from 'next/navigation'

import { WorkModal } from '@/components/work-modal'
import type { Work } from '@/sanity/lib/types'

type WorkModalContextValue = {
  /** `siblings` is the set the work belongs to, so a series can be paged through. */
  openWork: (work: Work, siblings?: Work[]) => void
  closeWork: () => void
}

const WorkModalContext = createContext<WorkModalContextValue | null>(null)

export function useWorkModal(): WorkModalContextValue {
  const context = useContext(WorkModalContext)
  if (!context) throw new Error('useWorkModal must be used inside WorkModalProvider')
  return context
}

/**
 * Holds the work currently shown in the overlay. The overlay intentionally has no
 * URL of its own, so opening one is pure client state.
 */
export function WorkModalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<{ works: Work[]; index: number; pathname: string } | null>(null)

  // Recording the route an overlay was opened from means following the exhibition
  // link inside it closes the overlay, with no effect to keep the two in step.
  const current = open?.pathname === pathname ? open : null

  const openWork = useCallback(
    (next: Work, siblings?: Work[]) => {
      const works = siblings?.length ? siblings : [next]
      const index = Math.max(0, works.indexOf(next))
      setOpen({ works, index, pathname })
    },
    [pathname],
  )

  const closeWork = useCallback(() => setOpen(null), [])

  const setIndex = useCallback(
    (index: number) => setOpen((state) => (state ? { ...state, index } : state)),
    [],
  )

  return (
    <WorkModalContext.Provider value={{ openWork, closeWork }}>
      {children}
      <WorkModal
        works={current?.works ?? []}
        index={current?.index ?? null}
        onClose={closeWork}
        onIndex={setIndex}
      />
    </WorkModalContext.Provider>
  )
}
