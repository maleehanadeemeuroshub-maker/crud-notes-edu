import { useRef, useState } from 'react'
import { Loader2, Paperclip, X } from 'lucide-react'
import { fileToDataUrl, formatBytes } from '@/lib/image'
import type { NoteAttachment } from '@/types/appNote'

interface AttachmentsFieldProps {
  attachments: NoteAttachment[]
  onUpload: (attachment: { name: string; dataUrl: string; size: number }) => Promise<void>
  onRemove: (attachmentId: string) => Promise<void>
  maxAttachments?: number
}

export function AttachmentsField({ attachments, onUpload, onRemove, maxAttachments = 3 }: AttachmentsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(null)

    if (attachments.length >= maxAttachments) {
      setError(`You can attach up to ${maxAttachments} images per note.`)
      return
    }

    setUploading(true)
    try {
      const { dataUrl, size } = await fileToDataUrl(file)
      await onUpload({ name: file.name, dataUrl, size })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not attach that image.')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id)
    try {
      await onRemove(id)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-white/10">
            <img src={attachment.dataUrl} alt={attachment.name} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(attachment.id)}
              disabled={removingId === attachment.id}
              aria-label={`Remove ${attachment.name}`}
              className="focus-ring absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-100"
            >
              {removingId === attachment.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
            </button>
          </div>
        ))}

        {attachments.length < maxAttachments && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="focus-ring flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/15 text-white/40 transition hover:border-white/30 hover:text-white/70 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
            <span className="text-[10px]">{uploading ? 'Uploading' : 'Add image'}</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-400" role="alert">
          {error}
        </p>
      )}
      {attachments.length > 0 && (
        <p className="mt-1.5 text-[11px] text-white/30">
          {attachments.length} image{attachments.length === 1 ? '' : 's'} · {formatBytes(attachments.reduce((sum, a) => sum + a.size, 0))}
        </p>
      )}
    </div>
  )
}
