import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Trash2, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/auth/FormField'
import { TextInput } from '@/components/auth/TextInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { ConfirmButton } from '@/components/dashboard/ConfirmButton'

export function Settings() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaving, setPasswordSaving] = useState(false)

  const [deleting, setDeleting] = useState(false)

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    setProfileError(null)
    if (fullName.trim().length < 2) {
      setProfileError('Enter your full name.')
      return
    }
    setProfileSaving(true)
    try {
      await updateProfile({ fullName: fullName.trim() })
      showToast('Profile updated.', 'success')
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Could not update profile.')
    } finally {
      setProfileSaving(false)
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    setPasswordSaving(true)
    try {
      await changePassword({ currentPassword, newPassword })
      showToast('Password changed.', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Could not change password.')
    } finally {
      setPasswordSaving(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await deleteAccount()
      showToast('Account deleted.', 'info')
      navigate('/')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete account.', 'error')
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeading kicker="Account" title="Settings" description="Manage your profile, password, and account." />
      </Reveal>

      <Reveal delay={0.05}>
        <form onSubmit={handleProfileSubmit} className="panel mt-8 space-y-4 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white">Profile</h2>
          {profileError && (
            <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300" role="alert">
              {profileError}
            </div>
          )}
          <FormField label="Full name" htmlFor="settings-name">
            <TextInput
              id="settings-name"
              icon={<User className="h-4 w-4" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </FormField>
          <FormField label="Email" htmlFor="settings-email">
            <TextInput id="settings-email" icon={<User className="h-4 w-4" />} value={user?.email ?? ''} disabled className="opacity-60" />
          </FormField>
          <Button type="submit" disabled={profileSaving}>
            {profileSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {profileSaving ? 'Saving…' : 'Save profile'}
          </Button>
        </form>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={handlePasswordSubmit} className="panel mt-6 space-y-4 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white">Change password</h2>
          {passwordError && (
            <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300" role="alert">
              {passwordError}
            </div>
          )}
          <FormField label="Current password" htmlFor="current-password">
            <PasswordInput id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
          </FormField>
          <FormField label="New password" htmlFor="new-password">
            <PasswordInput id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
          </FormField>
          <FormField label="Confirm new password" htmlFor="confirm-new-password">
            <PasswordInput id="confirm-new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
          </FormField>
          <Button type="submit" disabled={passwordSaving}>
            {passwordSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {passwordSaving ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="panel mt-6 rounded-2xl border-rose-400/20 p-6">
          <h2 className="text-sm font-semibold text-rose-300">Danger zone</h2>
          <p className="mt-1 text-sm text-white/45">Permanently delete your account and all your notes. This cannot be undone.</p>
          <div className="mt-4">
            <ConfirmButton
              onConfirm={handleDeleteAccount}
              label="Delete account"
              confirmLabel="Delete everything?"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              className="h-9 w-auto rounded-lg border border-rose-400/25 px-3 text-xs font-medium"
            >
              Delete account
            </ConfirmButton>
            {deleting && <span className="ml-2 text-xs text-white/40">Deleting…</span>}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
