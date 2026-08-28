import { useEffect } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ParallaxValues {
  x: MotionValue<number>
  y: MotionValue<number>
}

/** Normalized (-1..1) cursor position, smoothed with a spring. No-ops on touch devices and reduced-motion. */
export function useMouseParallax(): ParallaxValues {
  const reducedMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (reducedMotion) return
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return

    function handleMove(e: MouseEvent) {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2)
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [reducedMotion, rawX, rawY])

  return { x, y }
}
