import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEscapeKey } from '@/hooks/useEscapeKey'

interface ConfirmButtonProps {
  onConfirm: () => void
  label: string
  confirmLabel?: string
  icon: React.ReactNode
  className?: string
  /** Optional visible text next to the icon (default state renders icon-only). */
  children?: React.ReactNode
}

/** Two-step inline confirm ("Delete" -> "Sure? Yes/No") instead of a blocking native confirm() dialog. */
export function ConfirmButton({ onConfirm, label, confirmLabel = 'Sure?', icon, className, children }: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false)
  useEscapeKey(() => setConfirming(false), confirming)

  if (confirming) {
    return (
      <div className="flex items-center gap-1 rounded-md bg-rose-500/10 px-1.5 py-1 text-rose-300">
        <span className="px-1 text-xs font-medium">{confirmLabel}</span>
        <button
          type="button"
          onClick={onConfirm}
          aria-label="Confirm"
          className="focus-ring rounded p-1 text-rose-300 hover:bg-rose-500/20"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          aria-label="Cancel"
          className="focus-ring rounded p-1 text-white/50 hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={label}
      className={cn(
        'focus-ring flex h-7 w-7 items-center justify-center rounded-md text-white/45 transition hover:bg-rose-500/10 hover:text-rose-300',
        children && 'gap-1.5',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}
