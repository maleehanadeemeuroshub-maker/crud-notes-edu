import type { ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'

interface FloatingCardProps {
  children: ReactNode
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
  strength?: number
  floatDuration?: number
  floatDelay?: number
  initialDelay?: number
  className?: string
}

/** Entrance (blur→sharp + scale) + continuous float loop + mouse-parallax offset. */
export function FloatingCard({
  children,
  parallaxX,
  parallaxY,
  strength = 14,
  floatDuration = 6,
  floatDelay = 0,
  initialDelay = 0,
  className,
}: FloatingCardProps) {
  const tx = useTransform(parallaxX, (v) => v * strength)
  const ty = useTransform(parallaxY, (v) => v * strength)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: initialDelay, ease: 'easeOut' }}
      style={{ x: tx, y: ty }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
