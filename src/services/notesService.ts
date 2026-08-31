import { tokenStorage } from '@/lib/tokenStorage'
import { UNAUTHORIZED_EVENT } from '@/lib/http'
import type { AppNote, NoteDraft } from '@/types/appNote'

/**
 * Notes CRUD goes through the native Fetch API directly (axios is used for
 * auth in services/authService.ts) so both HTTP clients are demonstrated.
 */

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStorage.getToken()
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }

  if (response.status === 204) {
    return undefined as T
  }

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body.message ?? `Request failed with status ${response.status}.`)
  }
  return body as T
}

export const notesService = {
  async list(trashed = false): Promise<AppNote[]> {
    const { notes } = await request<{ notes: AppNote[] }>(`/notes?trashed=${trashed}`)
    return notes
  },

  async create(draft: NoteDraft): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>('/notes', {
      method: 'POST',
      body: JSON.stringify(draft),
    })
    return note
  },

  async update(id: string, patch: Partial<NoteDraft>): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
    return note
  },

  async togglePinned(id: string, pinned: boolean): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ pinned }),
    })
    return note
  },

  async toggleFavorite(id: string, favorite: boolean): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ favorite }),
    })
    return note
  },

  async setCategory(id: string, category: AppNote['category']): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ category }),
    })
    return note
  },

  async softDelete(id: string): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>(`/notes/${id}`, { method: 'DELETE' })
    return note
  },

  async restore(id: string): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>(`/notes/${id}/restore`, { method: 'POST' })
    return note
  },

  async deletePermanently(id: string): Promise<void> {
    await request<void>(`/notes/${id}/permanent`, { method: 'DELETE' })
  },

  async uploadAttachment(id: string, attachment: { name: string; dataUrl: string; size: number }): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>(`/notes/${id}/attachments`, {
      method: 'POST',
      body: JSON.stringify(attachment),
    })
    return note
  },

  async removeAttachment(id: string, attachmentId: string): Promise<AppNote> {
    const { note } = await request<{ note: AppNote }>(`/notes/${id}/attachments/${attachmentId}`, {
      method: 'DELETE',
    })
    return note
  },
}
