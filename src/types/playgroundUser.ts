export type UserRole = 'admin' | 'member' | 'viewer'
export type UserStatus = 'active' | 'invited' | 'suspended'

export interface PlaygroundUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export type PlaygroundUserDraft = Pick<PlaygroundUser, 'name' | 'email' | 'role' | 'status'>

export interface PlaygroundUserFormErrors {
  name?: string
  email?: string
}
