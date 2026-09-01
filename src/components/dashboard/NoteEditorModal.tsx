import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Printer, X } from 'lucide-react'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { Button } from '@/components/ui/Button'
import { ColorSwatchPicker } from '@/components/dashboard/ColorSwatchPicker'
import { AttachmentsField } from '@/components/dashboard/AttachmentsField'
import { RichTextToolbar } from '@/components/dashboard/RichTextToolbar'
import { ShareSection } from '@/components/dashboard/ShareSection'
import { HistorySection } from '@/components/dashboard/HistorySection'
import { renderMarkdown } from '@/lib/markdown'
import { formatDate } from '@/utils/date'
import { cn } from '@/lib/utils'
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS, NOTE_PRIORITIES } from '@/types/appNote'
import type { AppNote, NoteCategory, NoteColor, NoteDraft, NotePriority, NoteVersion } from '@/types/appNote'

interface NoteEditorModalProps {
  open: boolean
  note: AppNote | null
  onClose: () => void
  onSave: (draft: NoteDraft) => Promise<unknown>
  onUploadAttachment: (attachment: { name: string; dataUrl: string; size: number }) => Promise<void>
  onRemoveAttachment: (attachmentId: string) => Promise<void>
  onEnableShare: () => Promise<AppNote>
  onDisableShare: () => Promise<void>
  onRestoreVersion: (version: NoteVersion) => Promise<void>
}

const EMPTY_DRAFT: NoteDraft = { title: '', content: '', category: 'personal', priority: 'medium', color: 'default', tags: [] }

export function NoteEditorModal({
  open,
  note,
  onClose,
  onSave,
  onUploadAttachment,
  onRemoveAttachment,
  onEnableShare,
  onDisableShare,
  onRestoreVersion,
}: NoteEditorModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<NoteCategory>('personal')
  const [priority, setPriority] = useState<NotePriority>('medium')
  const [color, setColor] = useState<NoteColor>('default')
  const [tagsInput, setTagsInput] = useState('')
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEscapeKey(onClose, open)

  useEffect(() => {
    if (!open) return
    const source = note ?? EMPTY_DRAFT
    setTitle(source.title)
    setContent(source.content)
    setCategory(source.category)
    setPriority(source.priority)
    setColor(source.color)
    setTagsInput(source.tags.join(', '))
    setTitleError(null)
    setTab('write')
  }, [open, note])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Title is required.')
      return
    }
    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        color,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleRestoreVersion(version: NoteVersion) {
    await onRestoreVersion(version)
    setTitle(version.title)
    setContent(version.content)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="no-print fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="modal-print-fix fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label={note ? 'Edit note' : 'Create note'}
              className="modal-print-fix panel-glass max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6"
            >
              <div className="no-print mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">{note ? 'Edit note' : 'New note'}</h2>
                <div className="flex items-center gap-1">
                  {note && (
                    <button
                      type="button"
                      onClick={() => window.print()}
                      aria-label="Print note"
                      title="Print note"
                      className="focus-ring rounded-lg p-1.5 text-ink/50 hover:bg-ink/[0.06] hover:text-ink"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="focus-ring rounded-lg p-1.5 text-ink/50 hover:bg-ink/[0.06] hover:text-ink"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {note && (
                <div className="print-only">
                  <h1>{note.title}</h1>
                  <p className="print-meta">
                    {NOTE_CATEGORY_LABELS[note.category]} · {note.priority} priority · Updated {formatDate(note.updatedAt)}
                    {note.tags.length > 0 && ` · #${note.tags.join(' #')}`}
                  </p>
                  <div
                    className="print-body"
                    dangerouslySetInnerHTML={{ __html: note.content.trim() ? renderMarkdown(note.content) : '<p>No content.</p>' }}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="no-print space-y-4">
                <div>
                  <label htmlFor="note-title" className="mb-1.5 block text-xs font-medium text-ink/60">
                    Title
                  </label>
                  <input
                    id="note-title"
                    autoFocus
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (titleError) setTitleError(null)
                    }}
                    placeholder="Note title"
                    className="focus-ring panel h-11 w-full rounded-lg px-3 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
                  />
                  {titleError && (
                    <p className="mt-1.5 text-xs font-medium text-rose-400" role="alert">
                      {titleError}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="note-content" className="block text-xs font-medium text-ink/60">
                      Content <span className="text-ink/30">(markdown supported)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {tab === 'write' && <RichTextToolbar textareaRef={textareaRef} value={content} onChange={setContent} />}
                      <div className="flex gap-0.5 rounded-md bg-ink/[0.04] p-0.5">
                        <button
                          type="button"
                          onClick={() => setTab('write')}
                          className={cn(
                            'rounded px-2 py-0.5 text-[11px] font-medium transition',
                            tab === 'write' ? 'bg-ink/10 text-ink' : 'text-ink/40 hover:text-ink/70',
                          )}
                        >
                          Write
                        </button>
                        <button
                          type="button"
                          onClick={() => setTab('preview')}
                          className={cn(
                            'rounded px-2 py-0.5 text-[11px] font-medium transition',
                            tab === 'preview' ? 'bg-ink/10 text-ink' : 'text-ink/40 hover:text-ink/70',
                          )}
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                  {tab === 'write' ? (
                    <textarea
                      id="note-content"
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your note... (**bold**, *italic*, - lists, `code`)"
                      rows={5}
                      className="focus-ring panel w-full resize-none rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
                    />
                  ) : (
                    <div
                      className="panel min-h-[7.5rem] rounded-lg px-3 py-2.5 text-sm leading-relaxed text-ink/80 prose-note"
                      dangerouslySetInnerHTML={{ __html: content.trim() ? renderMarkdown(content) : '<p class="text-ink/30">Nothing to preview yet.</p>' }}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="note-category" className="mb-1.5 block text-xs font-medium text-ink/60">
                      Category
                    </label>
                    <select
                      id="note-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as NoteCategory)}
                      className="focus-ring panel h-10 w-full rounded-lg px-3 text-sm text-ink"
                    >
                      {NOTE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {NOTE_CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="note-priority" className="mb-1.5 block text-xs font-medium text-ink/60">
                      Priority
                    </label>
                    <select
                      id="note-priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as NotePriority)}
                      className="focus-ring panel h-10 w-full rounded-lg px-3 text-sm text-ink capitalize"
                    >
                      {NOTE_PRIORITIES.map((p) => (
                        <option key={p} value={p} className="capitalize">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="note-tags" className="mb-1.5 block text-xs font-medium text-ink/60">
                    Tags <span className="text-ink/30">(comma-separated)</span>
                  </label>
                  <input
                    id="note-tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. urgent, meeting, follow-up"
                    className="focus-ring panel h-11 w-full rounded-lg px-3 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
                  />
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-medium text-ink/60">Color</p>
                  <ColorSwatchPicker value={color} onChange={setColor} />
                </div>

                {note ? (
                  <>
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-ink/60">
                        Attachments <span className="text-ink/30">(images)</span>
                      </p>
                      <AttachmentsField
                        attachments={note.attachments}
                        onUpload={onUploadAttachment}
                        onRemove={onRemoveAttachment}
                      />
                    </div>

                    <ShareSection note={note} onEnable={onEnableShare} onDisable={onDisableShare} />

                    <HistorySection noteId={note.id} onRestore={handleRestoreVersion} />
                  </>
                ) : (
                  <p className="text-[11px] text-ink/30">Save the note to attach images, share it, or see version history.</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {saving ? 'Saving…' : note ? 'Save changes' : 'Create note'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
