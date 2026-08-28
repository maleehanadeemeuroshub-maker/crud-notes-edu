import { useState } from 'react'
import clsx from 'clsx'
import type { CodeExample } from '@/types/crud'
import { CodeBlock } from '@/components/ui/CodeBlock'

interface TabbedCodeBlockProps {
  code: CodeExample
}

const TABS: { key: keyof CodeExample; label: string; language: 'sql' | 'javascript' | 'rest' }[] = [
  { key: 'sql', label: 'SQL', language: 'sql' },
  { key: 'javascript', label: 'JavaScript', language: 'javascript' },
  { key: 'rest', label: 'REST API', language: 'rest' },
]

export function TabbedCodeBlock({ code }: TabbedCodeBlockProps) {
  const [active, setActive] = useState<keyof CodeExample>('sql')
  const activeTab = TABS.find((t) => t.key === active) ?? TABS[0]

  return (
    <div>
      <div className="mb-2 flex items-center gap-1" role="tablist" aria-label="Code language">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={clsx(
              'focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition',
              active === tab.key
                ? 'bg-slate-900/10 text-slate-900'
                : 'text-slate-900/45 hover:bg-slate-900/[0.05] hover:text-slate-900/75',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock code={code[active]} language={activeTab.language} />
    </div>
  )
}
