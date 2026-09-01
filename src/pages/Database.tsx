import { ArchitectureFlow } from '@/components/database/ArchitectureFlow'
import { SqlVsNoSql } from '@/components/database/SqlVsNoSql'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Callout } from '@/components/ui/Callout'
import { Reveal } from '@/components/ui/Reveal'

export function Database() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeading
          kicker="CRUD & Databases"
          title="Where does the data actually live?"
          description="Every CRUD operation eventually reaches a database. Here's how a request gets from a click to a stored record and back."
        />
      </Reveal>

      <div className="mt-10">
        <Reveal delay={0.05}>
          <ArchitectureFlow />
        </Reveal>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2">
        <Reveal>
          <div>
            <h3 className="text-lg font-semibold text-ink">Frontend</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">
              The interface the user actually sees and interacts with — a webpage or mobile screen. It collects
              input, sends requests, and renders whatever comes back.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div>
            <h3 className="text-lg font-semibold text-ink">API</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">
              The contract between frontend and backend — a set of URLs and HTTP methods the frontend can call, each
              one triggering a specific CRUD operation.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <h3 className="text-lg font-semibold text-ink">Backend</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">
              The server-side code that validates requests, checks permissions, applies business rules, and
              translates everything into a database operation.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div>
            <h3 className="text-lg font-semibold text-ink">Database</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">
              Persistent storage that survives restarts, enforces data rules, and answers queries — where INSERT,
              SELECT, UPDATE, and DELETE actually run.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-14">
        <Reveal>
          <SectionHeading kicker="Two storage philosophies" title="SQL vs. NoSQL" />
        </Reveal>
        <div className="mt-6">
          <SqlVsNoSql />
        </div>
      </div>

      <div className="mt-14">
        <Callout type="pro-tip">
          CRUD is a general application pattern — it doesn't care whether your database is PostgreSQL, MongoDB, or
          something else entirely. Pick your database based on how your data is shaped and how it needs to scale,
          not based on which one "supports CRUD" — they all do.
        </Callout>
      </div>
    </div>
  )
}
