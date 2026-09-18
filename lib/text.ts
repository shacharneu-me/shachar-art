import type { PortableTextBlock } from '@portabletext/types'

/** Flattens CMS rich text into a single string for meta descriptions. */
export function toPlainText(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks) return ''

  return blocks
    .filter((block) => block._type === 'block' && Array.isArray(block.children))
    .map((block) =>
      (block.children as { text?: string }[]).map((child) => child.text ?? '').join(''),
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text

  const clipped = text.slice(0, maxLength)
  const lastSpace = clipped.lastIndexOf(' ')

  return `${clipped.slice(0, lastSpace > 60 ? lastSpace : maxLength).trimEnd()}…`
}
