import { NavLink } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { RegisterForm } from '@/components/auth/RegisterForm'

export function Register() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <Reveal>
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
            <NotebookPen className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-ink/50">Start capturing notes with a real CRUD-powered workspace.</p>
        </div>
        <div className="panel rounded-2xl p-6 sm:p-8">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-ink/45">
          Already have an account?{' '}
          <NavLink to="/login" className="focus-ring rounded font-medium text-indigo-400 hover:text-indigo-300">
            Sign in
          </NavLink>
        </p>
      </Reveal>
    </div>
  )
}
