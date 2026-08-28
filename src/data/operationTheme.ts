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
    accent: '#059669',
    accentSoft: 'rgba(5, 150, 105, 0.1)',
    border: 'rgba(5, 150, 105, 0.35)',
    text: 'text-emerald-600',
    glow: 'shadow-emerald-500/15',
  },
  read: {
    icon: ListChecks,
    accent: '#0284c7',
    accentSoft: 'rgba(2, 132, 199, 0.1)',
    border: 'rgba(2, 132, 199, 0.35)',
    text: 'text-sky-600',
    glow: 'shadow-sky-500/15',
  },
  update: {
    icon: RefreshCw,
    accent: '#4f46e5',
    accentSoft: 'rgba(79, 70, 229, 0.1)',
    border: 'rgba(79, 70, 229, 0.35)',
    text: 'text-indigo-600',
    glow: 'shadow-indigo-500/15',
  },
  delete: {
    icon: Trash2,
    accent: '#e11d48',
    accentSoft: 'rgba(225, 29, 72, 0.1)',
    border: 'rgba(225, 29, 72, 0.35)',
    text: 'text-rose-600',
    glow: 'shadow-rose-500/15',
  },
}

export const HTTP_METHOD_COLORS: Record<string, string> = {
  GET: '#0284c7',
  POST: '#059669',
  PUT: '#4f46e5',
  PATCH: '#9333ea',
  DELETE: '#e11d48',
}
