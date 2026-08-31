import { useRef, useState } from 'react'
import { ChevronDown, Download, Loader2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { exportNotesAsJson, exportNotesAsMarkdown, parseImportedJson } from '@/lib/exportImport'
import type { AppNote } from '@/types/appNote'

interface ExportImportMenuProps {
  notes: AppNote[]
  onImport: (drafts: ReturnType<typeof parseImportedJson>) => Promise<number>
  onImported: (count: number) => void
  onError: (message: string) => void
}

export function ExportImportMenu({ notes, onImport, onImported, onError }: ExportImportMenuProps) {
  const [open, setOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEscapeKey(() => setOpen(false), open)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      const drafts = parseImportedJson(text)
      const count = await onImport(drafts)
      onImported(count)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not import that file.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="focus-ring panel flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-white/70 hover:text-white"
      >
        {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        Export / Import
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="menu"
            className="panel-glass absolute right-0 top-11 z-20 w-52 rounded-xl p-1.5 shadow-2xl shadow-black/40"
          >
            <button
              type="button"
              role="menuitem"
              disabled={notes.length === 0}
              onClick={() => {
                exportNotesAsJson(notes)
                setOpen(false)
              }}
              className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white/75 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              Export as JSON
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={notes.length === 0}
              onClick={() => {
                exportNotesAsMarkdown(notes)
                setOpen(false)
              }}
              className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white/75 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              Export as Markdown
            </button>
            <div className="my-1 h-px bg-white/8" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                fileInputRef.current?.click()
                setOpen(false)
              }}
              className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white/75 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Upload className="h-3.5 w-3.5" />
              Import from JSON
            </button>
          </div>
        </>
      )}

      <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
