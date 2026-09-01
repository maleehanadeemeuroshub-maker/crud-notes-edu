import type { AppNote, NoteDraft } from '@/types/appNote'
import { NOTE_CATEGORIES, NOTE_COLORS, NOTE_PRIORITIES } from '@/types/appNote'

interface ExportedNote {
  title: string
  content: string
  category: string
  priority: string
  color: string
  tags: string[]
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportNotesAsJson(notes: AppNote[]): void {
  const payload: ExportedNote[] = notes.map((n) => ({
    title: n.title,
    content: n.content,
    category: n.category,
    priority: n.priority,
    color: n.color,
    tags: n.tags,
  }))
  downloadBlob(JSON.stringify(payload, null, 2), `crud-notes-export-${Date.now()}.json`, 'application/json')
}

export function exportNotesAsMarkdown(notes: AppNote[]): void {
  const body = notes
    .map((n) => {
      const meta = `_${n.category} · ${n.priority} priority${n.tags.length ? ` · ${n.tags.map((t) => `#${t}`).join(' ')}` : ''}_`
      return `# ${n.title}\n\n${meta}\n\n${n.content || '*No content.*'}`
    })
    .join('\n\n---\n\n')
  downloadBlob(body, `crud-notes-export-${Date.now()}.md`, 'text/markdown')
}

/** Parses a previously-exported JSON file back into drafts ready for notesService.createMany(). */
export function parseImportedJson(raw: string): NoteDraft[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('That file is not valid JSON.')
  }
  if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of notes.')

  return parsed.map((item, index): NoteDraft => {
    if (typeof item !== 'object' || item === null) throw new Error(`Entry ${index + 1} is not an object.`)
    const raw = item as Partial<ExportedNote>
    if (!raw.title || typeof raw.title !== 'string') throw new Error(`Entry ${index + 1} is missing a title.`)

    return {
      title: raw.title,
      content: typeof raw.content === 'string' ? raw.content : '',
      category: NOTE_CATEGORIES.includes(raw.category as never) ? (raw.category as NoteDraft['category']) : 'other',
      priority: NOTE_PRIORITIES.includes(raw.priority as never) ? (raw.priority as NoteDraft['priority']) : 'medium',
      color: NOTE_COLORS.includes(raw.color as never) ? (raw.color as NoteDraft['color']) : 'default',
      tags: Array.isArray(raw.tags) ? raw.tags.filter((t): t is string => typeof t === 'string') : [],
      reminderAt: null,
    }
  })
}
