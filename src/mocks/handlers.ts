import { http, HttpResponse, delay } from 'msw'
import { db, hashPassword } from '@/mocks/db'
import type { AuthUser } from '@/types/auth'
import type { AppNote, NoteAttachment, NoteCategory, NoteColor, NotePriority } from '@/types/appNote'
import { NOTE_CATEGORIES, NOTE_COLORS, NOTE_PRIORITIES } from '@/types/appNote'

/**
 * Mocked REST API for the CRUD Notes app. Intercepted at the network layer
 * by MSW (see mocks/browser.ts), so real `fetch`/`axios` requests hit
 * `/api/...`, get real status codes + JSON bodies, and show up in devtools —
 * this is a stand-in for a real Express/DB backend, not a client-side shim.
 */

const LATENCY_MS = 350

function toAuthUser(user: { id: string; fullName: string; email: string; createdAt: string }): AuthUser {
  return { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt }
}

function error(message: string, status: number, field?: string) {
  return HttpResponse.json({ message, field }, { status })
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function requireAuth(request: Request): { userId: string } | { error: Response } {
  const authHeader = request.headers.get('Authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return { error: error('Missing authentication token.', 401) }
  const session = db.findSession(token)
  if (!session) return { error: error('Session expired. Please log in again.', 401) }
  return { userId: session.userId }
}

export const handlers = [
  // --- Auth -----------------------------------------------------------------
  http.post('/api/auth/register', async ({ request }) => {
    await delay(LATENCY_MS)
    const body = (await request.json()) as { fullName?: string; email?: string; password?: string }
    const fullName = body.fullName?.trim() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''
    const password = body.password ?? ''

    if (fullName.length < 2) return error('Full name must be at least 2 characters.', 400, 'fullName')
    if (!isEmail(email)) return error('Enter a valid email address.', 400, 'email')
    if (password.length < 6) return error('Password must be at least 6 characters.', 400, 'password')
    if (db.findUserByEmail(email)) return error('An account with this email already exists.', 409, 'email')

    const user = await db.createUser(fullName, email, password)
    const session = db.createSession(user.id)
    return HttpResponse.json({ user: toAuthUser(user), token: session.token }, { status: 201 })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await delay(LATENCY_MS)
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase() ?? ''
    const password = body.password ?? ''

    const user = db.findUserByEmail(email)
    if (!user) return error('No account found with this email.', 401, 'email')
    const valid = await db.verifyPassword(user, password)
    if (!valid) return error('Incorrect password.', 401, 'password')

    const session = db.createSession(user.id)
    return HttpResponse.json({ user: toAuthUser(user), token: session.token }, { status: 200 })
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    const authHeader = request.headers.get('Authorization') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
    if (token) db.deleteSession(token)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(150)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error
    const user = db.findUserById(auth.userId)
    if (!user) return error('User not found.', 404)
    return HttpResponse.json({ user: toAuthUser(user) }, { status: 200 })
  }),

  http.patch('/api/auth/me', async ({ request }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const body = (await request.json()) as { fullName?: string }
    const fullName = body.fullName?.trim() ?? ''
    if (fullName.length < 2) return error('Full name must be at least 2 characters.', 400, 'fullName')

    const updated = db.updateUser(auth.userId, { fullName })
    if (!updated) return error('User not found.', 404)
    return HttpResponse.json({ user: toAuthUser(updated) }, { status: 200 })
  }),

  http.delete('/api/auth/me', async ({ request }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error
    db.deleteUser(auth.userId)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/auth/change-password', async ({ request }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const body = (await request.json()) as { currentPassword?: string; newPassword?: string }
    const user = db.findUserById(auth.userId)
    if (!user) return error('User not found.', 404)

    const valid = await db.verifyPassword(user, body.currentPassword ?? '')
    if (!valid) return error('Current password is incorrect.', 401, 'currentPassword')
    if (!body.newPassword || body.newPassword.length < 6) {
      return error('New password must be at least 6 characters.', 400, 'newPassword')
    }

    const passwordHash = await hashPassword(body.newPassword, user.passwordSalt)
    db.updateUser(user.id, { passwordHash })
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/auth/forgot-password', async ({ request }) => {
    await delay(LATENCY_MS)
    const body = (await request.json()) as { email?: string }
    const email = body.email?.trim().toLowerCase() ?? ''
    const user = db.findUserByEmail(email)

    // Always return the same generic response so this endpoint can't be used to enumerate emails.
    if (!user) return HttpResponse.json({ message: 'If that email exists, a reset link has been generated.' }, { status: 200 })

    const resetToken = db.createResetToken(user.id)
    // There's no real mail server here, so the mock hands back the link directly for the demo to use.
    return HttpResponse.json(
      { message: 'If that email exists, a reset link has been generated.', resetToken: resetToken.token },
      { status: 200 },
    )
  }),

  http.post('/api/auth/reset-password', async ({ request }) => {
    await delay(LATENCY_MS)
    const body = (await request.json()) as { token?: string; password?: string }
    const token = body.token ?? ''
    const password = body.password ?? ''

    const resetToken = db.findValidResetToken(token)
    if (!resetToken) return error('This reset link is invalid or has expired.', 400)
    if (password.length < 6) return error('Password must be at least 6 characters.', 400, 'password')

    const user = db.findUserById(resetToken.userId)
    if (!user) return error('User not found.', 404)

    const passwordHash = await hashPassword(password, user.passwordSalt)
    db.updateUser(user.id, { passwordHash })
    db.deleteResetToken(token)
    db.deleteAllSessionsForUser(user.id)
    return new HttpResponse(null, { status: 204 })
  }),

  // --- Notes ------------------------------------------------------------------
  http.get('/api/notes', async ({ request }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const url = new URL(request.url)
    const trashed = url.searchParams.get('trashed') === 'true'
    if (trashed) db.purgeExpiredTrash(auth.userId)
    const notes = db.listNotes(auth.userId).filter((n) => (trashed ? n.deletedAt !== null : n.deletedAt === null))
    return HttpResponse.json({ notes }, { status: 200 })
  }),

  http.post('/api/notes', async ({ request }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const body = (await request.json()) as {
      title?: string
      content?: string
      category?: NoteCategory
      priority?: NotePriority
      color?: NoteColor
      tags?: string[]
    }
    const title = body.title?.trim() ?? ''
    if (!title) return error('Title is required.', 400, 'title')
    const category: NoteCategory = body.category && NOTE_CATEGORIES.includes(body.category) ? body.category : 'other'
    const priority: NotePriority = body.priority && NOTE_PRIORITIES.includes(body.priority) ? body.priority : 'medium'
    const color: NoteColor = body.color && NOTE_COLORS.includes(body.color) ? body.color : 'default'

    const now = new Date().toISOString()
    const note: AppNote = {
      id: crypto.randomUUID(),
      userId: auth.userId,
      title,
      content: body.content?.trim() ?? '',
      category,
      priority,
      color,
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      attachments: [],
      pinned: false,
      favorite: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    }
    db.createNote(note)
    return HttpResponse.json({ note }, { status: 201 })
  }),

  http.patch('/api/notes/:id', async ({ request, params }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const id = params.id as string
    const existing = db.findNote(auth.userId, id)
    if (!existing) return error('Note not found.', 404)

    const patch = (await request.json()) as Partial<AppNote>
    if (patch.title !== undefined && !patch.title.trim()) return error('Title cannot be empty.', 400, 'title')

    const updated = db.updateNote(auth.userId, id, patch)
    return HttpResponse.json({ note: updated }, { status: 200 })
  }),

  http.delete('/api/notes/:id', async ({ request, params }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const id = params.id as string
    const existing = db.findNote(auth.userId, id)
    if (!existing) return error('Note not found.', 404)

    const updated = db.updateNote(auth.userId, id, { deletedAt: new Date().toISOString() })
    return HttpResponse.json({ note: updated }, { status: 200 })
  }),

  http.post('/api/notes/:id/restore', async ({ request, params }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const id = params.id as string
    const existing = db.findNote(auth.userId, id)
    if (!existing) return error('Note not found.', 404)

    const updated = db.updateNote(auth.userId, id, { deletedAt: null })
    return HttpResponse.json({ note: updated }, { status: 200 })
  }),

  http.delete('/api/notes/:id/permanent', async ({ request, params }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const id = params.id as string
    const removed = db.deleteNotePermanently(auth.userId, id)
    if (!removed) return error('Note not found.', 404)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/notes/:id/attachments', async ({ request, params }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const id = params.id as string
    const body = (await request.json()) as { name?: string; dataUrl?: string; size?: number }
    if (!body.dataUrl) return error('Attachment data is required.', 400)

    const attachment: NoteAttachment = {
      id: crypto.randomUUID(),
      name: body.name?.trim() || 'attachment',
      dataUrl: body.dataUrl,
      size: body.size ?? 0,
    }
    const updated = db.addAttachment(auth.userId, id, attachment)
    if (!updated) return error('Note not found.', 404)
    return HttpResponse.json({ note: updated }, { status: 201 })
  }),

  http.delete('/api/notes/:id/attachments/:attachmentId', async ({ request, params }) => {
    await delay(LATENCY_MS)
    const auth = requireAuth(request)
    if ('error' in auth) return auth.error

    const id = params.id as string
    const attachmentId = params.attachmentId as string
    const updated = db.removeAttachment(auth.userId, id, attachmentId)
    if (!updated) return error('Note not found.', 404)
    return HttpResponse.json({ note: updated }, { status: 200 })
  }),
]
