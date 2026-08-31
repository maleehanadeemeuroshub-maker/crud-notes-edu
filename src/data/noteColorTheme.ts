import type { NoteColor } from '@/types/appNote'

export const NOTE_COLOR_HEX: Record<NoteColor, string | null> = {
  default: null,
  red: '#fb7185',
  amber: '#fbbf24',
  emerald: '#34d399',
  sky: '#38bdf8',
  violet: '#a78bfa',
  pink: '#f472b6',
}

export const NOTE_COLOR_LABELS: Record<NoteColor, string> = {
  default: 'Default',
  red: 'Red',
  amber: 'Amber',
  emerald: 'Emerald',
  sky: 'Sky',
  violet: 'Violet',
  pink: 'Pink',
}
