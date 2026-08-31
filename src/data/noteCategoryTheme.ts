import type { NoteCategory, NotePriority } from '@/types/appNote'

export const CATEGORY_COLORS: Record<NoteCategory, string> = {
  personal: '#38bdf8',
  work: '#818cf8',
  ideas: '#c026d3',
  study: '#34d399',
  other: '#fb923c',
}

export const PRIORITY_COLORS: Record<NotePriority, string> = {
  low: '#94a3b8',
  medium: '#38bdf8',
  high: '#fb7185',
}
