import { Fragment, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { OPERATIONS } from '@/data/operations'
import { OPERATION_THEME } from '@/data/operationTheme'
import { MethodBadge } from '@/components/ui/MethodBadge'
import type { OperationId } from '@/types/crud'

export function CrudTable() {
  const [expanded, setExpanded] = useState<OperationId | null>(null)

  return (
    <div className="panel overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink/8 text-left text-xs uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3.5 font-medium">Operation</th>
              <th className="px-5 py-3.5 font-medium">Purpose</th>
              <th className="px-5 py-3.5 font-medium">SQL</th>
              <th className="px-5 py-3.5 font-medium">HTTP</th>
              <th className="px-5 py-3.5 font-medium" />
            </tr>
          </thead>
          <tbody>
            {OPERATIONS.map((op) => {
              const theme = OPERATION_THEME[op.id]
              const isOpen = expanded === op.id
              return (
                <Fragment key={op.id}>
                  <tr
                    onClick={() => setExpanded(isOpen ? null : op.id)}
                    className="focus-ring cursor-pointer border-b border-ink/6 transition-colors last:border-b-0 hover:bg-ink/[0.03]"
                    tabIndex={0}
                    role="button"
                    aria-expanded={isOpen}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setExpanded(isOpen ? null : op.id)
                      }
                    }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-md"
                          style={{ background: theme.accentSoft, color: theme.accent }}
                        >
                          <theme.icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-medium text-ink">{op.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-ink/55">{op.tagline}</td>
                    <td className="px-5 py-3.5">
                      <code className="font-mono text-xs text-ink/65">{op.sqlKeyword}</code>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {op.httpMethods.map((m) => (
                          <MethodBadge key={m} method={m} />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <ChevronDown
                        className={`ml-auto h-4 w-4 text-ink/35 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </td>
                  </tr>
                  <AnimatePresence>
                    {isOpen && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden bg-ink/[0.015]"
                          >
                            <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
                              <p className="text-sm leading-relaxed text-ink/60">{op.meaning}</p>
                              <p className="text-sm leading-relaxed text-ink/50">
                                <span className="font-semibold text-ink/70">Real-world example: </span>
                                {op.realWorldExample}
                              </p>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
