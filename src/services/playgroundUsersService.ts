import type { PlaygroundUser, PlaygroundUserDraft } from '@/types/playgroundUser'
import { storage } from '@/utils/storage'
import { seedPlaygroundUsers } from '@/data/seedPlaygroundUsers'
import { generateId } from '@/utils/id'

/**
 * A self-contained CRUD service for the Playground's sample "Users" dataset.
 * Backed by localStorage so the demo data persists across refreshes without
 * requiring a real backend — swap this for real `fetch` calls against a
 * REST API and every component above it keeps working unchanged.
 */

const STORAGE_KEY = 'crud-notes:playground-users:v1'
const LATENCY_MS = 220

function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function readAll(): PlaygroundUser[] {
  const existing = storage.get<PlaygroundUser[] | null>(STORAGE_KEY, null)
  if (existing === null) {
    const seeded = seedPlaygroundUsers()
    storage.set(STORAGE_KEY, seeded)
    return seeded
  }
  return existing
}

function writeAll(users: PlaygroundUser[]): void {
  storage.set(STORAGE_KEY, users)
}

export const playgroundUsersService = {
  async list(): Promise<PlaygroundUser[]> {
    return delay([...readAll()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  },

  async create(draft: PlaygroundUserDraft): Promise<PlaygroundUser> {
    const user: PlaygroundUser = { id: generateId(), ...draft, createdAt: new Date().toISOString() }
    const users = readAll()
    writeAll([user, ...users])
    return delay(user)
  },

  async update(id: string, draft: PlaygroundUserDraft): Promise<PlaygroundUser> {
    const users = readAll()
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) throw new Error(`User "${id}" not found.`)
    const updated: PlaygroundUser = { ...users[index], ...draft }
    users[index] = updated
    writeAll(users)
    return delay(updated)
  },

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((u) => u.id !== id))
    return delay(undefined)
  },

  async reset(): Promise<PlaygroundUser[]> {
    const seeded = seedPlaygroundUsers()
    writeAll(seeded)
    return delay(seeded)
  },
}
