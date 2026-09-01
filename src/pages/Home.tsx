import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FilePlus2,
  ListChecks,
  RefreshCw,
  Terminal,
  Trash2,
} from 'lucide-react'
import { CrudFlowStack } from '@/components/crud/CrudFlowStack'
import { CrudTable } from '@/components/crud/CrudTable'
import { RealWorldExamples } from '@/components/crud/RealWorldExamples'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { Magnetic } from '@/components/ui/Magnetic'
import { FloatingCard } from '@/components/ui/FloatingCard'
import KineticGrid from '@/components/ui/kinetic-grid'
import { useMouseParallax } from '@/hooks/useMouseParallax'

const FLOATING_CHIPS = [
  {
    id: 'create',
    label: 'CREATE',
    icon: FilePlus2,
    color: '#34d399',
    wrapClass: 'left-[2%] top-[20%]',
    strength: 20,
    floatDuration: 7,
    floatDelay: 0,
    initialDelay: 0.75,
  },
  {
    id: 'read',
    label: 'READ',
    icon: ListChecks,
    color: '#38bdf8',
    wrapClass: 'right-[3%] top-[8%]',
    strength: 24,
    floatDuration: 8,
    floatDelay: 0.4,
    initialDelay: 0.85,
  },
  {
    id: 'update',
    label: 'UPDATE',
    icon: RefreshCw,
    color: '#818cf8',
    wrapClass: 'left-[7%] bottom-[10%]',
    strength: 16,
    floatDuration: 6.5,
    floatDelay: 0.8,
    initialDelay: 0.95,
  },
  {
    id: 'delete',
    label: 'DELETE',
    icon: Trash2,
    color: '#fb7185',
    wrapClass: 'right-[1%] bottom-[18%]',
    strength: 22,
    floatDuration: 7.5,
    floatDelay: 1.2,
    initialDelay: 1.05,
  },
] as const

const FLOATING_CHIPS_SECONDARY = [
  {
    id: 'saved',
    label: 'Saved',
    icon: CheckCircle2,
    color: '#fbbf24',
    wrapClass: 'left-[22%] top-[2%]',
    strength: 10,
    floatDuration: 9,
    floatDelay: 0.2,
    initialDelay: 1.15,
  },
  {
    id: 'db',
    label: 'Database',
    icon: Database,
    color: '#22d3ee',
    wrapClass: 'right-[20%] bottom-[2%]',
    strength: 12,
    floatDuration: 8.5,
    floatDelay: 0.6,
    initialDelay: 1.2,
  },
] as const

function FloatingChip({
  icon: Icon,
  label,
  color,
}: {
  icon: (typeof FLOATING_CHIPS)[number]['icon']
  label: string
  color: string
}) {
  return (
    <div
      className="panel-glass flex items-center gap-1.5 rounded-xl px-3 py-2 shadow-2xl shadow-black/40"
      style={{ boxShadow: `0 12px 30px -14px ${color}55` }}
    >
      <Icon className="h-3.5 w-3.5" style={{ color }} />
      <span className="font-mono text-[11px] font-bold tracking-wide" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

export function Home() {
  const { x, y } = useMouseParallax()

  return (
    <div>
      <KineticGrid className="border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {FLOATING_CHIPS.map((chip) => (
            <FloatingCard
              key={chip.id}
              parallaxX={x}
              parallaxY={y}
              strength={chip.strength}
              floatDuration={chip.floatDuration}
              floatDelay={chip.floatDelay}
              initialDelay={chip.initialDelay}
              className={`absolute ${chip.wrapClass}`}
            >
              <FloatingChip icon={chip.icon} label={chip.label} color={chip.color} />
            </FloatingCard>
          ))}
          {FLOATING_CHIPS_SECONDARY.map((chip) => (
            <FloatingCard
              key={chip.id}
              parallaxX={x}
              parallaxY={y}
              strength={chip.strength}
              floatDuration={chip.floatDuration}
              floatDelay={chip.floatDelay}
              initialDelay={chip.initialDelay}
              className={`absolute hidden xl:block ${chip.wrapClass}`}
            >
              <FloatingChip icon={chip.icon} label={chip.label} color={chip.color} />
            </FloatingCard>
          ))}
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="font-mono mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-ink/15 bg-ink/[0.06] px-3.5 py-1.5 text-xs text-ink/70"
          >
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            A developer learning platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="text-4xl font-bold tracking-tight text-ink sm:text-6xl"
          >
            CRUD <span className="text-gradient">Notes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-ink/70"
          >
            Learn CRUD operations from database fundamentals to real-world API implementation.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/45"
          >
            CRUD represents the four fundamental operations used to work with persistent data:
            <span className="font-mono text-emerald-400"> Create</span> →
            <span className="font-mono text-sky-400"> Read</span> →
            <span className="font-mono text-indigo-400"> Update</span> →
            <span className="font-mono text-rose-400"> Delete</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Magnetic strength={0.25}>
              <Link to="/learn">
                <Button size="lg">
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Magnetic>
            <Link to="/playground">
              <Button variant="secondary" size="lg">
                <Database className="h-4 w-4" />
                Try CRUD Playground
              </Button>
            </Link>
          </motion.div>
        </div>
      </KineticGrid>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            kicker="The four operations"
            title="Every app you use is built on these four actions"
            description="Hover or tap an operation below to see what it means, how it maps to your database and HTTP, and a real example."
          />
        </Reveal>
        <div className="mt-8">
          <Reveal delay={0.1}>
            <CrudFlowStack />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/8 bg-ink/[0.012] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="Quick reference"
              title="CRUD, SQL, and HTTP — side by side"
              description="Click any row to see a short explanation and a real-world example."
            />
          </Reveal>
          <div className="mt-8">
            <Reveal delay={0.1}>
              <CrudTable />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            kicker="See it in practice"
            title="Real-world CRUD examples"
            description="The same four operations show up everywhere, once you know what to look for."
          />
        </Reveal>
        <div className="mt-8">
          <RealWorldExamples />
        </div>
      </section>

      <section className="border-t border-ink/8 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">Ready to build something?</h2>
          <p className="mt-3 text-ink/50">
            Jump into the interactive playground and practice Create, Read, Update, and Delete on a real dataset.
          </p>
          <Magnetic strength={0.25} className="mt-6 inline-block">
            <Link to="/playground">
              <Button size="lg">
                <Database className="h-4 w-4" />
                Open the Playground
              </Button>
            </Link>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}
