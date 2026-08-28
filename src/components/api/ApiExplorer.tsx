import { useState } from 'react'
import { motion } from 'framer-motion'
import { API_ENDPOINTS } from '@/data/apiEndpoints'
import { MethodBadge } from '@/components/ui/MethodBadge'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { TopicCheckbox } from '@/components/ui/TopicCheckbox'
import clsx from 'clsx'

export function ApiExplorer() {
  const [activeId, setActiveId] = useState(API_ENDPOINTS[0].id)
  const active = API_ENDPOINTS.find((e) => e.id === activeId) ?? API_ENDPOINTS[0]

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="panel space-y-1 rounded-2xl p-2">
        {API_ENDPOINTS.map((endpoint) => (
          <button
            key={endpoint.id}
            onClick={() => setActiveId(endpoint.id)}
            aria-pressed={activeId === endpoint.id}
            className={clsx(
              'focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition',
              activeId === endpoint.id ? 'bg-slate-900/8' : 'hover:bg-slate-900/[0.04]',
            )}
          >
            <MethodBadge method={endpoint.method} />
            <code className="font-mono truncate text-[13px] text-slate-900/70">{endpoint.path}</code>
          </button>
        ))}
      </div>

      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="panel rounded-2xl p-6"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <MethodBadge method={active.method} size="md" />
          <code className="font-mono text-sm text-slate-900/85">{active.path}</code>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-900/60">{active.purpose}</p>

        {active.requestExample && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-900/35">Request body</p>
            <CodeBlock code={active.requestExample} language="json" />
          </div>
        )}

        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-900/35">Response</p>
          <CodeBlock code={active.responseExample} language="json" />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-900/35">Status codes</p>
          <ul className="space-y-1.5">
            {active.statusCodes.map((sc) => (
              <li key={sc.code} className="flex items-start gap-2.5 text-sm">
                <span
                  className={clsx(
                    'font-mono shrink-0 rounded px-1.5 py-0.5 text-xs font-bold',
                    sc.code < 300 && 'bg-emerald-400/10 text-emerald-600',
                    sc.code >= 400 && sc.code < 500 && 'bg-amber-400/10 text-amber-600',
                    sc.code >= 500 && 'bg-rose-400/10 text-rose-600',
                  )}
                >
                  {sc.code}
                </span>
                <span className="text-slate-900/55">{sc.meaning}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <TopicCheckbox topicId="rest-endpoints" />
        </div>
      </motion.div>
    </div>
  )
}
