import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Database, LayoutDashboard, LogOut, Menu, Moon, Search, Settings, Sun, Terminal, X } from 'lucide-react'
import clsx from 'clsx'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useHideOnScroll } from '@/hooks/useHideOnScroll'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useTheme } from '@/context/ThemeContext'
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
  const [hovered, setHovered] = useState<string | null>(null)
  useEscapeKey(() => setMobileOpen(false), mobileOpen)
  const hidden = useHideOnScroll()
  const { theme, toggleTheme } = useTheme()
  const { user, status, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function handleLogout() {
    setMobileOpen(false)
    await logout()
    showToast('Signed out.', 'info')
    navigate('/')
  }

  return (
    <header
      className={clsx(
        'no-print sticky top-0 z-50 border-b border-ink/8 bg-base/85 backdrop-blur-xl transition-transform duration-300',
        hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 shrink-0" aria-label="CRUD Notes home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10">
            <Terminal className="h-4 w-4 text-indigo-400" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-ink">
            CRUD <span className="text-gradient">Notes</span>
          </span>
        </NavLink>

        <nav
          className="ml-4 hidden items-center gap-0.5 lg:flex"
          aria-label="Primary"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onMouseEnter={() => setHovered(to)}
              className={({ isActive }) =>
                clsx(
                  'focus-ring relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                  isActive ? 'text-ink' : 'text-ink/55 hover:text-ink/90',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {(hovered === to || (hovered === null && isActive)) && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-lg bg-ink/8"
                    />
                  )}
                  <span className="relative">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-ink/45 transition hover:bg-ink/[0.06] hover:text-ink"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <NavLink
            to="/notes"
            aria-label="Search notes"
            className="focus-ring hidden h-9 w-9 items-center justify-center rounded-lg text-ink/45 transition hover:bg-ink/[0.06] hover:text-ink sm:flex"
          >
            <Search className="h-4 w-4" />
          </NavLink>
          <NavLink to="/playground" className="hidden sm:block">
            <Button size="sm">
              <Database className="h-3.5 w-3.5" />
              Try Playground
            </Button>
          </NavLink>
          {status === 'authenticated' ? (
            <div className="hidden items-center gap-1.5 lg:flex">
              <NavLink to="/dashboard">
                <Button size="sm" variant="secondary">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </NavLink>
              <NavLink
                to="/settings"
                aria-label="Settings"
                className="focus-ring flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-ink/45 transition hover:bg-ink/[0.06] hover:text-ink"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
              </NavLink>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-ink/45 transition hover:bg-ink/[0.06] hover:text-ink"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="hidden lg:block">
              <Button size="sm" variant="secondary">
                Log in
              </Button>
            </NavLink>
          )}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink lg:hidden"
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
              className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-xs flex-col border-l border-ink/10 bg-elevated p-5 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-bold text-ink">Menu</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                    className="focus-ring rounded-lg p-1.5 text-ink/50 hover:bg-ink/[0.06] hover:text-ink"
                  >
                    {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                  </button>
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="focus-ring rounded-lg p-1.5 text-ink/50 hover:bg-ink/[0.06] hover:text-ink"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
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
                        isActive ? 'bg-ink/8 text-ink' : 'text-ink/60 hover:bg-ink/[0.05] hover:text-ink/90',
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
              {status === 'authenticated' ? (
                <div className="mt-2 flex flex-col gap-2">
                  <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="md" variant="secondary">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </NavLink>
                  <NavLink to="/settings" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="md" variant="secondary">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </NavLink>
                  <Button className="w-full" size="md" variant="ghost" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  <NavLink to="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="md" variant="secondary">
                      Log in
                    </Button>
                  </NavLink>
                  <NavLink to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="md" variant="ghost">
                      Sign up
                    </Button>
                  </NavLink>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
