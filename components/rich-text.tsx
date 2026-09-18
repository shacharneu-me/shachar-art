import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = String(value?.href ?? '')
      const isExternal = /^https?:\/\//.test(href)

      return (
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
}

export function RichText({
  value,
  className = '',
}: {
  value: PortableTextBlock[] | null | undefined
  className?: string
}) {
  if (!value?.length) return null

  return (
    <div className={`prose-art ${className}`.trim()}>
      <PortableText value={value} components={components} />
    </div>
  )
}
