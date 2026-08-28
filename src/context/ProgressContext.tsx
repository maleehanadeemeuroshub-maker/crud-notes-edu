import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { storage } from '@/utils/storage'
import { TRACKABLE_TOPICS } from '@/data/topics'

const STORAGE_KEY = 'crud-notes:progress:v1'

interface ProgressContextValue {
  completed: Set<string>
  percent: number
  isComplete: (topicId: string) => boolean
  toggleComplete: (topicId: string) => void
  markComplete: (topicId: string) => void
  reset: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(storage.get<string[]>(STORAGE_KEY, [])),
  )

  useEffect(() => {
    storage.set(STORAGE_KEY, [...completed])
  }, [completed])

  const isComplete = useCallback((topicId: string) => completed.has(topicId), [completed])

  const toggleComplete = useCallback((topicId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) next.delete(topicId)
      else next.add(topicId)
      return next
    })
  }, [])

  const markComplete = useCallback((topicId: string) => {
    setCompleted((prev) => (prev.has(topicId) ? prev : new Set(prev).add(topicId)))
  }, [])

  const reset = useCallback(() => setCompleted(new Set()), [])

  const percent = Math.round((completed.size / TRACKABLE_TOPICS.length) * 100)

  return (
    <ProgressContext.Provider value={{ completed, percent, isComplete, toggleComplete, markComplete, reset }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider')
  return ctx
}
