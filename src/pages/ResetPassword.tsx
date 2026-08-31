import { useState, type FormEvent } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound, Loader2 } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { FormField } from '@/components/auth/FormField'
import { authService } from '@/services/authService'
import { useToast } from '@/context/ToastContext'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const next: typeof errors = {}
    if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    try {
      await authService.resetPassword({ token, password })
      showToast('Password reset — sign in with your new password.', 'success')
      navigate('/login', { replace: true })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not reset password. Please try again.')
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
          <h1 className="text-2xl font-semibold tracking-tight text-white">Choose a new password</h1>
          <p className="mt-2 text-sm text-white/50">Make it something you'll remember.</p>
        </div>

        <div className="panel rounded-2xl p-6 sm:p-8">
          {!token ? (
            <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300">
              This reset link is missing a token. Request a new one from the forgot password page.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {formError && (
                <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300" role="alert">
                  {formError}
                </div>
              )}
              <FormField label="New password" htmlFor="password" error={errors.password}>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </FormField>
              <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword}>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </FormField>
              <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Resetting…' : 'Reset password'}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/45">
          <NavLink to="/login" className="focus-ring rounded font-medium text-indigo-400 hover:text-indigo-300">
            Back to sign in
          </NavLink>
        </p>
      </Reveal>
    </div>
  )
}
