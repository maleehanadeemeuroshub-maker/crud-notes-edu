import { OPERATIONS } from '@/data/operations'
import { OPERATION_THEME } from '@/data/operationTheme'
import { OperationDeepDive } from '@/components/crud/OperationDeepDive'
import { PutVsPatch } from '@/components/crud/PutVsPatch'
import { CrudVsRest } from '@/components/crud/CrudVsRest'
import { LearningPath } from '@/components/crud/LearningPath'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

const IN_PAGE_NAV = [
  ...OPERATIONS.map((op) => ({ id: op.id, label: op.label })),
  { id: 'put-vs-patch', label: 'PUT vs PATCH' },
  { id: 'crud-vs-rest', label: 'CRUD vs REST' },
  { id: 'roadmap', label: 'Learning Path' },
]

export function Learn() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="Learn CRUD"
          title="Create, Read, Update, Delete — explained properly"
          description="Each operation below covers what it means, how it maps to your database and HTTP, a real example, and the mistakes beginners tend to make."
        />
      </Reveal>

      <div className="sticky top-16 z-10 -mx-4 mb-10 mt-6 overflow-x-auto border-b border-white/8 bg-base/90 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-xl sm:border sm:px-3">
        <div className="flex w-max gap-1 sm:w-full sm:justify-between">
          {IN_PAGE_NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="focus-ring shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-20">
        {OPERATIONS.map((operation, i) => (
          <OperationDeepDive key={operation.id} operation={operation} reverse={i % 2 === 1} />
        ))}

        <section id="put-vs-patch" className="scroll-mt-24">
          <SectionHeading kicker="Update, in detail" title="PUT vs. PATCH" />
          <div className="mt-6">
            <PutVsPatch />
          </div>
        </section>

        <section id="crud-vs-rest" className="scroll-mt-24">
          <SectionHeading kicker="Don't confuse these" title="CRUD vs. REST" />
          <div className="mt-6">
            <CrudVsRest />
          </div>
        </section>

        <section id="roadmap" className="scroll-mt-24">
          <SectionHeading
            kicker="Where to go next"
            title="Beginner Learning Path"
            description="A suggested order for going from 'what is CRUD' to shipping a full application."
          />
          <div className="mt-6">
            <LearningPath />
          </div>
        </section>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-2 text-xs text-white/30">
        {OPERATIONS.map((op) => (
          <span key={op.id} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: OPERATION_THEME[op.id].accent }} />
            {op.verb}
          </span>
        ))}
      </div>
    </div>
  )
}
