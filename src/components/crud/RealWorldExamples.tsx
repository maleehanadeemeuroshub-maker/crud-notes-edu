import { CheckSquare, Newspaper, ShoppingCart, Users, type LucideIcon } from 'lucide-react'
import { REAL_WORLD_EXAMPLES } from '@/data/realWorldExamples'
import { OPERATION_THEME } from '@/data/operationTheme'
import { Reveal } from '@/components/ui/Reveal'
import { TopicCheckbox } from '@/components/ui/TopicCheckbox'

const ICONS: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  newspaper: Newspaper,
  users: Users,
  'check-square': CheckSquare,
}

export function RealWorldExamples() {
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        {REAL_WORLD_EXAMPLES.map((example, i) => {
          const Icon = ICONS[example.icon] ?? Users
          return (
            <Reveal key={example.id} delay={i * 0.06}>
              <div className="panel card-interactive h-full rounded-2xl p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/[0.06] text-ink/70">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{example.title}</h3>
                <p className="mt-1 text-sm text-ink/45">{example.description}</p>
                <ul className="mt-4 space-y-2.5">
                  {example.operations.map((op) => {
                    const theme = OPERATION_THEME[op.operation]
                    return (
                      <li key={op.operation} className="flex items-start gap-2.5">
                        <span
                          className="font-mono mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                          style={{ background: theme.accentSoft, color: theme.accent }}
                        >
                          {op.operation}
                        </span>
                        <span className="text-sm leading-snug text-ink/60">{op.action}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
      <div className="mt-5 flex justify-center">
        <TopicCheckbox topicId="real-world-examples" />
      </div>
    </div>
  )
}
