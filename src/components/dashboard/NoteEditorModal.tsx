import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { Button } from '@/components/ui/Button'
import { ColorSwatchPicker } from '@/components/dashboard/ColorSwatchPicker'
import { AttachmentsField } from '@/components/dashboard/AttachmentsField'
import { renderMarkdown } from '@/lib/markdown'
import { cn } from '@/lib/utils'
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS, NOTE_PRIORITIES } from '@/types/appNote'
import type { AppNote, NoteCategory, NoteColor, NoteDraft, NotePriority } from '@/types/appNote'

interface NoteEditorModalProps {
  open: boolean
  note: AppNote | null
  onClose: () => void
  onSave: (draft: NoteDraft) => Promise<unknown>
  onUploadAttachment: (attachment: { name: string; dataUrl: string; size: number }) => Promise<void>
  onRemoveAttachment: (attachmentId: string) => Promise<void>
}

const EMPTY_DRAFT: NoteDraft = { title: '', content: '', category: 'personal', priority: 'medium', color: 'default', tags: [] }

export function NoteEditorModal({ open, note, onClose, onSave, onUploadAttachment, onRemoveAttachment }: NoteEditorModalProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label={note ? 'Edit note' : 'Create note'}
              className="panel-glass max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{note ? 'Edit note' : 'New note'}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="focus-ring rounded-lg p-1.5 text-white/50 hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="note-title" className="mb-1.5 block text-xs font-medium text-white/60">
                    Title
                  </label>
                  <input
                    id="note-title"
                    autoFocus
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (titleError) setTitleError(null)
                    }}
                    placeholder="Note title"
                    className="focus-ring panel h-11 w-full rounded-lg px-3 text-sm text-white placeholder:text-white/35 focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
                  />
                  {titleError && (
                    <p className="mt-1.5 text-xs font-medium text-rose-400" role="alert">
                      {titleError}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="note-content" className="block text-xs font-medium text-white/60">
                      Content <span className="text-white/30">(markdown supported)</span>
                    </label>
                    <div className="flex gap-0.5 rounded-md bg-white/[0.04] p-0.5">
                      <button
                        type="button"
                        onClick={() => setTab('write')}
                        className={cn(
                          'rounded px-2 py-0.5 text-[11px] font-medium transition',
                          tab === 'write' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70',
                        )}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab('preview')}
                        className={cn(
                          'rounded px-2 py-0.5 text-[11px] font-medium transition',
                          tab === 'preview' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70',
                        )}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  {tab === 'write' ? (
                    <textarea
                      id="note-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your note... (**bold**, *italic*, - lists, `code`)"
                      rows={5}
                      className="focus-ring panel w-full resize-none rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
                    />
                  ) : (
                    <div
                      className="panel min-h-[7.5rem] rounded-lg px-3 py-2.5 text-sm leading-relaxed text-white/80 prose-note"
                      dangerouslySetInnerHTML={{ __html: content.trim() ? renderMarkdown(content) : '<p class="text-white/30">Nothing to preview yet.</p>' }}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="note-category" className="mb-1.5 block text-xs font-medium text-white/60">
                      Category
                    </label>
                    <select
                      id="note-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as NoteCategory)}
                      className="focus-ring panel h-10 w-full rounded-lg px-3 text-sm text-white"
                    >
                      {NOTE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {NOTE_CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="note-priority" className="mb-1.5 block text-xs font-medium text-white/60">
                      Priority
                    </label>
                    <select
                      id="note-priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as NotePriority)}
                      className="focus-ring panel h-10 w-full rounded-lg px-3 text-sm text-white capitalize"
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
                  <label htmlFor="note-tags" className="mb-1.5 block text-xs font-medium text-white/60">
                    Tags <span className="text-white/30">(comma-separated)</span>
                  </label>
                  <input
                    id="note-tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. urgent, meeting, follow-up"
                    className="focus-ring panel h-11 w-full rounded-lg px-3 text-sm text-white placeholder:text-white/35 focus:border-indigo-400/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
                  />
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-medium text-white/60">Color</p>
                  <ColorSwatchPicker value={color} onChange={setColor} />
                </div>

                {note ? (
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-white/60">
                      Attachments <span className="text-white/30">(images)</span>
                    </p>
                    <AttachmentsField
                      attachments={note.attachments}
                      onUpload={onUploadAttachment}
                      onRemove={onRemoveAttachment}
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-white/30">Save the note to attach images.</p>
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
