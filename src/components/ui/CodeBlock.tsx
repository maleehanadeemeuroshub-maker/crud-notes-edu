import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { highlightCode, type CodeLanguage } from '@/utils/highlight'

interface CodeBlockProps {
  code: string
  language: CodeLanguage
  title?: string
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API unavailable — the button simply won't confirm.
    }
  }

  return (
    <div className="panel overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
          {title && <span className="font-mono ml-2 text-xs text-white/40">{title}</span>}
        </div>
        <button
          onClick={handleCopy}
          className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto px-4 py-3.5">
        <pre className="font-mono text-[13px] leading-relaxed">
          <code>{highlightCode(code, language)}</code>
        </pre>
      </div>
    </div>
  )
}
