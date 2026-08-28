import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { LEARNING_PATH } from '@/data/learningPath'
import { useProgress } from '@/context/ProgressContext'
import { Reveal } from '@/components/ui/Reveal'

export function LearningPath() {
  const { isComplete, toggleComplete } = useProgress()

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[19px] top-0 w-px bg-slate-900/8 sm:left-[23px]" aria-hidden="true" />
      <ol className="space-y-3">
        {LEARNING_PATH.map((step, i) => {
          const topicId = `path-${step.id}`
          const done = isComplete(topicId)
          return (
            <Reveal key={step.id} delay={i * 0.04}>
              <li className="panel relative flex items-start gap-4 rounded-xl p-4 pl-4 sm:p-5">
                <button
                  onClick={() => toggleComplete(topicId)}
                  aria-pressed={done}
                  aria-label={done ? `Mark "${step.title}" as not done` : `Mark "${step.title}" as done`}
                  className={`focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-bold transition ${
                    done
                      ? 'border-emerald-400 bg-emerald-400 text-[#06110c]'
                      : 'border-slate-900/15 bg-elevated text-slate-900/50 hover:border-emerald-400/50 hover:text-emerald-600'
                  }`}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : String(step.order).padStart(2, '0')}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-900/50">{step.description}</p>
                </div>
                <Link
                  to={step.linkTo}
                  className="focus-ring flex shrink-0 items-center gap-1 self-center rounded-lg border border-slate-900/10 px-2.5 py-1.5 text-xs font-medium text-slate-900/55 transition hover:bg-slate-900/[0.06] hover:text-slate-900"
                >
                  Go
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </Reveal>
          )
        })}
      </ol>
    </div>
  )
}
