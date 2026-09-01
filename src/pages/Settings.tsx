import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Loader2, Trash2, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/auth/FormField'
import { TextInput } from '@/components/auth/TextInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { ConfirmButton } from '@/components/dashboard/ConfirmButton'
import { uploadAvatar } from '@/lib/avatarUpload'

export function Settings() {
  const { user, updateProfile, updateAvatar, changePassword, deleteAllDataAndSignOut } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    setAvatarUploading(true)
    try {
      const url = await uploadAvatar(user.id, file)
      await updateAvatar(url)
      showToast('Avatar updated.', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update avatar.', 'error')
    } finally {
      setAvatarUploading(false)
    }
  }

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

  async function handleDeleteAllData() {
    setDeleting(true)
    try {
      await deleteAllDataAndSignOut()
      showToast('All your notes were deleted and you were signed out.', 'info')
      navigate('/')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete your data.', 'error')
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
          <h2 className="text-sm font-semibold text-ink">Profile</h2>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              aria-label="Change avatar"
              className="focus-ring group relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-ink/10 bg-ink/[0.04]"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-ink/40">
                  {user?.fullName?.[0]?.toUpperCase() ?? '?'}
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                {avatarUploading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Camera className="h-4 w-4 text-white" />}
              </span>
            </button>
            <div>
              <p className="text-sm font-medium text-ink">Profile photo</p>
              <p className="text-xs text-ink/40">Click the circle to upload a new one.</p>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

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
              required
              minLength={2}
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
          <h2 className="text-sm font-semibold text-ink">Change password</h2>
          {passwordError && (
            <div className="rounded-lg border border-rose-400/25 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300" role="alert">
              {passwordError}
            </div>
          )}
          <FormField label="Current password" htmlFor="current-password">
            <PasswordInput id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" required />
          </FormField>
          <FormField label="New password" htmlFor="new-password">
            <PasswordInput id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
          </FormField>
          <FormField label="Confirm new password" htmlFor="confirm-new-password">
            <PasswordInput id="confirm-new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
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
          <p className="mt-1 text-sm text-ink/45">
            Permanently delete all your notes and sign you out. This cannot be undone.{' '}
            <span className="text-ink/30">
              (Fully deleting the account record itself requires an admin action, since that needs
              elevated access the browser never holds — contact support if you need that too.)
            </span>
          </p>
          <div className="mt-4">
            <ConfirmButton
              onConfirm={handleDeleteAllData}
              label="Delete all my data"
              confirmLabel="Delete everything?"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              className="h-9 w-auto rounded-lg border border-rose-400/25 px-3 text-xs font-medium"
            >
              Delete all my data
            </ConfirmButton>
            {deleting && <span className="ml-2 text-xs text-ink/40">Deleting…</span>}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
