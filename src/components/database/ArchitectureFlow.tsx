import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Globe, Layers, MonitorSmartphone, Server, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { TopicCheckbox } from '@/components/ui/TopicCheckbox'

interface Layer {
  id: string
  label: string
  icon: LucideIcon
  description: string
}

const LAYERS: Layer[] = [
  { id: 'user', label: 'User', icon: User, description: 'Clicks a button, submits a form, or opens a page.' },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: MonitorSmartphone,
    description: 'Captures the action and sends an HTTP request to the API.',
  },
  {
    id: 'api',
    label: 'API Request',
    icon: Globe,
    description: 'The request travels over the network with a method, URL, and (often) a body.',
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: Server,
    description: 'Validates the request, checks permissions, and applies business logic.',
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    description: 'Runs the actual INSERT, SELECT, UPDATE, or DELETE and returns a result.',
  },
]

export function ArchitectureFlow() {
  const [selected, setSelected] = useState<string>('backend')
  const [pulseIndex, setPulseIndex] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => {
      setPulseIndex((i) => (i + 1) % (LAYERS.length * 2 - 1))
    }, 900)
    return () => clearInterval(interval)
  }, [reducedMotion])

  const selectedLayer = LAYERS.find((l) => l.id === selected) ?? LAYERS[0]
  const requestPhase = pulseIndex < LAYERS.length
  const activeDotIndex = requestPhase ? pulseIndex : LAYERS.length * 2 - 2 - pulseIndex

  return (
    <div className="panel rounded-2xl p-6">
      <div className="flex flex-col items-stretch gap-0 lg:flex-row lg:items-center">
        {LAYERS.map((layer, i) => {
          const Icon = layer.icon
          const isSelected = selected === layer.id
          const isPulsing = !reducedMotion && activeDotIndex === i
          return (
            <div key={layer.id} className="flex flex-1 flex-col items-center gap-0 lg:flex-row">
              <button
                onClick={() => setSelected(layer.id)}
                aria-pressed={isSelected}
                className={`focus-ring flex w-full flex-col items-center gap-2 rounded-xl border p-4 transition-all lg:w-auto ${
                  isSelected
                    ? 'border-emerald-400/40 bg-emerald-400/[0.07]'
                    : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border ${
                    isSelected ? 'border-emerald-400/50 text-emerald-300' : 'border-white/15 text-white/55'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {isPulsing && (
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-emerald-400"
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.6 }}
                      transition={{ duration: 0.7 }}
                    />
                  )}
                </span>
                <span className="text-xs font-semibold text-white/80">{layer.label}</span>
              </button>
              {i < LAYERS.length - 1 && (
                <div className="flex h-6 items-center justify-center lg:h-auto lg:w-8">
                  <ArrowRight className="h-4 w-4 rotate-90 text-white/20 lg:rotate-0" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-2 text-center">
        <p className="font-mono text-[11px] text-white/30">
          {requestPhase ? 'request travelling forward →' : '← response travelling back'}
        </p>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/60">
          <Layers className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{selectedLayer.label}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-white/55">{selectedLayer.description}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <TopicCheckbox topicId="database-flow" />
      </div>
    </div>
  )
}
