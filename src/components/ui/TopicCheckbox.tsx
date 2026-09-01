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
          ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
          : 'border-ink/12 bg-ink/[0.03] text-ink/50 hover:bg-ink/[0.07] hover:text-ink/85'
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          done ? 'border-emerald-400 bg-emerald-400 text-[#06110c]' : 'border-ink/30'
        }`}
      >
        {done && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      {done ? 'Learned' : label}
    </button>
  )
}
