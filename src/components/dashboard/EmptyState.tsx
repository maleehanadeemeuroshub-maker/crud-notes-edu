import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="panel flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/40">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-white/70">{title}</p>
        <p className="mt-1 text-sm text-white/40">{description}</p>
      </div>
      {action}
    </motion.div>
  )
}
