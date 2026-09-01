import { useMemo, useState } from 'react'
import { Plus, RotateCcw, Search } from 'lucide-react'
import { usePlaygroundUsers } from '@/hooks/usePlaygroundUsers'
import { useToast } from '@/context/ToastContext'
import { useProgress } from '@/context/ProgressContext'
import type { PlaygroundUser, PlaygroundUserDraft, UserRole, UserStatus } from '@/types/playgroundUser'
import { UserTable } from '@/components/playground/UserTable'
import { UserFormModal } from '@/components/playground/UserFormModal'
import { DeleteUserModal } from '@/components/playground/DeleteUserModal'
import { Button } from '@/components/ui/Button'

const ROLE_FILTERS: (UserRole | 'all')[] = ['all', 'admin', 'member', 'viewer']
const STATUS_FILTERS: (UserStatus | 'all')[] = ['all', 'active', 'invited', 'suspended']

export function PlaygroundApp() {
  const { users, loading, createUser, updateUser, deleteUser, resetData } = usePlaygroundUsers()
  const { showToast } = useToast()
  const { markComplete } = useProgress()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<PlaygroundUser | null>(null)
  const [deletingUser, setDeletingUser] = useState<PlaygroundUser | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (!query) return true
      return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    })
  }, [users, search, roleFilter, statusFilter])

  function openCreate() {
    setEditingUser(null)
    setModalOpen(true)
  }

  function openEdit(user: PlaygroundUser) {
    setEditingUser(user)
    setModalOpen(true)
  }

  async function handleSubmit(draft: PlaygroundUserDraft) {
    setSubmitting(true)
    try {
      if (editingUser) {
        await updateUser(editingUser.id, draft)
        showToast('User updated successfully.')
      } else {
        await createUser(draft)
        showToast('User created successfully.')
      }
      markComplete('playground')
      setModalOpen(false)
      setEditingUser(null)
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingUser) return
    setDeleting(true)
    try {
      await deleteUser(deletingUser.id)
      showToast('User deleted successfully.', 'info')
      setDeletingUser(null)
    } catch {
      showToast('Could not delete user. Please try again.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  async function handleReset() {
    await resetData()
    showToast('Sample data reset.', 'info')
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            aria-label="Search users"
            className="focus-ring panel h-10 w-full rounded-lg pl-10 pr-3 text-sm text-ink placeholder:text-ink/35"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          aria-label="Filter by role"
          className="focus-ring panel h-10 rounded-lg px-3 text-sm text-ink/70"
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r} value={r}>
              {r === 'all' ? 'All roles' : r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
          aria-label="Filter by status"
          className="focus-ring panel h-10 rounded-lg px-3 text-sm text-ink/70"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <Button variant="ghost" size="md" onClick={handleReset} title="Reset sample data">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
        <Button onClick={openCreate} size="md">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <p className="mb-3 text-xs text-ink/35">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      <UserTable users={filteredUsers} loading={loading} onEdit={openEdit} onDelete={setDeletingUser} />

      <UserFormModal
        open={modalOpen}
        user={editingUser}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteUserModal
        user={deletingUser}
        deleting={deleting}
        onCancel={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
