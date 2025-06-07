import { 
  registerUser,
  loginUser,
  logoutUser,
  getCurrentAuthUser,
  refreshSession,
  listUserApiKeys,
  createUserApiKey,
  revokeUserApiKey,
  client
} from '@robosystems/sdk'
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  APIKey, 
  CreateAPIKeyRequest 
} from './types'

export class RoboSystemsAuthClient {
  private client: typeof client

  constructor(baseUrl: string) {
    // Configure the SDK client with the provided base URL and credentials
    this.client = client
    this.client.setConfig({
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      credentials: 'include' // Essential for cookie-based authentication
    })
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await loginUser({
      client: this.client,
      body: { email, password }
    })

    const sdkResponse = response.data as any
    return {
      user: sdkResponse.user as User,
      success: true,
      message: sdkResponse.message
    }
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await registerUser({
      client: this.client,
      body: { email, password, name: name || '' }
    })

    const sdkResponse = response.data as any
    return {
      user: sdkResponse.user as User,
      success: true,
      message: sdkResponse.message
    }
  }

  async logout(): Promise<void> {
    await logoutUser({
      client: this.client
    })
  }

  async getCurrentUser(): Promise<User> {
    const response = await getCurrentAuthUser({
      client: this.client
    })

    const data = response.data as any
    return data.user
  }

  async refreshSession(): Promise<AuthResponse> {
    const response = await refreshSession({
      client: this.client
    })

    const sdkResponse = response.data as any
    return {
      user: sdkResponse.user as User,
      success: true,
      message: sdkResponse.message
    }
  }

  async createAPIKey(request: CreateAPIKeyRequest): Promise<APIKey> {
    const response = await createUserApiKey({
      client: this.client,
      body: {
        name: request.name,
        description: request.permissions.join(', ') // Map permissions to description for now
      }
    })

    const sdkResponse = response.data as any
    return {
      id: sdkResponse.api_key.id,
      name: sdkResponse.api_key.name,
      key: sdkResponse.key,
      permissions: request.permissions,
      graphId: request.graphId,
      createdAt: sdkResponse.api_key.created_at,
      isActive: sdkResponse.api_key.is_active,
      lastUsedAt: sdkResponse.api_key.last_used_at,
      expiresAt: request.expiresAt
    }
  }

  async getAPIKeys(): Promise<APIKey[]> {
    const response = await listUserApiKeys({
      client: this.client
    })

    const sdkResponse = response.data as any
    return sdkResponse.api_keys.map((apiKey: any) => ({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKey.prefix + '...', // Only prefix is available in list
      permissions: [], // Not available in the SDK response
      createdAt: apiKey.created_at,
      isActive: apiKey.is_active,
      lastUsedAt: apiKey.last_used_at
    }))
  }

  async revokeAPIKey(keyId: string): Promise<void> {
    await revokeUserApiKey({
      client: this.client,
      path: { api_key_id: keyId }
    })
  }
}