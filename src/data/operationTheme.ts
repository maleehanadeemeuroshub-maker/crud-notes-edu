import { FilePlus2, ListChecks, RefreshCw, Trash2, type LucideIcon } from 'lucide-react'
import type { OperationId } from '@/types/crud'

export interface OperationTheme {
  icon: LucideIcon
  accent: string
  accentSoft: string
  border: string
  text: string
  glow: string
}

export const OPERATION_THEME: Record<OperationId, OperationTheme> = {
  create: {
    icon: FilePlus2,
    accent: '#34d399',
    accentSoft: 'rgba(52, 211, 153, 0.12)',
    border: 'rgba(52, 211, 153, 0.35)',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  read: {
    icon: ListChecks,
    accent: '#38bdf8',
    accentSoft: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.35)',
    text: 'text-sky-400',
    glow: 'shadow-sky-500/20',
  },
  update: {
    icon: RefreshCw,
    accent: '#818cf8',
    accentSoft: 'rgba(129, 140, 248, 0.12)',
    border: 'rgba(129, 140, 248, 0.35)',
    text: 'text-indigo-400',
    glow: 'shadow-indigo-500/20',
  },
  delete: {
    icon: Trash2,
    accent: '#fb7185',
    accentSoft: 'rgba(251, 113, 133, 0.12)',
    border: 'rgba(251, 113, 133, 0.35)',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/20',
  },
}

export const HTTP_METHOD_COLORS: Record<string, string> = {
  GET: '#38bdf8',
  POST: '#34d399',
  PUT: '#818cf8',
  PATCH: '#c084fc',
  DELETE: '#fb7185',
}
