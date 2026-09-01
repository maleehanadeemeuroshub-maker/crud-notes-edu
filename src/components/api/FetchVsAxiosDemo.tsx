import { useState } from 'react'
import axios from 'axios'
import { Loader2, Play } from 'lucide-react'
import clsx from 'clsx'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Button } from '@/components/ui/Button'
import { MethodBadge } from '@/components/ui/MethodBadge'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const METHODS: Method[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const ENDPOINTS: Record<Method, { url: string; body?: Record<string, unknown> }> = {
  GET: { url: 'https://jsonplaceholder.typicode.com/users/1' },
  POST: {
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: { title: 'CRUD Notes', body: 'Created from the live demo.', userId: 1 },
  },
  PUT: {
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    body: { id: 1, title: 'CRUD Notes (replaced)', body: 'Replaced from the live demo.', userId: 1 },
  },
  PATCH: {
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    body: { title: 'CRUD Notes (patched)' },
  },
  DELETE: { url: 'https://jsonplaceholder.typicode.com/posts/1' },
}

interface RunResult {
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: unknown
  error?: string
  httpStatus?: number
  ms?: number
}

const IDLE: RunResult = { status: 'idle' }

function fetchSnippet(method: Method): string {
  const { url, body } = ENDPOINTS[method]
  const lines = [`const response = await fetch('${url}', {`, `  method: '${method}',`]
  if (body) {
    lines.push(`  headers: { 'Content-Type': 'application/json' },`)
    lines.push(`  body: JSON.stringify(${JSON.stringify(body)}),`)
  }
  lines.push(`})`, ``, `if (!response.ok) throw new Error(\`HTTP \${response.status}\`)`)
  lines.push(method === 'DELETE' ? `// fetch resolves even on 4xx/5xx — .ok must be checked manually` : `const data = await response.json()`)
  return lines.join('\n')
}

function axiosSnippet(method: Method): string {
  const { url, body } = ENDPOINTS[method]
  const fn = method.toLowerCase()
  const call = body ? `axios.${fn}('${url}', ${JSON.stringify(body)})` : `axios.${fn}('${url}')`
  return `const { data } = await ${call}\n// a non-2xx status rejects the promise automatically`
}

async function runWithFetch(method: Method) {
  const { url, body } = ENDPOINTS[method]
  const start = performance.now()
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const ms = Math.round(performance.now() - start)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = method === 'DELETE' ? {} : await response.json()
  return { data, httpStatus: response.status, ms }
}

async function runWithAxios(method: Method) {
  const { url, body } = ENDPOINTS[method]
  const start = performance.now()
  const response = await axios.request({ url, method, data: body })
  const ms = Math.round(performance.now() - start)
  return { data: response.data, httpStatus: response.status, ms }
}

function ResultPanel({
  title,
  snippet,
  result,
  onRun,
}: {
  title: string
  snippet: string
  result: RunResult
  onRun: () => void
}) {
  return (
    <div className="panel rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-mono text-sm font-semibold text-ink">{title}</h3>
        <Button size="sm" onClick={onRun} disabled={result.status === 'loading'}>
          {result.status === 'loading' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          Run
        </Button>
      </div>

      <div className="mt-3">
        <CodeBlock code={snippet} language="javascript" />
      </div>

      <div className="mt-3 min-h-[1.5rem]">
        {result.status === 'idle' && <p className="text-xs text-ink/35">Click Run to send a real request.</p>}
        {result.status === 'loading' && <p className="text-xs text-ink/45">Waiting for a response…</p>}
        {result.status === 'error' && (
          <p className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-3 py-2 text-xs text-rose-300" role="alert">
            {result.error}
          </p>
        )}
        {result.status === 'success' && (
          <>
            <div className="mb-1.5 flex items-center gap-2 text-xs text-ink/40">
              <span className="font-mono rounded bg-emerald-400/10 px-1.5 py-0.5 font-bold text-emerald-400">
                {result.httpStatus}
              </span>
              <span>{result.ms}ms</span>
            </div>
            <CodeBlock code={JSON.stringify(result.data, null, 2)} language="json" />
          </>
        )}
      </div>
    </div>
  )
}

export function FetchVsAxiosDemo() {
  const [method, setMethod] = useState<Method>('GET')
  const [fetchResult, setFetchResult] = useState<RunResult>(IDLE)
  const [axiosResult, setAxiosResult] = useState<RunResult>(IDLE)

  function selectMethod(next: Method) {
    setMethod(next)
    setFetchResult(IDLE)
    setAxiosResult(IDLE)
  }

  async function handleRunFetch() {
    setFetchResult({ status: 'loading' })
    try {
      const { data, httpStatus, ms } = await runWithFetch(method)
      setFetchResult({ status: 'success', data, httpStatus, ms })
    } catch (err) {
      setFetchResult({ status: 'error', error: err instanceof Error ? err.message : 'Request failed' })
    }
  }

  async function handleRunAxios() {
    setAxiosResult({ status: 'loading' })
    try {
      const { data, httpStatus, ms } = await runWithAxios(method)
      setAxiosResult({ status: 'success', data, httpStatus, ms })
    } catch (err) {
      const message = axios.isAxiosError(err) ? `HTTP ${err.response?.status ?? '?'}` : 'Request failed'
      setAxiosResult({ status: 'error', error: message })
    }
  }

  return (
    <div className="space-y-5">
      <div className="panel rounded-2xl p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">Pick a request</p>
        <div className="flex flex-wrap gap-1.5">
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => selectMethod(m)}
              aria-pressed={method === m}
              className={clsx(
                'focus-ring rounded-lg transition',
                method === m ? 'ring-2 ring-indigo-400/50' : 'opacity-70 hover:opacity-100',
              )}
            >
              <MethodBadge method={m} size="md" />
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink/40">
          Both panels send a real request to <code className="font-mono text-ink/60">jsonplaceholder.typicode.com</code>,
          a free public sandbox API built for exactly this kind of demo. POST, PUT, PATCH, and DELETE are faked by the
          server — nothing is actually created or destroyed.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ResultPanel title="fetch()" snippet={fetchSnippet(method)} result={fetchResult} onRun={handleRunFetch} />
        <ResultPanel title="Axios" snippet={axiosSnippet(method)} result={axiosResult} onRun={handleRunAxios} />
      </div>
    </div>
  )
}
