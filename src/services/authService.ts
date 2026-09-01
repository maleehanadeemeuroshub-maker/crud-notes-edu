import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import type {
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  RegisterResult,
  ResetPasswordPayload,
  UpdateProfilePayload,
} from '@/types/auth'

/** Auth goes through the official Supabase JS SDK — it manages the session/refresh tokens internally. */

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    fullName: (user.user_metadata?.full_name as string | undefined) ?? '',
    email: user.email ?? '',
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    createdAt: user.created_at,
  }
}

export const authService = {
  async register({ fullName, email, password }: RegisterPayload): Promise<RegisterResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Registration failed. Please try again.')

    // Fire-and-forget: a failed welcome email should never block registration.
    if (data.session) {
      fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: data.session.access_token }),
      }).catch(() => {})
    }

    return { user: toAuthUser(data.user), requiresEmailConfirmation: !data.session }
  },

  async login({ email, password }: LoginPayload): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    return toAuthUser(data.user)
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async me(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user ? toAuthUser(user) : null
  },

  async updateProfile({ fullName }: UpdateProfilePayload): Promise<AuthUser> {
    const { data, error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
    if (error) throw new Error(error.message)
    return toAuthUser(data.user)
  },

  async updateAvatar(avatarUrl: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } })
    if (error) throw new Error(error.message)
    return toAuthUser(data.user)
  },

  async changePassword({ currentPassword, newPassword }: ChangePasswordPayload): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) throw new Error('You must be signed in to change your password.')

    // Supabase's updateUser() doesn't check the current password itself, so re-authenticate first.
    const { error: reauthError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword })
    if (reauthError) throw new Error('Current password is incorrect.')

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw new Error(error.message)
  },

  /**
   * The anon key can never delete an auth user (that requires the service_role key on a trusted
   * server), so "delete account" here deletes all of the user's data and signs them out. Full
   * account removal would need a server-side admin action (e.g. a Supabase Edge Function).
   */
  async deleteAllDataAndSignOut(): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('You must be signed in.')

    const { error: deleteError } = await supabase.from('notes').delete().eq('user_id', user.id)
    if (deleteError) throw new Error(deleteError.message)

    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async forgotPassword({ email }: ForgotPasswordPayload): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  },

  async resetPassword({ password }: ResetPasswordPayload): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(error.message)
  },
}
