import { http } from '@/lib/http'
import type {
  AuthResponse,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
} from '@/types/auth'

/** Auth calls go through axios (see lib/http.ts) — request/response interceptors handle the bearer token and 401s. */
export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/register', payload)
    return data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async logout(): Promise<void> {
    await http.post('/auth/logout')
  },

  async me(): Promise<AuthUser> {
    const { data } = await http.get<{ user: AuthUser }>('/auth/me')
    return data.user
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    const { data } = await http.patch<{ user: AuthUser }>('/auth/me', payload)
    return data.user
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await http.post('/auth/change-password', payload)
  },

  async deleteAccount(): Promise<void> {
    await http.delete('/auth/me')
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string; resetToken?: string }> {
    const { data } = await http.post<{ message: string; resetToken?: string }>('/auth/forgot-password', payload)
    return data
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await http.post('/auth/reset-password', payload)
  },
}
