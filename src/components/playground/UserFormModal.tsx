import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import clsx from 'clsx'
import type { PlaygroundUser, PlaygroundUserDraft, PlaygroundUserFormErrors } from '@/types/playgroundUser'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { Button } from '@/components/ui/Button'

interface UserFormModalProps {
  open: boolean
  user: PlaygroundUser | null
  submitting: boolean
  onClose: () => void
  onSubmit: (draft: PlaygroundUserDraft) => Promise<void> | void
}

const EMPTY_DRAFT: PlaygroundUserDraft = { name: '', email: '', role: 'member', status: 'active' }

const formStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const formField = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
}

function validate(draft: PlaygroundUserDraft): PlaygroundUserFormErrors {
  const errors: PlaygroundUserFormErrors = {}
  if (!draft.name.trim()) errors.name = 'Name is required.'
  if (!draft.email.trim()) errors.email = 'Email is required.'
  else if (!/^\S+@\S+\.\S+$/.test(draft.email)) errors.email = 'Enter a valid email address.'
  return errors
}

export function UserFormModal({ open, user, submitting, onClose, onSubmit }: UserFormModalProps) {
  const [draft, setDraft] = useState<PlaygroundUserDraft>(
    user ? { name: user.name, email: user.email, role: user.role, status: user.status } : EMPTY_DRAFT,
  )
  const [errors, setErrors] = useState<PlaygroundUserFormErrors>({})
  const [touched, setTouched] = useState(false)

  useEscapeKey(onClose, open)

  useEffect(() => {
    if (!open) return
    setDraft(user ? { name: user.name, email: user.email, role: user.role, status: user.status } : EMPTY_DRAFT)
    setErrors({})
    setTouched(false)
  }, [open, user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    const validationErrors = validate(draft)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    await onSubmit(draft)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-form-title"
              className="panel-glass w-full max-w-sm rounded-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-900/8 px-5 py-4">
                <h2 id="user-form-title" className="text-base font-semibold text-slate-900">
                  {user ? 'Edit user' : 'Create user'}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="focus-ring rounded-full p-1.5 text-slate-900/50 transition hover:bg-slate-900/10 hover:text-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <motion.form
                onSubmit={handleSubmit}
                noValidate
                variants={formStagger}
                initial="hidden"
                animate="visible"
                className="space-y-4 px-5 py-5"
              >
                <motion.div variants={formField}>
                  <label htmlFor="pg-name" className="mb-1.5 block text-xs font-medium text-slate-900/55">
                    Name
                  </label>
                  <input
                    id="pg-name"
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    aria-invalid={Boolean(touched && errors.name)}
                    className={clsx(
                      'focus-ring w-full rounded-lg border bg-slate-900/[0.03] px-3 py-2 text-sm text-slate-900 placeholder:text-slate-900/30 transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.14)]',
                      touched && errors.name ? 'border-rose-400/60' : 'border-slate-900/10',
                    )}
                    placeholder="Jane Doe"
                  />
                  {touched && errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                </motion.div>

                <motion.div variants={formField}>
                  <label htmlFor="pg-email" className="mb-1.5 block text-xs font-medium text-slate-900/55">
                    Email
                  </label>
                  <input
                    id="pg-email"
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                    aria-invalid={Boolean(touched && errors.email)}
                    className={clsx(
                      'focus-ring w-full rounded-lg border bg-slate-900/[0.03] px-3 py-2 text-sm text-slate-900 placeholder:text-slate-900/30 transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.14)]',
                      touched && errors.email ? 'border-rose-400/60' : 'border-slate-900/10',
                    )}
                    placeholder="jane@example.com"
                  />
                  {touched && errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                </motion.div>

                <motion.div variants={formField} className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="pg-role" className="mb-1.5 block text-xs font-medium text-slate-900/55">
                      Role
                    </label>
                    <select
                      id="pg-role"
                      value={draft.role}
                      onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value as PlaygroundUserDraft['role'] }))}
                      className="focus-ring w-full rounded-lg border border-slate-900/10 bg-slate-900/[0.03] px-3 py-2 text-sm text-slate-900"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pg-status" className="mb-1.5 block text-xs font-medium text-slate-900/55">
                      Status
                    </label>
                    <select
                      id="pg-status"
                      value={draft.status}
                      onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as PlaygroundUserDraft['status'] }))}
                      className="focus-ring w-full rounded-lg border border-slate-900/10 bg-slate-900/[0.03] px-3 py-2 text-sm text-slate-900"
                    >
                      <option value="active">Active</option>
                      <option value="invited">Invited</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={formField} className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : user ? 'Save changes' : 'Create user'}
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
