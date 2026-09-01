import { NavLink } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { LoginForm } from '@/components/auth/LoginForm'

export function Login() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <Reveal>
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
            <NotebookPen className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink/50">Sign in to pick up right where you left off.</p>
        </div>
        <div className="panel rounded-2xl p-6 sm:p-8">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-ink/45">
          Don't have an account?{' '}
          <NavLink to="/register" className="focus-ring rounded font-medium text-indigo-400 hover:text-indigo-300">
            Create one
          </NavLink>
        </p>
      </Reveal>
    </div>
  )
}
