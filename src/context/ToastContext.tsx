import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { generateId } from '@/utils/id'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  action?: ToastAction
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, action?: ToastAction) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
}

const RING: Record<ToastVariant, string> = {
  success: 'border-emerald-400/30 text-emerald-400',
  error: 'border-rose-400/30 text-rose-400',
  info: 'border-sky-400/30 text-sky-400',
}

const BAR: Record<ToastVariant, string> = {
  success: '#34d399',
  error: '#fb7185',
  info: '#38bdf8',
}

const TOAST_DURATION_MS = 3200

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success', action?: ToastAction) => {
      const id = generateId()
      setToasts((prev) => [...prev, { id, message, variant, action }])
      setTimeout(() => dismiss(id), TOAST_DURATION_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="no-print pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2.5"
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
                className={`pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border bg-elevated/95 px-4 py-3.5 shadow-2xl shadow-black/40 backdrop-blur-xl ${RING[toast.variant]}`}
              >
                <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-medium leading-snug text-ink/90">{toast.message}</p>
                  {toast.action && (
                    <button
                      onClick={() => {
                        toast.action?.onClick()
                        dismiss(toast.id)
                      }}
                      className="mt-1 text-xs font-semibold text-indigo-300 underline-offset-2 hover:underline"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="rounded-full p-0.5 text-ink/40 transition hover:text-ink/80"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: TOAST_DURATION_MS / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-0.5 rounded-full"
                  style={{ background: BAR[toast.variant] }}
                  aria-hidden="true"
                />
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
