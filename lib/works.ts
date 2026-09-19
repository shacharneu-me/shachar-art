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

/** True when this work is the first of its year, so it can carry the anchor. */
export function isFirstOfYear(works: Work[], index: number): boolean {
  const { year } = works[index]
  if (!year) return false
  return works.findIndex((work) => work.year === year) === index
}
