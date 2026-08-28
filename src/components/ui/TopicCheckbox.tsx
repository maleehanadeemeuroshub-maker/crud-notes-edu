import { Check } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'

interface TopicCheckboxProps {
  topicId: string
  label?: string
}

export function TopicCheckbox({ topicId, label = 'Mark as learned' }: TopicCheckboxProps) {
  const { isComplete, toggleComplete } = useProgress()
  const done = isComplete(topicId)

  return (
    <button
      onClick={() => toggleComplete(topicId)}
      aria-pressed={done}
      className={`focus-ring flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        done
          ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-600'
          : 'border-slate-900/12 bg-slate-900/[0.03] text-slate-900/50 hover:bg-slate-900/[0.07] hover:text-slate-900/85'
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          done ? 'border-emerald-400 bg-emerald-400 text-[#06110c]' : 'border-slate-900/30'
        }`}
      >
        {done && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {done ? 'Learned' : label}
    </button>
  )
}
