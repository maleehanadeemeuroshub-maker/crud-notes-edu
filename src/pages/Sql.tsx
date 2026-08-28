import { OPERATIONS } from '@/data/operations'
import { OPERATION_THEME } from '@/data/operationTheme'
import { TabbedCodeBlock } from '@/components/ui/TabbedCodeBlock'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { TopicCheckbox } from '@/components/ui/TopicCheckbox'

export function Sql() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="SQL CRUD Examples"
          title="Every operation, in SQL, JavaScript, and REST"
          description="The same action, written three ways. Switch tabs to compare how a Create, Read, Update, or Delete looks at each layer of the stack."
        />
      </Reveal>

      <div className="mt-4">
        <TopicCheckbox topicId="sql-basics" label="Mark SQL basics as learned" />
      </div>

      <div className="mt-10 space-y-12">
        {OPERATIONS.map((operation) => {
          const theme = OPERATION_THEME[operation.id]
          return (
            <Reveal key={operation.id}>
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: theme.accentSoft, color: theme.accent }}
                >
                  <theme.icon className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-semibold text-slate-900">
                  {operation.label} <span className="font-mono text-sm text-slate-900/35">— {operation.sqlKeyword}</span>
                </h3>
              </div>
              <TabbedCodeBlock code={operation.code} />
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
