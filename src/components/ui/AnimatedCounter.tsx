import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  className?: string
}

/** Counts up from 0 to `value` once it scrolls into view. */
export function AnimatedCounter({ value, suffix = '', className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reducedMotion = useReducedMotion()
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 90, damping: 22 })

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  useEffect(() => {
    if (reducedMotion) return
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
    })
  }, [spring, suffix, reducedMotion])

  return (
    <span ref={ref} className={className}>
      {reducedMotion && inView ? `${value}${suffix}` : `0${suffix}`}
    </span>
  )
}
