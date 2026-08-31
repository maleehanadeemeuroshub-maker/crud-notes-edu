import { useState } from 'react'
import { ChevronDown, History, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/date'
import { notesService } from '@/services/notesService'
import type { NoteVersion } from '@/types/appNote'

interface HistorySectionProps {
  noteId: string
  onRestore: (version: NoteVersion) => Promise<void>
}

export function HistorySection({ noteId, onRestore }: HistorySectionProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [versions, setVersions] = useState<NoteVersion[] | null>(null)
  const [restoringId, setRestoringId] = useState<string | null>(null)

  async function handleOpen() {
    const next = !open
    setOpen(next)
    if (next && versions === null) {
      setLoading(true)
      try {
        setVersions(await notesService.listVersions(noteId))
      } finally {
        setLoading(false)
      }
    }
  }

  async function handleRestore(version: NoteVersion) {
    setRestoringId(version.id)
    try {
      await onRestore(version)
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleOpen}
        className="focus-ring flex w-full items-center justify-between text-xs font-medium text-white/60 hover:text-white/80"
      >
        <span className="flex items-center gap-1.5">
          <History className="h-3.5 w-3.5" />
          Version history
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="mt-2 max-h-48 space-y-1.5 overflow-y-auto rounded-lg border border-white/10 bg-white/[0.02] p-2">
          {loading ? (
            <div className="flex justify-center py-3">
              <Loader2 className="h-4 w-4 animate-spin text-white/40" />
            </div>
          ) : versions && versions.length > 0 ? (
            versions.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-white/[0.04]">
                <div className="min-w-0">
                  <p className="truncate text-xs text-white/70">{v.title}</p>
                  <p className="text-[10px] text-white/30">{formatDate(v.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRestore(v)}
                  disabled={restoringId === v.id}
                  className="focus-ring flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] text-indigo-300 hover:bg-indigo-400/10 disabled:opacity-50"
                >
                  {restoringId === v.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                  Restore
                </button>
              </div>
            ))
          ) : (
            <p className="px-2 py-2 text-xs text-white/30">No earlier versions yet — edit and save this note to start building history.</p>
          )}
        </div>
      )}
    </div>
  )
}
