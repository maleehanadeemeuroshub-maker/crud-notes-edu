import { HTTP_METHOD_COLORS } from '@/data/operationTheme'

interface MethodBadgeProps {
  method: string
  size?: 'sm' | 'md'
}

export function MethodBadge({ method, size = 'sm' }: MethodBadgeProps) {
  const color = HTTP_METHOD_COLORS[method] ?? '#94a3b8'
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`font-mono font-bold tracking-wide rounded-md ${padding}`}
      style={{ color, background: `${color}1a`, border: `1px solid ${color}40` }}
    >
      {method}
    </span>
  )
}
