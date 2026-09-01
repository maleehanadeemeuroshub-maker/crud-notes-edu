import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode
}

export function TextInput({ icon, className, ...props }: TextInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35">{icon}</span>
      <input
        {...props}
        className={cn(
          'focus-ring panel h-11 w-full rounded-lg pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 transition-all duration-300 focus:scale-[1.01] focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]',
          className,
        )}
      />
    </div>
  )
}
