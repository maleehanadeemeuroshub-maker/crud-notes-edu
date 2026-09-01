import { Navigate, useLocation } from 'react-router-dom'
import { useMemo, type ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { PageLoader } from '@/components/ui/PageLoader'

/** Redirects unauthenticated visitors to /login, preserving where they were headed. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()
  const state = useMemo(() => ({ from: location.pathname }), [location.pathname])

  if (status === 'loading') return <PageLoader />
  if (status === 'unauthenticated') return <Navigate to="/login" replace state={state} />
  return <>{children}</>
}
