import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Terminal } from 'lucide-react'
import { CrudFlowStack } from '@/components/crud/CrudFlowStack'
import { CrudTable } from '@/components/crud/CrudTable'
import { RealWorldExamples } from '@/components/crud/RealWorldExamples'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'

export function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="grid-fade absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/50"
          >
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            A developer learning platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            CRUD <span className="text-gradient">Notes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-white/55"
          >
            Learn CRUD operations from database fundamentals to real-world API implementation.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/40"
          >
            CRUD represents the four fundamental operations used to work with persistent data:
            <span className="font-mono text-emerald-400"> Create</span> →
            <span className="font-mono text-sky-400"> Read</span> →
            <span className="font-mono text-violet-400"> Update</span> →
            <span className="font-mono text-rose-400"> Delete</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/learn">
              <Button size="lg">
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/playground">
              <Button variant="secondary" size="lg">
                <Database className="h-4 w-4" />
                Try CRUD Playground
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

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

      <section className="border-t border-white/8 bg-white/[0.012] py-16 sm:py-20">
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

      <section className="border-t border-white/8 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Ready to build something?</h2>
          <p className="mt-3 text-white/50">
            Jump into the interactive playground and practice Create, Read, Update, and Delete on a real dataset.
          </p>
          <Link to="/playground" className="mt-6 inline-block">
            <Button size="lg">
              <Database className="h-4 w-4" />
              Open the Playground
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
