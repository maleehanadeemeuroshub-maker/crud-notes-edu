import axios, { AxiosError } from 'axios'
import { tokenStorage } from '@/lib/tokenStorage'

/** Fired when the API rejects a request as unauthenticated, so AuthContext can force a logout. */
export const UNAUTHORIZED_EVENT = 'crud-notes:unauthorized'

/**
 * Shared axios instance used for auth requests (register/login/logout/me).
 * Notes CRUD deliberately uses the native Fetch API instead (see
 * services/notesService.ts) so the app demonstrates both approaches.
 */
export const http = axios.create({ baseURL: '/api' })

http.interceptors.request.use((config) => {
  const token = tokenStorage.getToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

http.interceptors.response.use(
  (response) => response,
  (err: AxiosError<{ message?: string }>) => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    const message = err.response?.data?.message ?? err.message ?? 'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)
