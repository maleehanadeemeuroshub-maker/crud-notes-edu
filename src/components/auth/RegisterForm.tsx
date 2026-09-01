import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Mail, MailCheck, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { FormField } from '@/components/auth/FormField'
import { TextInput } from '@/components/auth/TextInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { Button } from '@/components/ui/Button'

interface FieldErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterForm() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  function validate(): boolean {
    const next: FieldErrors = {}
    if (fullName.trim().length < 2) next.fullName = 'Enter your full name.'
    if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!validate()) return

    setLoading(true)
    try {
      const { requiresEmailConfirmation } = await register({ fullName: fullName.trim(), email: email.trim(), password })
      if (requiresEmailConfirmation) {
        setConfirmationSent(true)
      } else {
        showToast('Account created — welcome to CRUD Notes!', 'success')
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (confirmationSent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <MailCheck className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-ink">Check your email to confirm your account.</p>
        <p className="text-sm text-ink/50">We sent a confirmation link to {email}. Click it, then sign in.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300" role="alert">
          {formError}
        </div>
      )}

      <FormField label="Full name" htmlFor="fullName" error={errors.fullName}>
        <TextInput
          id="fullName"
          icon={<User className="h-4 w-4" />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jordan Rivera"
          autoComplete="name"
          required
          minLength={2}
        />
      </FormField>

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
          placeholder="At least 6 characters"
          autoComplete="new-password"
          required
          minLength={6}
        />
      </FormField>

      <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          minLength={6}
        />
      </FormField>

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
