import type { ReactNode } from 'react'
import { AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react'

type CalloutType = 'pro-tip' | 'common-mistake' | 'beginner-warning'

interface CalloutProps {
  type: CalloutType
  children: ReactNode
}

const CONFIG: Record<CalloutType, { label: string; icon: typeof Lightbulb; classes: string; iconClass: string }> = {
  'pro-tip': {
    label: 'Pro Tip',
    icon: Lightbulb,
    classes: 'border-emerald-400/25 bg-emerald-400/[0.06]',
    iconClass: 'text-emerald-600',
  },
  'common-mistake': {
    label: 'Common Mistake',
    icon: AlertTriangle,
    classes: 'border-amber-400/25 bg-amber-400/[0.06]',
    iconClass: 'text-amber-600',
  },
  'beginner-warning': {
    label: 'Beginner Warning',
    icon: ShieldAlert,
    classes: 'border-rose-400/25 bg-rose-400/[0.06]',
    iconClass: 'text-rose-600',
  },
}

export function Callout({ type, children }: CalloutProps) {
  const config = CONFIG[type]
  const Icon = config.icon

  return (
    <div className={`flex gap-3 rounded-lg border px-4 py-3.5 ${config.classes}`} role="note">
      <Icon className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${config.iconClass}`} aria-hidden="true" />
      <div>
        <p className={`text-xs font-bold uppercase tracking-wide ${config.iconClass}`}>{config.label}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-900/75">{children}</p>
      </div>
    </div>
  )
}
