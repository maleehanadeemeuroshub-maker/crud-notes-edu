import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PasswordInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn(
          'focus-ring panel h-11 w-full rounded-lg pl-9 pr-10 text-sm text-ink placeholder:text-ink/35 transition-all duration-300 focus:scale-[1.01] focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]',
          className,
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="focus-ring absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-ink/40 transition hover:text-ink/80"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
