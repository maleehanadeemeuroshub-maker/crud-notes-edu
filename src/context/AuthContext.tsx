import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService } from '@/services/authService'
import { tokenStorage } from '@/lib/tokenStorage'
import { UNAUTHORIZED_EVENT } from '@/lib/http'
import type { ChangePasswordPayload, AuthUser, LoginPayload, RegisterPayload, UpdateProfilePayload } from '@/types/auth'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  register: (payload: RegisterPayload) => Promise<void>
  login: (payload: LoginPayload, remember?: boolean) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(tokenStorage.getUser())
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const token = tokenStorage.getToken()
    if (!token) {
      setStatus('unauthenticated')
      return
    }
    // Validate the cached session against the server on load instead of trusting localStorage blindly.
    authService
      .me()
      .then((freshUser) => {
        tokenStorage.setUser(freshUser)
        setUser(freshUser)
        setStatus('authenticated')
      })
      .catch(() => {
        tokenStorage.clear()
        setUser(null)
        setStatus('unauthenticated')
      })
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Even if the request fails, clear the local session so the UI moves on.
    }
    tokenStorage.clear()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      tokenStorage.clear()
      setUser(null)
      setStatus('unauthenticated')
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user: newUser, token } = await authService.register(payload)
    tokenStorage.setToken(token)
    tokenStorage.setUser(newUser)
    setUser(newUser)
    setStatus('authenticated')
  }, [])

  const login = useCallback(async (payload: LoginPayload, remember = true) => {
    const { user: loggedInUser, token } = await authService.login(payload)
    tokenStorage.setToken(token, remember)
    tokenStorage.setUser(loggedInUser, remember)
    setUser(loggedInUser)
    setStatus('authenticated')
  }, [])

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    const updated = await authService.updateProfile(payload)
    tokenStorage.setUser(updated)
    setUser(updated)
  }, [])

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    await authService.changePassword(payload)
  }, [])

  const deleteAccount = useCallback(async () => {
    await authService.deleteAccount()
    tokenStorage.clear()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, status, register, login, logout, updateProfile, changePassword, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
