import { useState, type FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { KeyRound, Loader2, Mail } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/auth/TextInput'
import { authService } from '@/services/authService'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authService.forgotPassword({ email: email.trim() })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <Reveal>
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
            <KeyRound className="h-5 w-5 text-indigo-400" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-white/50">Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="panel rounded-2xl p-6 sm:p-8">
          {submitted ? (
            <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-300">
              If that email exists, a reset link is on its way — check your inbox (and spam folder).
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300" role="alert">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/60">
                  Email
                </label>
                <TextInput
                  id="email"
                  type="email"
                  required
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/45">
          Remembered your password?{' '}
          <NavLink to="/login" className="focus-ring rounded font-medium text-indigo-400 hover:text-indigo-300">
            Sign in
          </NavLink>
        </p>
      </Reveal>
    </div>
  )
}
