import { useState } from 'react'
import { Check, Copy, Loader2, Share2 } from 'lucide-react'
import type { AppNote } from '@/types/appNote'

interface ShareSectionProps {
  note: AppNote
  onEnable: () => Promise<AppNote>
  onDisable: () => Promise<void>
}

export function ShareSection({ note, onEnable, onDisable }: ShareSectionProps) {
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = note.shareId ? `${window.location.origin}/shared/${note.shareId}` : null

  async function handleToggle() {
    setBusy(true)
    try {
      if (note.shareEnabled) await onDisable()
      else await onEnable()
    } finally {
      setBusy(false)
    }
  }

  async function handleCopy() {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-medium text-white/60">
          <Share2 className="h-3.5 w-3.5" />
          Public share link
        </p>
        <button
          type="button"
          onClick={handleToggle}
          disabled={busy}
          aria-pressed={note.shareEnabled}
          className={`focus-ring flex h-6 w-11 items-center rounded-full px-0.5 transition ${note.shareEnabled ? 'bg-indigo-500' : 'bg-white/10'}`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${note.shareEnabled ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {note.shareEnabled && shareUrl && (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <span className="flex-1 truncate text-xs text-white/60">{shareUrl}</span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy share link"
            className="focus-ring flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/50 hover:text-white"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
      {!note.shareEnabled && <p className="mt-1 text-[11px] text-white/30">Anyone with the link can view a read-only copy.</p>}
    </div>
  )
}
