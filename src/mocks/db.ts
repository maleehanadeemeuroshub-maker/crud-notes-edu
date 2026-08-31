import type { AppNote, NoteAttachment } from '@/types/appNote'
import { TRASH_RETENTION_DAYS } from '@/types/appNote'

/**
 * Fake "database" for the mocked REST API (see handlers.ts). It persists to
 * localStorage so data survives reloads, standing in for a real backend +
 * SQL database without requiring one to be running.
 */

export interface DbUser {
  id: string
  fullName: string
  email: string
  passwordHash: string
  passwordSalt: string
  createdAt: string
}

export interface DbSession {
  token: string
  userId: string
  createdAt: string
}

export interface DbResetToken {
  token: string
  userId: string
  createdAt: string
}

interface Database {
  users: DbUser[]
  sessions: DbSession[]
  resetTokens: DbResetToken[]
  notes: AppNote[]
}

const DB_KEY = 'crud-notes:db:v1'
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000 // 30 minutes

function readDb(): Database {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) return { users: [], sessions: [], resetTokens: [], notes: [] }
    const parsed = JSON.parse(raw) as Partial<Database>
    return {
      users: parsed.users ?? [],
      sessions: parsed.sessions ?? [],
      resetTokens: parsed.resetTokens ?? [],
      notes: (parsed.notes ?? []).map((n) => ({ ...n, color: n.color ?? 'default', attachments: n.attachments ?? [] })),
    }
  } catch {
    return { users: [], sessions: [], resetTokens: [], notes: [] }
  }
}

function writeDb(db: Database): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch {
    // Storage unavailable — fail silently, matches the rest of the app.
  }
}

function generateToken(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${crypto.randomUUID()}.${crypto.randomUUID()}`.replace(/-/g, '')
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** SHA-256(password + salt) via Web Crypto — never store plaintext passwords. */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoded = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return bufferToHex(digest)
}

function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const db = {
  findUserByEmail(email: string): DbUser | undefined {
    return readDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  },

  findUserById(id: string): DbUser | undefined {
    return readDb().users.find((u) => u.id === id)
  },

  async createUser(fullName: string, email: string, password: string): Promise<DbUser> {
    const database = readDb()
    const salt = generateSalt()
    const passwordHash = await hashPassword(password, salt)
    const user: DbUser = {
      id: crypto.randomUUID(),
      fullName,
      email,
      passwordHash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
    }
    database.users.push(user)
    writeDb(database)
    return user
  },

  async verifyPassword(user: DbUser, password: string): Promise<boolean> {
    const candidate = await hashPassword(password, user.passwordSalt)
    return candidate === user.passwordHash
  },

  updateUser(id: string, patch: Partial<Pick<DbUser, 'fullName' | 'passwordHash' | 'passwordSalt'>>): DbUser | undefined {
    const database = readDb()
    const index = database.users.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    database.users[index] = { ...database.users[index], ...patch }
    writeDb(database)
    return database.users[index]
  },

  deleteUser(id: string): void {
    const database = readDb()
    database.users = database.users.filter((u) => u.id !== id)
    database.sessions = database.sessions.filter((s) => s.userId !== id)
    database.resetTokens = database.resetTokens.filter((t) => t.userId !== id)
    database.notes = database.notes.filter((n) => n.userId !== id)
    writeDb(database)
  },

  createSession(userId: string): DbSession {
    const database = readDb()
    const session: DbSession = { token: generateToken(), userId, createdAt: new Date().toISOString() }
    database.sessions.push(session)
    writeDb(database)
    return session
  },

  findSession(token: string): DbSession | undefined {
    return readDb().sessions.find((s) => s.token === token)
  },

  deleteSession(token: string): void {
    const database = readDb()
    database.sessions = database.sessions.filter((s) => s.token !== token)
    writeDb(database)
  },

  deleteAllSessionsForUser(userId: string): void {
    const database = readDb()
    database.sessions = database.sessions.filter((s) => s.userId !== userId)
    writeDb(database)
  },

  createResetToken(userId: string): DbResetToken {
    const database = readDb()
    // Only one live reset token per user at a time.
    database.resetTokens = database.resetTokens.filter((t) => t.userId !== userId)
    const resetToken: DbResetToken = { token: generateToken(), userId, createdAt: new Date().toISOString() }
    database.resetTokens.push(resetToken)
    writeDb(database)
    return resetToken
  },

  findValidResetToken(token: string): DbResetToken | undefined {
    const found = readDb().resetTokens.find((t) => t.token === token)
    if (!found) return undefined
    const expired = Date.now() - new Date(found.createdAt).getTime() > RESET_TOKEN_TTL_MS
    if (expired) return undefined
    return found
  },

  deleteResetToken(token: string): void {
    const database = readDb()
    database.resetTokens = database.resetTokens.filter((t) => t.token !== token)
    writeDb(database)
  },

  /** Permanently removes notes that have sat in trash past the retention window. */
  purgeExpiredTrash(userId: string): void {
    const database = readDb()
    const cutoff = Date.now() - TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000
    database.notes = database.notes.filter((n) => {
      if (n.userId !== userId || !n.deletedAt) return true
      return new Date(n.deletedAt).getTime() > cutoff
    })
    writeDb(database)
  },

  listNotes(userId: string): AppNote[] {
    return readDb().notes.filter((n) => n.userId === userId)
  },

  findNote(userId: string, id: string): AppNote | undefined {
    return readDb().notes.find((n) => n.userId === userId && n.id === id)
  },

  createNote(note: AppNote): AppNote {
    const database = readDb()
    database.notes.push(note)
    writeDb(database)
    return note
  },

  updateNote(userId: string, id: string, patch: Partial<AppNote>): AppNote | undefined {
    const database = readDb()
    const index = database.notes.findIndex((n) => n.userId === userId && n.id === id)
    if (index === -1) return undefined
    const updated: AppNote = { ...database.notes[index], ...patch, updatedAt: new Date().toISOString() }
    database.notes[index] = updated
    writeDb(database)
    return updated
  },

  deleteNotePermanently(userId: string, id: string): boolean {
    const database = readDb()
    const before = database.notes.length
    database.notes = database.notes.filter((n) => !(n.userId === userId && n.id === id))
    writeDb(database)
    return database.notes.length < before
  },

  addAttachment(userId: string, noteId: string, attachment: NoteAttachment): AppNote | undefined {
    const note = this.findNote(userId, noteId)
    if (!note) return undefined
    return this.updateNote(userId, noteId, { attachments: [...note.attachments, attachment] })
  },

  removeAttachment(userId: string, noteId: string, attachmentId: string): AppNote | undefined {
    const note = this.findNote(userId, noteId)
    if (!note) return undefined
    return this.updateNote(userId, noteId, { attachments: note.attachments.filter((a) => a.id !== attachmentId) })
  },
}
