import type { RefObject } from 'react'
import { ChevronDown, Pin, Search, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS } from '@/types/appNote'
import type { NoteFilters, NoteSort, NoteCategory } from '@/types/appNote'

interface FilterBarProps {
  filters: NoteFilters
  onChange: (filters: NoteFilters) => void
  searchRef?: RefObject<HTMLInputElement | null>
}

const SORT_OPTIONS: { value: NoteSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'updated', label: 'Last updated' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
]

export function FilterBar({ filters, onChange, searchRef }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
        <input
          ref={searchRef}
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by title, content, or tag... ( / )"
          aria-label="Search notes"
          className="focus-ring panel h-11 w-full rounded-lg pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 transition-all duration-300 focus:scale-[1.005] focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value as NoteCategory | 'all' })}
            aria-label="Filter by category"
            className="focus-ring panel h-9 appearance-none rounded-lg py-0 pl-3 pr-8 text-xs font-medium text-ink/80"
          >
            <option value="all">All categories</option>
            {NOTE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {NOTE_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
        </div>

        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as NoteSort })}
            aria-label="Sort notes"
            className="focus-ring panel h-9 appearance-none rounded-lg py-0 pl-3 pr-8 text-xs font-medium text-ink/80"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" />
        </div>

        <button
          type="button"
          onClick={() => onChange({ ...filters, favoriteOnly: !filters.favoriteOnly })}
          aria-pressed={filters.favoriteOnly}
          className={cn(
            'focus-ring flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition',
            filters.favoriteOnly
              ? 'border border-amber-400/40 bg-amber-400/10 text-amber-300'
              : 'panel text-ink/60 hover:text-ink/90',
          )}
        >
          <Star className={cn('h-3.5 w-3.5', filters.favoriteOnly && 'fill-current')} />
          Favorites
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...filters, pinnedOnly: !filters.pinnedOnly })}
          aria-pressed={filters.pinnedOnly}
          className={cn(
            'focus-ring flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition',
            filters.pinnedOnly
              ? 'border border-indigo-400/40 bg-indigo-400/10 text-indigo-300'
              : 'panel text-ink/60 hover:text-ink/90',
          )}
        >
          <Pin className={cn('h-3.5 w-3.5', filters.pinnedOnly && 'fill-current')} />
          Pinned
        </button>
      </div>
    </div>
  )
}
