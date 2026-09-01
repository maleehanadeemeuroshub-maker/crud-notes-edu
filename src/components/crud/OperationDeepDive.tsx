import { ArrowRight } from 'lucide-react'
import type { OperationDetail } from '@/types/crud'
import { OPERATION_THEME } from '@/data/operationTheme'
import { MethodBadge } from '@/components/ui/MethodBadge'
import { TabbedCodeBlock } from '@/components/ui/TabbedCodeBlock'
import { Callout } from '@/components/ui/Callout'
import { TopicCheckbox } from '@/components/ui/TopicCheckbox'
import { Reveal } from '@/components/ui/Reveal'

interface OperationDeepDiveProps {
  operation: OperationDetail
  reverse?: boolean
}

export function OperationDeepDive({ operation, reverse = false }: OperationDeepDiveProps) {
  const theme = OPERATION_THEME[operation.id]

  return (
    <section id={operation.id} className="scroll-mt-24">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className={reverse ? 'lg:order-2' : ''}>
            <div className="flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: theme.accentSoft, color: theme.accent }}
              >
                <theme.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wide" style={{ color: theme.accent }}>
                  {operation.sqlKeyword} · {operation.httpMethods.join(' / ')}
                </p>
                <h3 className="text-2xl font-semibold text-ink">{operation.label}</h3>
              </div>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-ink/65">{operation.meaning}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/50">{operation.dbAction}</p>

            <div className="mt-5 rounded-xl border border-ink/8 bg-ink/[0.02] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/35">When to use it</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{operation.whenToUse}</p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {operation.flow.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-md border border-ink/10 bg-ink/[0.03] px-2.5 py-1 text-xs text-ink/55">
                    {step}
                  </span>
                  {i < operation.flow.length - 1 && <ArrowRight className="h-3 w-3 text-ink/20" />}
                </span>
              ))}
            </div>

            {(operation.commonMistake || operation.proTip) && (
              <div className="mt-5 space-y-3">
                {operation.commonMistake && <Callout type="common-mistake">{operation.commonMistake}</Callout>}
                {operation.proTip && <Callout type="pro-tip">{operation.proTip}</Callout>}
              </div>
            )}

            <div className="mt-5 flex items-center gap-2">
              <TopicCheckbox topicId={`op-${operation.id}`} />
              {operation.httpMethods.map((m) => (
                <MethodBadge key={m} method={m} size="md" />
              ))}
            </div>
          </div>

          <div className={reverse ? 'lg:order-1' : ''}>
            <TabbedCodeBlock code={operation.code} />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
