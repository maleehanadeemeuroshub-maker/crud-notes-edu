import { useEffect, useRef, useState } from 'react'

/** Hides while scrolling down past `threshold`, reveals on any scroll up. */
export function useHideOnScroll(threshold = 80): boolean {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    function handleScroll() {
      const y = window.scrollY
      const goingDown = y > lastY.current

      if (y < threshold) {
        setHidden(false)
      } else if (goingDown) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      lastY.current = y
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return hidden
}
