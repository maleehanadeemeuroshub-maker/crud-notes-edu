import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { OPERATIONS } from '@/data/operations'
import { OPERATION_THEME } from '@/data/operationTheme'
import { MethodBadge } from '@/components/ui/MethodBadge'
import type { OperationId } from '@/types/crud'

const HOVER_ICON_ROTATE: Record<OperationId, number> = {
  create: 90,
  read: 0,
  update: 180,
  delete: -14,
}

export function CrudFlowStack() {
  const [active, setActive] = useState<OperationId>('create')
  const activeOp = OPERATIONS.find((o) => o.id === active)!
  const theme = OPERATION_THEME[active]

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {OPERATIONS.map((op, i) => {
          const opTheme = OPERATION_THEME[op.id]
          const Icon = opTheme.icon
          const isActive = active === op.id
          return (
            <div key={op.id} className="flex shrink-0 items-center gap-2 lg:shrink lg:flex-col lg:items-stretch">
              <motion.button
                onClick={() => setActive(op.id)}
                aria-pressed={isActive}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                className="focus-ring group relative w-full min-w-[150px] rounded-xl border p-3.5 text-left transition-colors lg:min-w-0"
                style={{
                  borderColor: isActive ? opTheme.border : 'color-mix(in oklab, var(--color-ink) 8%, transparent)',
                  background: isActive ? opTheme.accentSoft : 'color-mix(in oklab, var(--color-ink) 2%, transparent)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <motion.span
                    whileHover={{ scale: 1.15, rotate: HOVER_ICON_ROTATE[op.id] }}
                    transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: opTheme.accentSoft, color: opTheme.accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>
                  <div>
                    <p className="font-mono text-[13px] font-bold text-ink">{op.verb}</p>
                    <p className="text-[11px] text-ink/40">{op.sqlKeyword}</p>
                  </div>
                </div>
              </motion.button>
              {i < OPERATIONS.length - 1 && (
                <ArrowRight className="hidden h-4 w-4 shrink-0 rotate-90 text-ink/20 lg:block lg:self-center" />
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="panel rounded-2xl p-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: theme.accentSoft, color: theme.accent }}
            >
              <theme.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-ink">{activeOp.label}</h3>
              <p className="text-sm text-ink/45">{activeOp.tagline}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              {activeOp.httpMethods.map((m) => (
                <MethodBadge key={m} method={m} />
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink/65">{activeOp.meaning}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-ink/8 bg-ink/[0.02] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/35">Database action</p>
              <p className="font-mono mt-1 text-sm text-ink/75">{activeOp.sqlKeyword}</p>
            </div>
            <div className="rounded-lg border border-ink/8 bg-ink/[0.02] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/35">Example</p>
              <p className="mt-1 text-sm text-ink/75">{activeOp.realWorldExample}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
