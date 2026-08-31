import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { PageLoader } from '@/components/ui/PageLoader'

/** Sends already-authenticated users straight to their dashboard instead of the login/register forms. */
export function GuestRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === 'loading') return <PageLoader />
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
