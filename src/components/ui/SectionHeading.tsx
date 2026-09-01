import type { ReactNode } from 'react'

interface SectionHeadingProps {
  kicker?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({ kicker, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {kicker && (
        <p className="font-mono mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-400">
          {kicker}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-[15px] leading-relaxed text-ink/55">{description}</p>}
    </div>
  )
}
