import { useState, type FormEvent } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Loader2, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { FormField } from '@/components/auth/FormField'
import { TextInput } from '@/components/auth/TextInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { Button } from '@/components/ui/Button'

interface FieldErrors {
  email?: string
  password?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!validate()) return

    setLoading(true)
    try {
      await login({ email: email.trim(), password })
      showToast('Welcome back!', 'success')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300" role="alert">
          {formError}
        </div>
      )}

      <FormField label="Email" htmlFor="email" error={errors.email}>
        <TextInput
          id="email"
          type="email"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password}>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
      </FormField>

      <div className="flex justify-end">
        <NavLink to="/forgot-password" className="focus-ring rounded text-xs font-medium text-indigo-400 hover:text-indigo-300">
          Forgot password?
        </NavLink>
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
