export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  success: boolean
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  graphId?: string
  createdAt: string
  expiresAt?: string
  lastUsedAt?: string
  isActive: boolean
}

export interface CreateAPIKeyRequest {
  name: string
  permissions: string[]
  graphId?: string
  expiresAt?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}