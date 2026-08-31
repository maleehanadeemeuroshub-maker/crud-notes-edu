export interface AuthUser {
  id: string
  fullName: string
  email: string
  createdAt: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
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
  token: string
  password: string
}

export interface ApiErrorBody {
  message: string
  field?: string
}
