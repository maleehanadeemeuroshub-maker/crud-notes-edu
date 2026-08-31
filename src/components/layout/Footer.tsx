import { Link } from 'react-router-dom'
import { Terminal } from 'lucide-react'

interface FooterLink {
  label: string
  to: string | null
  href: string | null
}

const LINK_GROUPS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Learn',
    links: [
      { label: 'Learn CRUD', to: '/learn', href: null },
      { label: 'Database', to: '/database', href: null },
      { label: 'REST API', to: '/api', href: null },
      { label: 'SQL', to: '/sql', href: null },
    ],
  },
  {
    title: 'Practice',
    links: [
      { label: 'Playground', to: '/playground', href: null },
      { label: 'Quiz', to: '/quiz', href: null },
      { label: 'Notes', to: '/notes', href: null },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', to: null, href: 'https://github.com' },
      { label: 'Documentation', to: '/notes', href: null },
    ],
  },
]

export function Footer() {
  return (
    <footer className="no-print border-t border-white/8 bg-deep">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10">
                <Terminal className="h-4 w-4 text-indigo-400" />
              </span>
              <span className="text-[15px] font-bold text-white">
                CRUD <span className="text-gradient">Notes</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
              Understand CRUD. Build better applications.
            </p>
          </div>
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/35">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="focus-ring text-sm text-white/55 transition hover:text-white">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href ?? '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring text-sm text-white/55 transition hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/8 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>CRUD Notes — a developer learning platform for CRUD operations.</p>
          <p className="font-mono">Create · Read · Update · Delete</p>
        </div>
      </div>
    </footer>
  )
}
