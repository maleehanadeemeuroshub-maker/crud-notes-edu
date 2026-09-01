import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NoteViewMode } from '@/types/appNote'

interface ViewToggleProps {
  value: NoteViewMode
  onChange: (mode: NoteViewMode) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="panel flex items-center gap-0.5 rounded-lg p-0.5" role="group" aria-label="Note view">
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
        aria-label="Grid view"
        className={cn(
          'focus-ring flex h-8 w-8 items-center justify-center rounded-md transition',
          value === 'grid' ? 'bg-ink/10 text-ink' : 'text-ink/40 hover:text-ink/70',
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        aria-label="List view"
        className={cn(
          'focus-ring flex h-8 w-8 items-center justify-center rounded-md transition',
          value === 'list' ? 'bg-ink/10 text-ink' : 'text-ink/40 hover:text-ink/70',
        )}
      >
        <List className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
