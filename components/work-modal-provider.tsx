'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { usePathname } from 'next/navigation'

import { WorkModal } from '@/components/work-modal'
import type { Work } from '@/sanity/lib/types'

type WorkModalContextValue = {
  openWork: (work: Work) => void
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
  const [open, setOpen] = useState<{ work: Work; pathname: string } | null>(null)

  // Recording the route an overlay was opened from means following the exhibition
  // link inside it closes the overlay, with no effect to keep the two in step.
  const work = open?.pathname === pathname ? open.work : null

  const openWork = useCallback((next: Work) => setOpen({ work: next, pathname }), [pathname])
  const closeWork = useCallback(() => setOpen(null), [])

  return (
    <WorkModalContext.Provider value={{ openWork, closeWork }}>
      {children}
      <WorkModal work={work} onClose={closeWork} />
    </WorkModalContext.Provider>
  )
}
