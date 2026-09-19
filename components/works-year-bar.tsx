import Link from 'next/link'

import { SectionBar } from '@/components/section-bar'
import { yearAnchorId } from '@/lib/works'

export function WorksYearBar({ years }: { years: string[] }) {
  return (
    <SectionBar
      items={years.map((year) => ({ id: yearAnchorId(year), label: year }))}
      trailing={
        <>
          <span aria-hidden="true">/</span>
          <Link href="/works/index" className="transition-colors duration-500 hover:text-ink">
            Index
          </Link>
        </>
      }
    />
  )
}
