import { motion } from 'framer-motion'
import { useProgress } from '@/context/ProgressContext'
import { TRACKABLE_TOPICS } from '@/data/topics'

export function ProgressWidget() {
  const { percent, completed } = useProgress()

  return (
    <div className="panel rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Your Progress</p>
        <span className="font-mono text-sm font-bold text-emerald-400">{percent}%</span>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <p className="mt-2 text-xs text-white/40">
        {completed.size} of {TRACKABLE_TOPICS.length} topics learned
      </p>
    </div>
  )
}
