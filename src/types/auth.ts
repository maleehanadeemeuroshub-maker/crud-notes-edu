export interface AuthUser {
  id: string
  fullName: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface RegisterResult {
  user: AuthUser
  /** True when Supabase requires the user to click a confirmation link before they can sign in. */
  requiresEmailConfirmation: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface UpdateProfilePayload {
  fullName: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  password: string
}
