import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileX2 } from 'lucide-react'
import { notesService } from '@/services/notesService'
import { renderMarkdown } from '@/lib/markdown'
import { formatDate } from '@/utils/date'
import { CATEGORY_COLORS } from '@/data/noteCategoryTheme'
import { NOTE_CATEGORY_LABELS } from '@/types/appNote'
import type { AppNote } from '@/types/appNote'
import { PageLoader } from '@/components/ui/PageLoader'
import { Reveal } from '@/components/ui/Reveal'

/** Public, unauthenticated note view — reachable only via a share link, enforced by the "Anyone can view a publicly shared note" RLS policy. */
export function SharedNote() {
  const { shareId } = useParams<{ shareId: string }>()
  const [note, setNote] = useState<AppNote | null | undefined>(undefined)

  useEffect(() => {
    if (!shareId) {
      setNote(null)
      return
    }
    notesService
      .getSharedNote(shareId)
      .then(setNote)
      .catch(() => setNote(null))
  }, [shareId])

  if (note === undefined) return <PageLoader />

  if (!note) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
        <FileX2 className="h-8 w-8 text-ink/30" />
        <p className="text-sm font-medium text-ink/70">This note isn't shared (anymore).</p>
        <p className="text-sm text-ink/40">The link may be wrong, or the owner turned sharing off.</p>
      </div>
    )
  }

  const categoryColor = CATEGORY_COLORS[note.category]

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Reveal>
        <div className="panel rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-mono inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: categoryColor, background: `${categoryColor}1a`, border: `1px solid ${categoryColor}40` }}
            >
              {NOTE_CATEGORY_LABELS[note.category]}
            </span>
            <span className="text-xs text-ink/30">Shared note · Updated {formatDate(note.updatedAt)}</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-ink">{note.title}</h1>
          {note.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[11px] text-ink/45">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div
            className="prose-note mt-5 text-sm leading-relaxed text-ink/80"
            dangerouslySetInnerHTML={{ __html: note.content.trim() ? renderMarkdown(note.content) : '<p class="text-ink/30">No content.</p>' }}
          />
        </div>
        <p className="mt-4 text-center text-xs text-ink/30">Read-only — shared via CRUD Notes.</p>
      </Reveal>
    </div>
  )
}
