import type { RefObject } from 'react'
import { Bold, Italic, Link2, List, ListOrdered } from 'lucide-react'

interface RichTextToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (value: string) => void
}

type WrapKind = 'bold' | 'italic' | 'bullet' | 'numbered' | 'link'

function applyWrap(kind: WrapKind, value: string, start: number, end: number): { text: string; selStart: number; selEnd: number } {
  const selected = value.slice(start, end)

  if (kind === 'bold' || kind === 'italic') {
    const marker = kind === 'bold' ? '**' : '*'
    const inner = selected || (kind === 'bold' ? 'bold text' : 'italic text')
    const text = value.slice(0, start) + marker + inner + marker + value.slice(end)
    return { text, selStart: start + marker.length, selEnd: start + marker.length + inner.length }
  }

  if (kind === 'link') {
    const label = selected || 'link text'
    const insert = `[${label}](https://)`
    const text = value.slice(0, start) + insert + value.slice(end)
    const urlStart = start + label.length + 3
    return { text, selStart: urlStart, selEnd: urlStart + 8 }
  }

  // bullet / numbered: prefix each selected line (or the current line if nothing is selected)
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const lineEndSearch = value.indexOf('\n', end)
  const lineEnd = lineEndSearch === -1 ? value.length : lineEndSearch
  const block = value.slice(lineStart, lineEnd)
  const lines = block.split('\n')
  const prefixed = lines.map((line, i) => (kind === 'bullet' ? `- ${line}` : `${i + 1}. ${line}`)).join('\n')
  const text = value.slice(0, lineStart) + prefixed + value.slice(lineEnd)
  return { text, selStart: lineStart, selEnd: lineStart + prefixed.length }
}

export function RichTextToolbar({ textareaRef, value, onChange }: RichTextToolbarProps) {
  function run(kind: WrapKind) {
    const el = textareaRef.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const { text, selStart, selEnd } = applyWrap(kind, value, start, end)
    onChange(text)
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(selStart, selEnd)
    })
  }

  const buttons: { kind: WrapKind; icon: typeof Bold; label: string }[] = [
    { kind: 'bold', icon: Bold, label: 'Bold' },
    { kind: 'italic', icon: Italic, label: 'Italic' },
    { kind: 'bullet', icon: List, label: 'Bullet list' },
    { kind: 'numbered', icon: ListOrdered, label: 'Numbered list' },
    { kind: 'link', icon: Link2, label: 'Link' },
  ]

  return (
    <div className="flex items-center gap-0.5 rounded-md bg-white/[0.04] p-0.5">
      {buttons.map(({ kind, icon: Icon, label }) => (
        <button
          key={kind}
          type="button"
          onClick={() => run(kind)}
          aria-label={label}
          title={label}
          className="focus-ring flex h-6 w-6 items-center justify-center rounded text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  )
}
