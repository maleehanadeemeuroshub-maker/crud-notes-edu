import { useMemo } from 'react'
import { Pin, Star, Trash2, NotebookText } from 'lucide-react'
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS } from '@/types/appNote'
import type { AppNote } from '@/types/appNote'
import { CATEGORY_COLORS } from '@/data/noteCategoryTheme'

interface StatsStripProps {
  notes: AppNote[]
  trashCount: number
}

export function StatsStrip({ notes, trashCount }: StatsStripProps) {
  const pinnedCount = useMemo(() => notes.filter((n) => n.pinned).length, [notes])
  const favoriteCount = useMemo(() => notes.filter((n) => n.favorite).length, [notes])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const note of notes) counts[note.category] = (counts[note.category] ?? 0) + 1
    return counts
  }, [notes])

  const maxCategoryCount = Math.max(1, ...Object.values(categoryCounts))

  const tiles = [
    { label: 'Total notes', value: notes.length, icon: NotebookText, color: '#818cf8' },
    { label: 'Pinned', value: pinnedCount, icon: Pin, color: '#818cf8' },
    { label: 'Favorites', value: favoriteCount, icon: Star, color: '#fbbf24' },
    { label: 'In trash', value: trashCount, icon: Trash2, color: '#fb7185' },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.4fr]">
      {tiles.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="panel flex items-center gap-3 rounded-xl px-4 py-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ color, background: `${color}1a` }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-lg font-semibold leading-none text-ink">{value}</p>
            <p className="mt-1 text-[11px] text-ink/40">{label}</p>
          </div>
        </div>
      ))}

      <div className="panel rounded-xl px-4 py-3">
        <p className="mb-2 text-[11px] font-medium text-ink/40">By category</p>
        <div className="space-y-1.5">
          {NOTE_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] ?? 0
            const color = CATEGORY_COLORS[cat]
            return (
              <div key={cat} className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-[11px] text-ink/45">{NOTE_CATEGORY_LABELS[cat]}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(count / maxCategoryCount) * 100}%`, background: color }}
                  />
                </div>
                <span className="w-4 shrink-0 text-right text-[11px] text-ink/30">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
