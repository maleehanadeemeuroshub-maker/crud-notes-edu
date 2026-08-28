import { useCallback, useEffect, useState } from 'react'
import type { PlaygroundUser, PlaygroundUserDraft } from '@/types/playgroundUser'
import { playgroundUsersService } from '@/services/playgroundUsersService'

interface UsePlaygroundUsersResult {
  users: PlaygroundUser[]
  loading: boolean
  createUser: (draft: PlaygroundUserDraft) => Promise<PlaygroundUser>
  updateUser: (id: string, draft: PlaygroundUserDraft) => Promise<PlaygroundUser>
  deleteUser: (id: string) => Promise<void>
  resetData: () => Promise<void>
}

export function usePlaygroundUsers(): UsePlaygroundUsersResult {
  const [users, setUsers] = useState<PlaygroundUser[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await playgroundUsersService.list()
    setUsers(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createUser = useCallback(async (draft: PlaygroundUserDraft) => {
    const user = await playgroundUsersService.create(draft)
    setUsers((prev) => [user, ...prev])
    return user
  }, [])

  const updateUser = useCallback(async (id: string, draft: PlaygroundUserDraft) => {
    const updated = await playgroundUsersService.update(id, draft)
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
    return updated
  }, [])

  const deleteUser = useCallback(async (id: string) => {
    await playgroundUsersService.remove(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const resetData = useCallback(async () => {
    const seeded = await playgroundUsersService.reset()
    setUsers(seeded)
  }, [])

  return { users, loading, createUser, updateUser, deleteUser, resetData }
}
