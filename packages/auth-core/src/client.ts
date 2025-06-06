import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  APIKey, 
  CreateAPIKeyRequest 
} from './types'

export class RoboSystemsAuthClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ email, password } as LoginRequest)
    })

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`)
    }

    return response.json()
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, name } as RegisterRequest)
    })

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`)
    }

    return response.json()
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`)
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/v1/auth/me`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Failed to get current user: ${response.statusText}`)
    }

    const data = await response.json()
    return data.user
  }

  async refreshSession(): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Session refresh failed: ${response.statusText}`)
    }

    return response.json()
  }

  async createAPIKey(request: CreateAPIKeyRequest): Promise<APIKey> {
    const response = await fetch(`${this.baseUrl}/v1/auth/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error(`Failed to create API key: ${response.statusText}`)
    }

    return response.json()
  }

  async getAPIKeys(): Promise<APIKey[]> {
    const response = await fetch(`${this.baseUrl}/v1/auth/api-keys`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch API keys: ${response.statusText}`)
    }

    return response.json()
  }

  async revokeAPIKey(keyId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/auth/api-keys/${keyId}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`Failed to revoke API key: ${response.statusText}`)
    }
  }
}