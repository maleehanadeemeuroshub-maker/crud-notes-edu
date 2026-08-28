import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { generateId } from '@/utils/id'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
}

const RING: Record<ToastVariant, string> = {
  success: 'border-emerald-400/30 text-emerald-300',
  error: 'border-rose-400/30 text-rose-300',
  info: 'border-sky-400/30 text-sky-300',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = generateId()
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => dismiss(id), 3200)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2.5"
        role="region"
        aria-label="Notifications"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.variant]
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                role="status"
                className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-[#121516]/95 px-4 py-3.5 shadow-2xl shadow-black/40 backdrop-blur-xl ${RING[toast.variant]}`}
              >
                <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <p className="flex-1 text-sm font-medium leading-snug text-white/90">
                  {toast.message}
                </p>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="rounded-full p-0.5 text-white/40 transition hover:text-white/80"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
