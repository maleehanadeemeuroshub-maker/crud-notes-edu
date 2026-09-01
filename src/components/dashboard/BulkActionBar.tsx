import { motion } from 'framer-motion'
import { ChevronDown, Trash2, X } from 'lucide-react'
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS } from '@/types/appNote'
import type { NoteCategory } from '@/types/appNote'
import { Button } from '@/components/ui/Button'

interface BulkActionBarProps {
  count: number
  onMoveToTrash: () => void
  onSetCategory: (category: NoteCategory) => void
  onClear: () => void
}

export function BulkActionBar({ count, onMoveToTrash, onSetCategory, onClear }: BulkActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="panel-glass sticky top-20 z-10 mb-4 flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
    >
      <span className="text-sm font-medium text-ink">{count} selected</span>
      <div className="relative">
        <select
          onChange={(e) => {
            if (e.target.value) onSetCategory(e.target.value as NoteCategory)
            e.target.value = ''
          }}
          defaultValue=""
          aria-label="Move selected notes to category"
          className="focus-ring panel h-8 appearance-none rounded-lg py-0 pl-3 pr-7 text-xs font-medium text-ink/80"
        >
          <option value="" disabled>
            Move to category…
          </option>
          {NOTE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {NOTE_CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-ink/40" />
      </div>
      <Button size="sm" variant="danger" onClick={onMoveToTrash}>
        <Trash2 className="h-3.5 w-3.5" />
        Move to trash
      </Button>
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear selection"
        className="focus-ring ml-auto flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-ink/50 hover:text-ink/80"
      >
        <X className="h-3.5 w-3.5" />
        Clear
      </button>
    </motion.div>
  )
}
