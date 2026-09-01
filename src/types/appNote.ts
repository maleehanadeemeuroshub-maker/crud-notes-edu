export type NoteCategory = 'personal' | 'work' | 'ideas' | 'study' | 'other'

export const NOTE_CATEGORIES: NoteCategory[] = ['personal', 'work', 'ideas', 'study', 'other']

export const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  personal: 'Personal',
  work: 'Work',
  ideas: 'Ideas',
  study: 'Study',
  other: 'Other',
}

export type NotePriority = 'low' | 'medium' | 'high'

export const NOTE_PRIORITIES: NotePriority[] = ['low', 'medium', 'high']

export type NoteColor = 'default' | 'red' | 'amber' | 'emerald' | 'sky' | 'violet' | 'pink'

export const NOTE_COLORS: NoteColor[] = ['default', 'red', 'amber', 'emerald', 'sky', 'violet', 'pink']

export interface NoteAttachment {
  id: string
  name: string
  dataUrl: string
  size: number
}

export interface AppNote {
  id: string
  userId: string
  title: string
  content: string
  category: NoteCategory
  priority: NotePriority
  color: NoteColor
  tags: string[]
  attachments: NoteAttachment[]
  pinned: boolean
  favorite: boolean
  shareId: string | null
  shareEnabled: boolean
  reminderAt: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface NoteVersion {
  id: string
  noteId: string
  title: string
  content: string
  createdAt: string
}

export interface NoteDraft {
  title: string
  content: string
  category: NoteCategory
  priority: NotePriority
  color: NoteColor
  tags: string[]
  reminderAt: string | null
}

export type NoteSort = 'newest' | 'oldest' | 'updated' | 'title-asc' | 'title-desc'

export interface NoteFilters {
  search: string
  category: NoteCategory | 'all'
  favoriteOnly: boolean
  pinnedOnly: boolean
  reminderOnly: boolean
  sort: NoteSort
}

export const DEFAULT_FILTERS: NoteFilters = {
  search: '',
  category: 'all',
  favoriteOnly: false,
  pinnedOnly: false,
  reminderOnly: false,
  sort: 'newest',
}

export type NoteViewMode = 'grid' | 'list'

/** Trashed notes are permanently purged after this many days (mimics Gmail/Keep trash retention). */
export const TRASH_RETENTION_DAYS = 30
