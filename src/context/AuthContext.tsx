import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { authService, toAuthUser } from '@/services/authService'
import type {
  AuthUser,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  RegisterResult,
  UpdateProfilePayload,
} from '@/types/auth'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  register: (payload: RegisterPayload) => Promise<RegisterResult>
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<void>
  deleteAllDataAndSignOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    // Supabase's client persists + auto-refreshes the session itself, so this single listener
    // (plus the initial getSession check) is the source of truth for auth state everywhere.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? toAuthUser(session.user) : null)
      setStatus(session?.user ? 'authenticated' : 'unauthenticated')
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toAuthUser(session.user) : null)
      setStatus(session?.user ? 'authenticated' : 'unauthenticated')
    })

    return () => subscription.unsubscribe()
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => authService.register(payload), [])

  const login = useCallback(async (payload: LoginPayload) => {
    await authService.login(payload)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
  }, [])

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    const updated = await authService.updateProfile(payload)
    setUser(updated)
  }, [])

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    await authService.changePassword(payload)
  }, [])

  const deleteAllDataAndSignOut = useCallback(async () => {
    await authService.deleteAllDataAndSignOut()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, status, register, login, logout, updateProfile, changePassword, deleteAllDataAndSignOut }}
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
