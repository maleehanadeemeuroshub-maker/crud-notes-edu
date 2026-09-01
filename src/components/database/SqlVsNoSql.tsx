import { Braces, Table2 } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

const SQL_DBS = ['PostgreSQL', 'MySQL', 'SQL Server', 'SQLite']
const NOSQL_DBS = ['MongoDB', 'DynamoDB', 'Firestore', 'Redis']

export function SqlVsNoSql() {
  return (
    <Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="panel rounded-2xl p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
            <Table2 className="h-5 w-5" />
          </span>
          <h3 className="mt-3 text-lg font-semibold text-ink">SQL Databases</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Store data in tables with a fixed schema — every row has the same columns, and relationships between
            tables are enforced with foreign keys. A great fit when your data is highly structured.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {SQL_DBS.map((db) => (
              <span key={db} className="font-mono rounded-md border border-ink/10 bg-ink/[0.03] px-2 py-1 text-xs text-ink/55">
                {db}
              </span>
            ))}
          </div>
        </div>

        <div className="panel rounded-2xl p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-400">
            <Braces className="h-5 w-5" />
          </span>
          <h3 className="mt-3 text-lg font-semibold text-ink">NoSQL Databases</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Store data more flexibly, often as JSON-like documents that don't require a fixed schema. They tend to
            shine when your data changes shape often or needs to scale horizontally.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {NOSQL_DBS.map((db) => (
              <span key={db} className="font-mono rounded-md border border-ink/10 bg-ink/[0.03] px-2 py-1 text-xs text-ink/55">
                {db}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-ink/45">
        Both fully support CRUD — the syntax differs, but the pattern (create, read, update, delete) is identical.
      </p>
    </Reveal>
  )
}
