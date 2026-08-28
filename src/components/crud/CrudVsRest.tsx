import { Database, Network } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { TopicCheckbox } from '@/components/ui/TopicCheckbox'

export function CrudVsRest() {
  return (
    <Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="panel rounded-2xl p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <Database className="h-5 w-5" />
          </span>
          <h3 className="mt-3 text-lg font-semibold text-white">CRUD</h3>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/35">A data operation concept</p>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            CRUD describes <em>what happens to your data</em> — a record is created, read, updated, or deleted. It
            says nothing about networks, URLs, or protocols. You could implement CRUD entirely inside a single
            offline desktop app with no server involved at all.
          </p>
        </div>

        <div className="panel rounded-2xl p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
            <Network className="h-5 w-5" />
          </span>
          <h3 className="mt-3 text-lg font-semibold text-white">REST</h3>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/35">An API architectural style</p>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            REST describes <em>how a client communicates with a server</em> — resources identified by URLs, acted on
            through a consistent set of HTTP methods. REST is one popular way to expose CRUD operations over a
            network, but it isn't the only one (GraphQL and gRPC are others).
          </p>
        </div>
      </div>

      <div className="panel mt-5 rounded-2xl p-6 text-center">
        <p className="text-sm text-white/60">
          <span className="font-mono font-semibold text-emerald-400">CRUD</span> → what happens to the data &nbsp;·&nbsp;
          <span className="font-mono font-semibold text-sky-400"> REST</span> → how the client asks for it
        </p>
        <div className="mt-4 flex justify-center">
          <TopicCheckbox topicId="crud-vs-rest" />
        </div>
      </div>
    </Reveal>
  )
}
