import { AnimatePresence, motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'
import type { PlaygroundUser } from '@/types/playgroundUser'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { Button } from '@/components/ui/Button'

interface DeleteUserModalProps {
  user: PlaygroundUser | null
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteUserModal({ user, deleting, onCancel, onConfirm }: DeleteUserModalProps) {
  useEscapeKey(onCancel, Boolean(user))

  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-user-title"
              className="panel-glass w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
                <TriangleAlert className="h-6 w-6" />
              </span>
              <h2 id="delete-user-title" className="mt-4 text-base font-semibold text-ink">
                Delete "{user.name}"?
              </h2>
              <p className="mt-1.5 text-sm text-ink/50">
                This removes the user from the sample dataset. This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-2">
                <Button variant="ghost" onClick={onCancel} disabled={deleting} className="flex-1">
                  Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={deleting} className="flex-1">
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
