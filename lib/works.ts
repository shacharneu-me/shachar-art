import type { Work } from '@/sanity/lib/types'

export function yearAnchorId(year: string): string {
  return `year-${year}`
}

/** The years present in the works, in the order they are met scrolling down. */
export function yearsInOrder(works: Work[]): string[] {
  const seen: string[] = []
  for (const work of works) {
    if (work.year && !seen.includes(work.year)) seen.push(work.year)
  }
  return seen
}

/** One band of the Works page: a lone work, or a whole series across a row. */
export type WorkRow = {
  key: string
  works: Work[]
  /** Set when this row is where a year first appears. */
  anchorId?: string
  /** The year that starts here, shown as a faint marker above the work. */
  year?: string
}

/**
 * Works keep their order, except that a series is pulled together into a single
 * row at the position of its first member.
 */
export function buildWorkRows(works: Work[]): WorkRow[] {
  const rows: WorkRow[] = []
  const placed = new Set<string>()

  for (const work of works) {
    const seriesId = work.series?._id

    if (!seriesId) {
      rows.push({ key: work._id, works: [work] })
      continue
    }

    if (placed.has(seriesId)) continue
    placed.add(seriesId)
    rows.push({ key: seriesId, works: works.filter((other) => other.series?._id === seriesId) })
  }

  const anchored = new Set<string>()
  for (const row of rows) {
    const year = row.works.find((work) => work.year && !anchored.has(work.year))?.year
    if (!year) continue
    anchored.add(year)
    row.anchorId = yearAnchorId(year)
    row.year = year
  }

  return rows
}
