import { motion } from 'framer-motion'
import { RotateCcw, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/date'
import { CATEGORY_COLORS } from '@/data/noteCategoryTheme'
import { NOTE_CATEGORY_LABELS, TRASH_RETENTION_DAYS } from '@/types/appNote'
import type { AppNote } from '@/types/appNote'
import { ConfirmButton } from '@/components/dashboard/ConfirmButton'

function daysLeft(deletedAt: string): number {
  const elapsedMs = Date.now() - new Date(deletedAt).getTime()
  const remaining = TRASH_RETENTION_DAYS - Math.floor(elapsedMs / (24 * 60 * 60 * 1000))
  return Math.max(0, remaining)
}

interface TrashNoteCardProps {
  note: AppNote
  onRestore: () => void
  onDeleteForever: () => void
}

export function TrashNoteCard({ note, onRestore, onDeleteForever }: TrashNoteCardProps) {
  const categoryColor = CATEGORY_COLORS[note.category]

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      className="panel flex items-start justify-between gap-3 rounded-2xl p-5 opacity-80"
    >
      <div className="min-w-0 flex-1">
        <span
          className="font-mono inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: categoryColor, background: `${categoryColor}1a`, border: `1px solid ${categoryColor}40` }}
        >
          {NOTE_CATEGORY_LABELS[note.category]}
        </span>
        <h3 className="mt-2 truncate text-[15px] font-semibold text-white/80">{note.title}</h3>
        {note.content && <p className="mt-1 line-clamp-2 text-sm text-white/40">{note.content}</p>}
        <p className="mt-2 text-[11px] text-white/30">
          Deleted {note.deletedAt ? formatDate(note.deletedAt) : ''}
          {note.deletedAt && ` · Auto-deletes in ${daysLeft(note.deletedAt)}d`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onRestore}
          aria-label="Restore note"
          className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-white/45 transition hover:bg-emerald-500/10 hover:text-emerald-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <ConfirmButton
          onConfirm={onDeleteForever}
          label="Delete forever"
          confirmLabel="Forever?"
          icon={<Trash2 className="h-3.5 w-3.5" />}
        />
      </div>
    </motion.article>
  )
}
