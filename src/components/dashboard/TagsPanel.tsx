import { useState } from 'react'
import { Check, Pencil, Tag, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagsPanelProps {
  tagCounts: { tag: string; count: number }[]
  activeTag: string
  onFilterByTag: (tag: string) => void
  onRenameTag: (oldTag: string, newTag: string | null) => Promise<void>
}

export function TagsPanel({ tagCounts, activeTag, onFilterByTag, onRenameTag }: TagsPanelProps) {
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [busyTag, setBusyTag] = useState<string | null>(null)

  if (tagCounts.length === 0) return null

  async function commitRename(oldTag: string) {
    const trimmed = draftName.trim()
    setEditingTag(null)
    if (!trimmed || trimmed === oldTag) return
    setBusyTag(oldTag)
    try {
      await onRenameTag(oldTag, trimmed)
    } finally {
      setBusyTag(null)
    }
  }

  async function handleDelete(tag: string) {
    setBusyTag(tag)
    try {
      await onRenameTag(tag, null)
    } finally {
      setBusyTag(null)
    }
  }

  return (
    <div className="panel rounded-xl p-3">
      <p className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-white/40">
        <Tag className="h-3 w-3" />
        Tags
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tagCounts.map(({ tag, count }) =>
          editingTag === tag ? (
            <div key={tag} className="flex items-center gap-1 rounded-md bg-white/[0.06] px-1.5 py-1">
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename(tag)
                  if (e.key === 'Escape') setEditingTag(null)
                }}
                className="focus-ring w-24 rounded bg-transparent text-xs text-white outline-none"
              />
              <button type="button" onClick={() => commitRename(tag)} aria-label="Save tag name" className="text-emerald-400 hover:text-emerald-300">
                <Check className="h-3 w-3" />
              </button>
              <button type="button" onClick={() => setEditingTag(null)} aria-label="Cancel" className="text-white/40 hover:text-white/70">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div
              key={tag}
              className={cn(
                'group flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition',
                activeTag === tag ? 'bg-indigo-400/15 text-indigo-300' : 'bg-white/[0.04] text-white/55 hover:bg-white/[0.07]',
                busyTag === tag && 'opacity-50',
              )}
            >
              <button type="button" onClick={() => onFilterByTag(activeTag === tag ? '' : tag)} className="focus-ring">
                #{tag} <span className="text-white/30">{count}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingTag(tag)
                  setDraftName(tag)
                }}
                aria-label={`Rename ${tag}`}
                className="focus-ring opacity-0 transition group-hover:opacity-100 hover:text-white"
              >
                <Pencil className="h-2.5 w-2.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(tag)}
                aria-label={`Delete ${tag} tag`}
                className="focus-ring opacity-0 transition group-hover:opacity-100 hover:text-rose-300"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
