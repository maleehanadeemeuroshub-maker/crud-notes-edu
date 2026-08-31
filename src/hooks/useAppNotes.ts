import { useCallback, useEffect, useMemo, useState } from 'react'
import { notesService } from '@/services/notesService'
import { supabase } from '@/lib/supabaseClient'
import type { AppNote, NoteCategory, NoteDraft, NoteFilters } from '@/types/appNote'
import { DEFAULT_FILTERS } from '@/types/appNote'

interface UseAppNotesResult {
  notes: AppNote[]
  pinnedNotes: AppNote[]
  otherNotes: AppNote[]
  trash: AppNote[]
  tagCounts: { tag: string; count: number }[]
  loading: boolean
  trashLoading: boolean
  error: string | null
  filters: NoteFilters
  setFilters: (filters: NoteFilters) => void
  view: 'notes' | 'trash'
  setView: (view: 'notes' | 'trash') => void
  createNote: (draft: NoteDraft) => Promise<AppNote>
  importNotes: (drafts: NoteDraft[]) => Promise<number>
  updateNote: (id: string, draft: NoteDraft) => Promise<AppNote>
  togglePinned: (note: AppNote) => Promise<void>
  toggleFavorite: (note: AppNote) => Promise<void>
  moveToTrash: (id: string) => Promise<void>
  moveManyToTrash: (ids: string[]) => Promise<void>
  bulkSetCategory: (ids: string[], category: NoteCategory) => Promise<void>
  restoreNote: (id: string) => Promise<void>
  deletePermanently: (id: string) => Promise<void>
  uploadAttachment: (noteId: string, attachment: { name: string; dataUrl: string; size: number }) => Promise<void>
  removeAttachment: (noteId: string, attachmentId: string) => Promise<void>
  enableShare: (noteId: string) => Promise<AppNote>
  disableShare: (noteId: string) => Promise<void>
  renameTag: (oldTag: string, newTag: string | null) => Promise<void>
}

export function useAppNotes(): UseAppNotesResult {
  const [notes, setNotes] = useState<AppNote[]>([])
  const [trash, setTrash] = useState<AppNote[]>([])
  const [loading, setLoading] = useState(true)
  const [trashLoading, setTrashLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<NoteFilters>(DEFAULT_FILTERS)
  const [view, setView] = useState<'notes' | 'trash'>('notes')

  const loadNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setNotes(await notesService.list(false))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTrash = useCallback(async () => {
    setTrashLoading(true)
    try {
      setTrash(await notesService.list(true))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trash.')
    } finally {
      setTrashLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotes()
    loadTrash()
  }, [loadNotes, loadTrash])

  // Live sync: reflect INSERT/UPDATE/DELETE made from any other tab or device immediately.
  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    let cancelled = false

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || cancelled) return
      unsubscribe = notesService.subscribeToChanges(user.id, (note, eventType) => {
        if (eventType === 'DELETE') {
          setNotes((prev) => prev.filter((n) => n.id !== note.id))
          setTrash((prev) => prev.filter((n) => n.id !== note.id))
          return
        }
        const upsert = (list: AppNote[]) => {
          const exists = list.some((n) => n.id === note.id)
          return exists ? list.map((n) => (n.id === note.id ? note : n)) : [note, ...list]
        }
        if (note.deletedAt) {
          setNotes((prev) => prev.filter((n) => n.id !== note.id))
          setTrash(upsert)
        } else {
          setTrash((prev) => prev.filter((n) => n.id !== note.id))
          setNotes(upsert)
        }
      })
    })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const createNote = useCallback(async (draft: NoteDraft) => {
    const note = await notesService.create(draft)
    setNotes((prev) => (prev.some((n) => n.id === note.id) ? prev : [note, ...prev]))
    return note
  }, [])

  const importNotes = useCallback(async (drafts: NoteDraft[]) => {
    const created = await notesService.createMany(drafts)
    setNotes((prev) => [...created.filter((n) => !prev.some((p) => p.id === n.id)), ...prev])
    return created.length
  }, [])

  const updateNote = useCallback(async (id: string, draft: NoteDraft) => {
    const updated = await notesService.update(id, draft)
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
    return updated
  }, [])

  const togglePinned = useCallback(async (note: AppNote) => {
    const updated = await notesService.togglePinned(note.id, !note.pinned)
    setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)))
  }, [])

  const toggleFavorite = useCallback(async (note: AppNote) => {
    const updated = await notesService.toggleFavorite(note.id, !note.favorite)
    setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)))
  }, [])

  const moveToTrash = useCallback(async (id: string) => {
    const trashedNote = await notesService.softDelete(id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
    setTrash((prev) => [trashedNote, ...prev])
  }, [])

  const moveManyToTrash = useCallback(async (ids: string[]) => {
    const trashedNotes = await Promise.all(ids.map((id) => notesService.softDelete(id)))
    setNotes((prev) => prev.filter((n) => !ids.includes(n.id)))
    setTrash((prev) => [...trashedNotes, ...prev])
  }, [])

  const bulkSetCategory = useCallback(async (ids: string[], category: NoteCategory) => {
    const updated = await Promise.all(ids.map((id) => notesService.setCategory(id, category)))
    setNotes((prev) => prev.map((n) => updated.find((u) => u.id === n.id) ?? n))
  }, [])

  const restoreNote = useCallback(async (id: string) => {
    const restored = await notesService.restore(id)
    setTrash((prev) => prev.filter((n) => n.id !== id))
    setNotes((prev) => [restored, ...prev])
  }, [])

  const deletePermanently = useCallback(async (id: string) => {
    await notesService.deletePermanently(id)
    setTrash((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const uploadAttachment = useCallback(
    async (noteId: string, attachment: { name: string; dataUrl: string; size: number }) => {
      const updated = await notesService.uploadAttachment(noteId, attachment)
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)))
    },
    [],
  )

  const removeAttachment = useCallback(async (noteId: string, attachmentId: string) => {
    const updated = await notesService.removeAttachment(noteId, attachmentId)
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)))
  }, [])

  const enableShare = useCallback(async (noteId: string) => {
    const updated = await notesService.enableShare(noteId)
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)))
    return updated
  }, [])

  const disableShare = useCallback(async (noteId: string) => {
    const updated = await notesService.disableShare(noteId)
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)))
  }, [])

  const renameTag = useCallback(
    async (oldTag: string, newTag: string | null) => {
      await notesService.renameTagEverywhere(oldTag, newTag)
      await loadNotes()
    },
    [loadNotes],
  )

  const filteredNotes = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    let result = notes.filter((note) => {
      if (filters.category !== 'all' && note.category !== filters.category) return false
      if (filters.favoriteOnly && !note.favorite) return false
      if (filters.pinnedOnly && !note.pinned) return false
      if (!query) return true
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })

    result = [...result].sort((a, b) => {
      switch (filters.sort) {
        case 'oldest':
          return a.createdAt.localeCompare(b.createdAt)
        case 'updated':
          return b.updatedAt.localeCompare(a.updatedAt)
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        case 'newest':
        default:
          return b.createdAt.localeCompare(a.createdAt)
      }
    })

    return result
  }, [notes, filters])

  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.pinned), [filteredNotes])
  const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.pinned), [filteredNotes])

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const note of notes) {
      for (const tag of note.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  }, [notes])

  return {
    notes: filteredNotes,
    pinnedNotes,
    otherNotes,
    trash,
    tagCounts,
    loading,
    trashLoading,
    error,
    filters,
    setFilters,
    view,
    setView,
    createNote,
    importNotes,
    updateNote,
    togglePinned,
    toggleFavorite,
    moveToTrash,
    moveManyToTrash,
    bulkSetCategory,
    restoreNote,
    deletePermanently,
    uploadAttachment,
    removeAttachment,
    enableShare,
    disableShare,
    renameTag,
  }
}
