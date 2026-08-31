import { storage } from '@/utils/storage'
import type { AuthUser } from '@/types/auth'

const TOKEN_KEY = 'crud-notes:auth-token:v1'
const USER_KEY = 'crud-notes:auth-user:v1'

function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/**
 * Persists the session token + cached user so a refresh doesn't force a re-login.
 * "Remember me" controls whether that survives a closed browser (localStorage)
 * or only the current tab session (sessionStorage).
 */
export const tokenStorage = {
  getToken(): string | null {
    return storage.get<string | null>(TOKEN_KEY, null) ?? readSession<string | null>(TOKEN_KEY, null)
  },
  setToken(token: string, remember = true): void {
    if (remember) {
      storage.set(TOKEN_KEY, token)
    } else {
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token))
    }
  },
  getUser(): AuthUser | null {
    return storage.get<AuthUser | null>(USER_KEY, null) ?? readSession<AuthUser | null>(USER_KEY, null)
  },
  setUser(user: AuthUser, remember = true): void {
    if (remember) {
      storage.set(USER_KEY, user)
    } else {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  },
  clear(): void {
    storage.remove(TOKEN_KEY)
    storage.remove(USER_KEY)
    try {
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
    } catch {
      // ignore
    }
  },
}
