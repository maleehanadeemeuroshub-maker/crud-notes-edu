import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Database, Menu, Search, Terminal, X } from 'lucide-react'
import clsx from 'clsx'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { Button } from '@/components/ui/Button'

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn CRUD', end: false },
  { to: '/database', label: 'Database', end: false },
  { to: '/api', label: 'REST API', end: false },
  { to: '/sql', label: 'SQL', end: false },
  { to: '/playground', label: 'Playground', end: false },
  { to: '/quiz', label: 'Quiz', end: false },
  { to: '/notes', label: 'Notes', end: false },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  useEscapeKey(() => setMobileOpen(false), mobileOpen)

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0a0d0e]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 shrink-0" aria-label="CRUD Notes home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10">
            <Terminal className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-white">
            CRUD <span className="text-gradient">Notes</span>
          </span>
        </NavLink>

        <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'focus-ring rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                  isActive ? 'bg-white/8 text-white' : 'text-white/55 hover:bg-white/[0.05] hover:text-white/90',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <NavLink
            to="/notes"
            aria-label="Search notes"
            className="focus-ring hidden h-9 w-9 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/[0.06] hover:text-white sm:flex"
          >
            <Search className="h-4 w-4" />
          </NavLink>
          <NavLink to="/playground" className="hidden sm:block">
            <Button size="sm">
              <Database className="h-3.5 w-3.5" />
              Try Playground
            </Button>
          </NavLink>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-xs flex-col border-l border-white/10 bg-[#0d1112] p-5 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="focus-ring rounded-lg p-1.5 text-white/50 hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Mobile primary">
                {NAV_ITEMS.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'focus-ring rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-white/8 text-white' : 'text-white/60 hover:bg-white/[0.05] hover:text-white/90',
                      )
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
              <NavLink to="/playground" onClick={() => setMobileOpen(false)} className="mt-6">
                <Button className="w-full" size="md">
                  <Database className="h-4 w-4" />
                  Try Playground
                </Button>
              </NavLink>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
