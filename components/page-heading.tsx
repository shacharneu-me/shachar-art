const sizes = {
  label: 'text-nav tracking-[0.14em] uppercase',
  title: 'text-xl leading-tight sm:text-2xl',
  display: 'text-2xl leading-tight tracking-[-0.01em] sm:text-4xl',
} as const

export function PageHeading({
  title,
  eyebrow,
  subtitle,
  size = 'label',
}: {
  title: string
  eyebrow?: string | null
  subtitle?: string | null
  size?: keyof typeof sizes
}) {
  return (
    <div className="pt-10 pb-8 sm:pt-14 sm:pb-10">
      {eyebrow ? (
        <p className="mb-3 text-nav tracking-[0.14em] text-muted uppercase">{eyebrow}</p>
      ) : null}
      <h1 className={sizes[size]}>{title}</h1>
      {subtitle ? <p className="mt-2 text-muted">{subtitle}</p> : null}
    </div>
  )
}
