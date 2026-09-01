import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckSquare, LogOut, NotebookPen, Pin, Plus, RefreshCcw, Settings as SettingsIcon, Trash2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useAppNotes } from '@/hooks/useAppNotes'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { FilterBar } from '@/components/dashboard/FilterBar'
import { NoteCard } from '@/components/dashboard/NoteCard'
import { TrashNoteCard } from '@/components/dashboard/TrashNoteCard'
import { NoteEditorModal } from '@/components/dashboard/NoteEditorModal'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatsStrip } from '@/components/dashboard/StatsStrip'
import { ViewToggle } from '@/components/dashboard/ViewToggle'
import { BulkActionBar } from '@/components/dashboard/BulkActionBar'
import { ExportImportMenu } from '@/components/dashboard/ExportImportMenu'
import { TagsPanel } from '@/components/dashboard/TagsPanel'
import type { AppNote, NoteCategory, NoteVersion, NoteViewMode } from '@/types/appNote'

export function Dashboard() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const notesState = useAppNotes()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<AppNote | null>(null)
  const [viewMode, setViewMode] = useLocalStorageState<NoteViewMode>('crud-notes:view-mode:v1', 'grid')
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const searchInputRef = useRef<HTMLInputElement>(null)

  const firstName = user?.fullName.split(' ')[0] ?? 'there'

  // Editing note object can go stale after an attachment upload updates it in notesState; keep it in sync.
  const activeEditingNote = editingNote ? (notesState.notes.find((n) => n.id === editingNote.id) ?? editingNote) : null

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const isTyping = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (isTyping || editorOpen) return

      if (e.key === 'n') {
        e.preventDefault()
        setEditingNote(null)
        setEditorOpen(true)
      } else if (e.key === '/') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [editorOpen])

  function openCreate() {
    setEditingNote(null)
    setEditorOpen(true)
  }

  function openEdit(note: AppNote) {
    setEditingNote(note)
    setEditorOpen(true)
  }

  function toggleSelectionMode() {
    setSelectionMode((v) => !v)
    setSelectedIds(new Set())
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSave(draft: Parameters<typeof notesState.createNote>[0]) {
    try {
      if (editingNote) {
        await notesState.updateNote(editingNote.id, draft)
        showToast('Note updated.', 'success')
      } else {
        await notesState.createNote(draft)
        showToast('Note created.', 'success')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not save note.', 'error')
      throw err
    }
  }

  async function handleDelete(id: string) {
    try {
      await notesState.moveToTrash(id)
      showToast('Note moved to trash.', 'info', { label: 'Undo', onClick: () => notesState.restoreNote(id) })
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete note.', 'error')
    }
  }

  async function handleTogglePinned(note: AppNote) {
    try {
      await notesState.togglePinned(note)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update note.', 'error')
    }
  }

  async function handleToggleFavorite(note: AppNote) {
    try {
      await notesState.toggleFavorite(note)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update note.', 'error')
    }
  }

  async function handleRestore(id: string) {
    try {
      await notesState.restoreNote(id)
      showToast('Note restored.', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not restore note.', 'error')
    }
  }

  async function handleDeleteForever(id: string) {
    try {
      await notesState.deletePermanently(id)
      showToast('Note permanently deleted.', 'info')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete note.', 'error')
    }
  }

  async function handleBulkTrash() {
    const ids = Array.from(selectedIds)
    try {
      await notesState.moveManyToTrash(ids)
      showToast(`${ids.length} note${ids.length === 1 ? '' : 's'} moved to trash.`, 'info', {
        label: 'Undo',
        onClick: () => ids.forEach((id) => notesState.restoreNote(id)),
      })
      setSelectedIds(new Set())
      setSelectionMode(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete notes.', 'error')
    }
  }

  async function handleBulkCategory(category: NoteCategory) {
    const ids = Array.from(selectedIds)
    try {
      await notesState.bulkSetCategory(ids, category)
      showToast(`${ids.length} note${ids.length === 1 ? '' : 's'} moved.`, 'success')
      setSelectedIds(new Set())
      setSelectionMode(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update notes.', 'error')
    }
  }

  async function handleUploadAttachment(attachment: { name: string; dataUrl: string; size: number }) {
    if (!editingNote) return
    try {
      await notesState.uploadAttachment(editingNote.id, attachment)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not upload image.', 'error')
    }
  }

  async function handleRemoveAttachment(attachmentId: string) {
    if (!editingNote) return
    try {
      await notesState.removeAttachment(editingNote.id, attachmentId)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not remove image.', 'error')
    }
  }

  async function handleLogout() {
    await logout()
    showToast('Signed out.', 'info')
  }

  async function handleEnableShare() {
    if (!editingNote) throw new Error('No note selected.')
    try {
      return await notesState.enableShare(editingNote.id)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not enable sharing.', 'error')
      throw err
    }
  }

  async function handleDisableShare() {
    if (!editingNote) return
    try {
      await notesState.disableShare(editingNote.id)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not disable sharing.', 'error')
    }
  }

  async function handleRestoreVersion(version: NoteVersion) {
    if (!editingNote) return
    try {
      await notesState.updateNote(editingNote.id, {
        title: version.title,
        content: version.content,
        category: editingNote.category,
        priority: editingNote.priority,
        color: editingNote.color,
        tags: editingNote.tags,
      })
      showToast('Version restored.', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not restore that version.', 'error')
    }
  }

  async function handleImport(drafts: Parameters<typeof notesState.importNotes>[0]) {
    return notesState.importNotes(drafts)
  }

  const gridClass = viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-3'

  return (
    <>
    <div className="no-print mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-indigo-400">Dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-ink/45">Press "n" to add a note, "/" to search.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New note
            </Button>
            <NavLink to="/settings" aria-label="Settings" className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg text-ink/50 transition hover:bg-ink/[0.06] hover:text-ink">
              <SettingsIcon className="h-4 w-4" />
            </NavLink>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-6">
          <StatsStrip notes={notesState.notes} trashCount={notesState.trash.length} />
        </div>
      </Reveal>

      <div className="mt-8 flex items-center gap-1 border-b border-ink/8">
        <button
          type="button"
          onClick={() => notesState.setView('notes')}
          className={cn(
            'focus-ring relative flex items-center gap-1.5 px-3 pb-3 text-sm font-medium transition',
            notesState.view === 'notes' ? 'text-ink' : 'text-ink/45 hover:text-ink/75',
          )}
        >
          <NotebookPen className="h-3.5 w-3.5" />
          Notes
          {notesState.view === 'notes' && (
            <motion.span layoutId="dashboard-tab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-indigo-400" />
          )}
        </button>
        <button
          type="button"
          onClick={() => notesState.setView('trash')}
          className={cn(
            'focus-ring relative flex items-center gap-1.5 px-3 pb-3 text-sm font-medium transition',
            notesState.view === 'trash' ? 'text-ink' : 'text-ink/45 hover:text-ink/75',
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Trash
          {notesState.trash.length > 0 && (
            <span className="rounded-full bg-ink/10 px-1.5 text-[10px] text-ink/60">{notesState.trash.length}</span>
          )}
          {notesState.view === 'trash' && (
            <motion.span layoutId="dashboard-tab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-indigo-400" />
          )}
        </button>
      </div>

      {notesState.error && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300">
          <span>{notesState.error}</span>
          <Button size="sm" variant="ghost" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      )}

      {notesState.view === 'notes' ? (
        <div className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <FilterBar filters={notesState.filters} onChange={notesState.setFilters} searchRef={searchInputRef} />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ExportImportMenu
                notes={notesState.notes}
                onImport={handleImport}
                onImported={(count) => showToast(`Imported ${count} note${count === 1 ? '' : 's'}.`, 'success')}
                onError={(message) => showToast(message, 'error')}
              />
              <ViewToggle value={viewMode} onChange={setViewMode} />
              <Button
                size="sm"
                variant={selectionMode ? 'secondary' : 'ghost'}
                onClick={toggleSelectionMode}
                aria-pressed={selectionMode}
              >
                <CheckSquare className="h-3.5 w-3.5" />
                {selectionMode ? 'Cancel' : 'Select'}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {selectionMode && selectedIds.size > 0 && (
              <BulkActionBar
                count={selectedIds.size}
                onMoveToTrash={handleBulkTrash}
                onSetCategory={handleBulkCategory}
                onClear={() => setSelectedIds(new Set())}
              />
            )}
          </AnimatePresence>

          {notesState.tagCounts.length > 0 && (
            <div className="mt-4">
              <TagsPanel
                tagCounts={notesState.tagCounts}
                activeTag={notesState.filters.search}
                onFilterByTag={(tag) => notesState.setFilters({ ...notesState.filters, search: tag })}
                onRenameTag={notesState.renameTag}
              />
            </div>
          )}

          <div className="mt-6">
            {notesState.loading ? (
              <PageLoader />
            ) : notesState.notes.length === 0 ? (
              <EmptyState
                icon={<NotebookPen className="h-5 w-5" />}
                title={notesState.filters.search ? 'No notes found.' : "You don't have any notes yet."}
                description={notesState.filters.search ? 'Try another search.' : 'Create your first note to get started.'}
                action={
                  !notesState.filters.search && (
                    <Button size="sm" onClick={openCreate}>
                      <Plus className="h-3.5 w-3.5" />
                      Create your first note
                    </Button>
                  )
                }
              />
            ) : (
              <div className="space-y-8">
                {notesState.pinnedNotes.length > 0 && (
                  <div>
                    <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/40">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </p>
                    <motion.div layout className={gridClass}>
                      <AnimatePresence mode="popLayout">
                        {notesState.pinnedNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            view={viewMode}
                            onEdit={() => openEdit(note)}
                            onDelete={() => handleDelete(note.id)}
                            onTogglePinned={() => handleTogglePinned(note)}
                            onToggleFavorite={() => handleToggleFavorite(note)}
                            selectable={selectionMode}
                            selected={selectedIds.has(note.id)}
                            onToggleSelect={() => toggleSelected(note.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                )}

                {notesState.otherNotes.length > 0 && (
                  <div>
                    {notesState.pinnedNotes.length > 0 && (
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">Others</p>
                    )}
                    <motion.div layout className={gridClass}>
                      <AnimatePresence mode="popLayout">
                        {notesState.otherNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            view={viewMode}
                            onEdit={() => openEdit(note)}
                            onDelete={() => handleDelete(note.id)}
                            onTogglePinned={() => handleTogglePinned(note)}
                            onToggleFavorite={() => handleToggleFavorite(note)}
                            selectable={selectionMode}
                            selected={selectedIds.has(note.id)}
                            onToggleSelect={() => toggleSelected(note.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          {notesState.trashLoading ? (
            <PageLoader />
          ) : notesState.trash.length === 0 ? (
            <EmptyState
              icon={<Trash2 className="h-5 w-5" />}
              title="Trash is empty."
              description="Notes you delete will show up here for restoring or permanent removal."
            />
          ) : (
            <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {notesState.trash.map((note) => (
                  <TrashNoteCard
                    key={note.id}
                    note={note}
                    onRestore={() => handleRestore(note.id)}
                    onDeleteForever={() => handleDeleteForever(note.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

    </div>
      <NoteEditorModal
        open={editorOpen}
        note={activeEditingNote}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        onUploadAttachment={handleUploadAttachment}
        onRemoveAttachment={handleRemoveAttachment}
        onEnableShare={handleEnableShare}
        onDisableShare={handleDisableShare}
        onRestoreVersion={handleRestoreVersion}
      />
    </>
  )
}
