import { supabase } from '@/lib/supabaseClient'
import type { AppNote, NoteCategory, NoteDraft, NoteVersion } from '@/types/appNote'
import type { RealtimeChannel } from '@supabase/supabase-js'

/** Notes CRUD goes through the Supabase JS SDK (PostgREST under the hood) against the `notes` table — see supabase/schema.sql. */

interface NoteRow {
  id: string
  user_id: string
  title: string
  content: string
  category: string
  priority: string
  color: string
  tags: string[]
  attachments: AppNote['attachments']
  pinned: boolean
  favorite: boolean
  share_id: string | null
  share_enabled: boolean
  reminder_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

interface NoteVersionRow {
  id: string
  note_id: string
  title: string
  content: string
  created_at: string
}

function rowToNote(row: NoteRow): AppNote {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    category: row.category as AppNote['category'],
    priority: row.priority as AppNote['priority'],
    color: row.color as AppNote['color'],
    tags: row.tags,
    attachments: row.attachments,
    pinned: row.pinned,
    favorite: row.favorite,
    shareId: row.share_id,
    shareEnabled: row.share_enabled,
    reminderAt: row.reminder_at,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function rowToVersion(row: NoteVersionRow): NoteVersion {
  return { id: row.id, noteId: row.note_id, title: row.title, content: row.content, createdAt: row.created_at }
}

async function requireUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in.')
  return user.id
}

export const notesService = {
  async list(trashed = false): Promise<AppNote[]> {
    const userId = await requireUserId()
    let query = supabase.from('notes').select('*').eq('user_id', userId)
    query = trashed ? query.not('deleted_at', 'is', null) : query.is('deleted_at', null)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data as NoteRow[]).map(rowToNote)
  },

  async create(draft: NoteDraft): Promise<AppNote> {
    const userId = await requireUserId()
    const { reminderAt, ...rest } = draft
    const { data, error } = await supabase
      .from('notes')
      .insert({ ...rest, reminder_at: reminderAt, user_id: userId })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  /** Bulk create, used by note import. */
  async createMany(drafts: NoteDraft[]): Promise<AppNote[]> {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('notes')
      .insert(
        drafts.map(({ reminderAt, ...rest }) => ({ ...rest, reminder_at: reminderAt, user_id: userId })),
      )
      .select()
    if (error) throw new Error(error.message)
    return (data as NoteRow[]).map(rowToNote)
  },

  async update(id: string, patch: Partial<NoteDraft>): Promise<AppNote> {
    const { reminderAt, ...rest } = patch
    const payload: Record<string, unknown> = { ...rest }
    if ('reminderAt' in patch) payload.reminder_at = reminderAt
    const { data, error } = await supabase.from('notes').update(payload).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  async togglePinned(id: string, pinned: boolean): Promise<AppNote> {
    const { data, error } = await supabase.from('notes').update({ pinned }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  async toggleFavorite(id: string, favorite: boolean): Promise<AppNote> {
    const { data, error } = await supabase.from('notes').update({ favorite }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  async setCategory(id: string, category: NoteCategory): Promise<AppNote> {
    const { data, error } = await supabase.from('notes').update({ category }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  /** Renames a tag across every one of the user's notes that has it (or removes it if newTag is null). */
  async renameTagEverywhere(oldTag: string, newTag: string | null): Promise<void> {
    const { data, error } = await supabase.from('notes').select('id, tags').contains('tags', [oldTag])
    if (error) throw new Error(error.message)

    const rows = data as { id: string; tags: string[] }[]
    await Promise.all(
      rows.map((row) => {
        const nextTags = newTag
          ? row.tags.map((t) => (t === oldTag ? newTag : t))
          : row.tags.filter((t) => t !== oldTag)
        return supabase.from('notes').update({ tags: Array.from(new Set(nextTags)) }).eq('id', row.id)
      }),
    )
  },

  async softDelete(id: string): Promise<AppNote> {
    const { data, error } = await supabase
      .from('notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  async restore(id: string): Promise<AppNote> {
    const { data, error } = await supabase.from('notes').update({ deleted_at: null }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  async deletePermanently(id: string): Promise<void> {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async uploadAttachment(id: string, attachment: { name: string; dataUrl: string; size: number }): Promise<AppNote> {
    const { data: existing, error: fetchError } = await supabase.from('notes').select('attachments').eq('id', id).single()
    if (fetchError) throw new Error(fetchError.message)

    const attachments = [...(existing as Pick<NoteRow, 'attachments'>).attachments, { id: crypto.randomUUID(), ...attachment }]
    const { data, error } = await supabase.from('notes').update({ attachments }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  async removeAttachment(id: string, attachmentId: string): Promise<AppNote> {
    const { data: existing, error: fetchError } = await supabase.from('notes').select('attachments').eq('id', id).single()
    if (fetchError) throw new Error(fetchError.message)

    const attachments = (existing as Pick<NoteRow, 'attachments'>).attachments.filter((a) => a.id !== attachmentId)
    const { data, error } = await supabase.from('notes').update({ attachments }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  async enableShare(id: string): Promise<AppNote> {
    const { data, error } = await supabase
      .from('notes')
      .update({ share_id: crypto.randomUUID(), share_enabled: true })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  async disableShare(id: string): Promise<AppNote> {
    const { data, error } = await supabase.from('notes').update({ share_enabled: false }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  /** Public fetch by share link — relies on the "Anyone can view a publicly shared note" RLS policy, no auth needed. */
  async getSharedNote(shareId: string): Promise<AppNote | null> {
    const { data, error } = await supabase.from('notes').select('*').eq('share_id', shareId).eq('share_enabled', true).maybeSingle()
    if (error) throw new Error(error.message)
    return data ? rowToNote(data as NoteRow) : null
  },

  async listVersions(noteId: string): Promise<NoteVersion[]> {
    const { data, error } = await supabase
      .from('note_versions')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data as NoteVersionRow[]).map(rowToVersion)
  },

  async restoreVersion(noteId: string, version: NoteVersion): Promise<AppNote> {
    const { data, error } = await supabase
      .from('notes')
      .update({ title: version.title, content: version.content })
      .eq('id', noteId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return rowToNote(data as NoteRow)
  },

  /** Live INSERT/UPDATE/DELETE on this user's notes — keeps every open tab/device in sync. Call the returned unsubscribe on unmount. */
  subscribeToChanges(userId: string, onChange: (note: AppNote, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void): () => void {
    const channel: RealtimeChannel = supabase
      .channel(`notes-changes-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes', filter: `user_id=eq.${userId}` },
        (payload) => {
          const row = (payload.eventType === 'DELETE' ? payload.old : payload.new) as NoteRow
          onChange(rowToNote(row), payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE')
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}
