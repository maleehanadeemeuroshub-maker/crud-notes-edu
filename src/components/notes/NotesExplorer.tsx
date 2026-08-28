import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import clsx from 'clsx'
import { NOTES, CATEGORY_LABELS } from '@/data/notesContent'
import type { NoteCategory } from '@/types/note'
import { Callout } from '@/components/ui/Callout'
import { TopicCheckbox } from '@/components/ui/TopicCheckbox'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as NoteCategory[]

export function NotesExplorer() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<NoteCategory | 'all'>('all')

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return NOTES.filter((note) => {
      if (category !== 'all' && note.category !== category) return false
      if (!query) return true
      return (
        note.title.toLowerCase().includes(query) ||
        note.summary.toLowerCase().includes(query) ||
        note.body.some((p) => p.toLowerCase().includes(query)) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })
  }, [search, category])

  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const note of NOTES) counts[note.category] = (counts[note.category] ?? 0) + 1
    return counts
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
            className="focus-ring panel h-10 w-full rounded-lg pl-9 pr-3 text-sm text-white placeholder:text-white/35 transition-all duration-300 focus:scale-[1.015] focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
          />
        </div>
        <nav aria-label="Note categories" className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          <button
            onClick={() => setCategory('all')}
            className={clsx(
              'focus-ring shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium transition',
              category === 'all' ? 'bg-white/8 text-white' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80',
            )}
          >
            All Notes
            <span className="ml-1.5 text-xs text-white/30">{NOTES.length}</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={clsx(
                'focus-ring shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium transition',
                category === cat ? 'bg-white/8 text-white' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80',
              )}
            >
              {CATEGORY_LABELS[cat]}
              <span className="ml-1.5 text-xs text-white/30">{countByCategory[cat] ?? 0}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        <AnimatePresence mode="wait">
          {filteredNotes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="panel rounded-2xl px-6 py-16 text-center"
            >
              <p className="text-sm font-medium text-white/55">No notes match "{search}".</p>
              <p className="mt-1 text-sm text-white/35">Try a different keyword or clear your filters.</p>
            </motion.div>
          ) : (
            <motion.div key="results" layout className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredNotes.map((note, i) => (
                  <motion.article
                    key={note.id}
                    id={note.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.18 } }}
                    whileHover={{ y: -4, scale: 1.012, boxShadow: '0 24px 48px -20px rgba(99,102,241,0.35)' }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                    className="panel scroll-mt-24 rounded-2xl p-6 transition-colors duration-300 hover:border-white/16"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                        {CATEGORY_LABELS[note.category]}
                      </span>
                      {note.tags.map((tag) => (
                        <span key={tag} className="text-xs text-white/30">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-2.5 text-lg font-semibold text-white">{note.title}</h3>
                    <p className="mt-1 text-sm text-white/45">{note.summary}</p>
                    <div className="mt-3 space-y-2.5">
                      {note.body.map((paragraph, idx) => (
                        <p key={idx} className="text-sm leading-relaxed text-white/60">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {note.calloutType && note.callout && (
                      <div className="mt-4">
                        <Callout type={note.calloutType}>{note.callout}</Callout>
                      </div>
                    )}
                    <div className="mt-4">
                      <TopicCheckbox topicId={`note-${note.id}`} label="Mark as read" />
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
