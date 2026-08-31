import { motion } from 'framer-motion'
import { Check, ImageIcon, Pencil, Pin, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/date'
import { CATEGORY_COLORS, PRIORITY_COLORS } from '@/data/noteCategoryTheme'
import { NOTE_COLOR_HEX } from '@/data/noteColorTheme'
import { NOTE_CATEGORY_LABELS } from '@/types/appNote'
import type { AppNote, NoteViewMode } from '@/types/appNote'
import { stripMarkdown } from '@/lib/markdown'

interface NoteCardProps {
  note: AppNote
  view?: NoteViewMode
  onEdit: () => void
  onDelete: () => void
  onTogglePinned: () => void
  onToggleFavorite: () => void
  selectable?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}

export function NoteCard({
  note,
  view = 'grid',
  onEdit,
  onDelete,
  onTogglePinned,
  onToggleFavorite,
  selectable,
  selected,
  onToggleSelect,
}: NoteCardProps) {
  const categoryColor = CATEGORY_COLORS[note.category]
  const accentColor = NOTE_COLOR_HEX[note.color]
  const isList = view === 'list'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      whileHover={{ y: -3, scale: 1.005, boxShadow: '0 24px 48px -20px rgba(99,102,241,0.35)' }}
      transition={{ duration: 0.25 }}
      className={cn(
        'panel group flex rounded-2xl p-5 transition-colors duration-300 hover:border-white/16',
        isList ? 'flex-row items-start gap-4' : 'h-full flex-col',
        note.pinned && 'border-indigo-400/30',
        selected && 'border-indigo-400/50 bg-indigo-400/[0.04]',
      )}
      style={accentColor ? { borderLeft: `3px solid ${accentColor}` } : undefined}
    >
      {selectable && (
        <button
          type="button"
          onClick={onToggleSelect}
          aria-label={selected ? 'Deselect note' : 'Select note'}
          aria-pressed={selected}
          className={cn(
            'focus-ring mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition',
            selected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-white/25 text-transparent hover:border-white/50',
          )}
        >
          <Check className="h-3 w-3" />
        </button>
      )}

      <div className={cn('flex min-w-0 flex-1', isList ? 'flex-row items-start gap-4' : 'flex-col')}>
        <div className={cn('min-w-0 flex-1', isList && 'flex items-start gap-4')}>
          <div className={isList ? 'min-w-0 flex-1' : ''}>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className="font-mono inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: categoryColor, background: `${categoryColor}1a`, border: `1px solid ${categoryColor}40` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: categoryColor }} aria-hidden="true" />
                {NOTE_CATEGORY_LABELS[note.category]}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: PRIORITY_COLORS[note.priority] }}
                title={`${note.priority} priority`}
                aria-label={`${note.priority} priority`}
              />
              {note.attachments.length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-white/35">
                  <ImageIcon className="h-3 w-3" />
                  {note.attachments.length}
                </span>
              )}
            </div>

            <button type="button" onClick={onEdit} className="focus-ring mt-2.5 block w-full rounded-lg text-left">
              <h3 className={cn('font-semibold text-white', isList ? 'truncate text-[15px]' : 'line-clamp-2 text-[15px]')}>
                {note.title}
              </h3>
              {note.content && (
                <p className={cn('mt-1.5 text-sm leading-relaxed text-white/50', isList ? 'line-clamp-1' : 'line-clamp-4')}>
                  {stripMarkdown(note.content)}
                </p>
              )}
            </button>

            {note.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[11px] text-white/45">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {!isList && <p className="mt-3 text-[11px] text-white/30">Updated {formatDate(note.updatedAt)}</p>}
          </div>

          {isList && (
            <p className="shrink-0 whitespace-nowrap text-[11px] text-white/30">{formatDate(note.updatedAt)}</p>
          )}
        </div>

        <div
          className={cn(
            'flex shrink-0 items-center gap-0.5 opacity-80 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100',
            isList ? 'ml-2' : 'order-first mb-2 self-end',
          )}
        >
          <button
            type="button"
            onClick={onTogglePinned}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            aria-pressed={note.pinned}
            className={cn(
              'focus-ring flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/10',
              note.pinned ? 'text-indigo-400' : 'text-white/40 hover:text-white/80',
            )}
          >
            <Pin className={cn('h-3.5 w-3.5', note.pinned && 'fill-current')} />
          </button>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={note.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={note.favorite}
            className={cn(
              'focus-ring flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/10',
              note.favorite ? 'text-amber-400' : 'text-white/40 hover:text-white/80',
            )}
          >
            <Star className={cn('h-3.5 w-3.5', note.favorite && 'fill-current')} />
          </button>
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit note"
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white/80"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Move to trash"
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
