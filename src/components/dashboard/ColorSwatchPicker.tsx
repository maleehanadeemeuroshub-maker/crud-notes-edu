import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NOTE_COLORS } from '@/types/appNote'
import type { NoteColor } from '@/types/appNote'
import { NOTE_COLOR_HEX, NOTE_COLOR_LABELS } from '@/data/noteColorTheme'

interface ColorSwatchPickerProps {
  value: NoteColor
  onChange: (color: NoteColor) => void
}

export function ColorSwatchPicker({ value, onChange }: ColorSwatchPickerProps) {
  return (
    <div role="radiogroup" aria-label="Note color" className="flex flex-wrap gap-2">
      {NOTE_COLORS.map((color) => {
        const hex = NOTE_COLOR_HEX[color]
        const selected = value === color
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={NOTE_COLOR_LABELS[color]}
            title={NOTE_COLOR_LABELS[color]}
            onClick={() => onChange(color)}
            className={cn(
              'focus-ring flex h-7 w-7 items-center justify-center rounded-full border transition',
              selected ? 'border-white/60 ring-2 ring-white/30' : 'border-white/15 hover:border-white/35',
            )}
            style={{ background: hex ?? 'rgba(255,255,255,0.06)' }}
          >
            {selected && <Check className={cn('h-3.5 w-3.5', hex ? 'text-black/70' : 'text-white/70')} />}
          </button>
        )
      })}
    </div>
  )
}
