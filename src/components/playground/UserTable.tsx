import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Trash2, Users } from 'lucide-react'
import clsx from 'clsx'
import type { PlaygroundUser } from '@/types/playgroundUser'
import { formatDate } from '@/utils/date'

interface UserTableProps {
  users: PlaygroundUser[]
  loading: boolean
  onEdit: (user: PlaygroundUser) => void
  onDelete: (user: PlaygroundUser) => void
}

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/25',
  member: 'bg-sky-400/10 text-sky-400 border-sky-400/25',
  viewer: 'bg-white/[0.06] text-white/55 border-white/12',
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-400/10 text-emerald-400',
  invited: 'bg-amber-400/10 text-amber-400',
  suspended: 'bg-rose-400/10 text-rose-400',
}

export function UserTable({ users, loading, onEdit, onDelete }: UserTableProps) {
  if (loading) {
    return (
      <div className="panel space-y-2 rounded-2xl p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="panel flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white/35">
          <Users className="h-6 w-6" />
        </span>
        <p className="text-sm font-medium text-white/60">No users match your search.</p>
      </div>
    )
  }

  return (
    <div className="panel overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs uppercase tracking-wide text-white/40">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94, x: -16, transition: { duration: 0.25, ease: 'easeIn' } }}
                  transition={{ duration: 0.2 }}
                  className="group border-b border-white/6 transition-colors last:border-b-0 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3 font-medium text-white">{user.name}</td>
                  <td className="px-5 py-3 text-white/55">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('rounded-md border px-2 py-0.5 text-xs font-medium capitalize', ROLE_STYLES[user.role])}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={clsx('rounded-md px-2 py-0.5 text-xs font-medium capitalize', STATUS_STYLES[user.status])}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-white/40">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => onEdit(user)}
                        aria-label={`Edit ${user.name}`}
                        className="focus-ring rounded-lg p-1.5 text-white/45 transition hover:bg-white/10 hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        aria-label={`Delete ${user.name}`}
                        className="focus-ring rounded-lg p-1.5 text-white/45 transition hover:bg-rose-500/15 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
