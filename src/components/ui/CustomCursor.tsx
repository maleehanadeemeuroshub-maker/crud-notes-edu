import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, .cursor-hover'

/** Premium ring cursor. Desktop fine-pointer only; a no-op on touch devices and under reduced motion. */
export function CustomCursor() {
  const reducedMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    setEnabled(window.matchMedia('(pointer: fine)').matches && !reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    if (!enabled) return

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target as HTMLElement | null
      setHovering(Boolean(target?.closest(HOVER_SELECTOR)))
    }

    document.documentElement.classList.add('custom-cursor-active')
    window.addEventListener('mousemove', handleMove)
    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMove)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="no-print pointer-events-none fixed left-0 top-0 z-[200] rounded-full border border-indigo-400 mix-blend-difference"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: hovering ? 40 : 14, height: hovering ? 40 : 14, opacity: hovering ? 0.9 : 0.7 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    />
  )
}
