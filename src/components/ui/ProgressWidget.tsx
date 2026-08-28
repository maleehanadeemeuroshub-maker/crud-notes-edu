import { motion } from 'framer-motion'
import { useProgress } from '@/context/ProgressContext'
import { TRACKABLE_TOPICS } from '@/data/topics'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

export function ProgressWidget() {
  const { percent, completed } = useProgress()

  return (
    <div className="panel card-interactive rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Your Progress</p>
        <span className="font-mono text-sm font-bold text-indigo-400">
          <AnimatedCounter value={percent} suffix="%" />
        </span>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
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
