import { User, AuthResponse, LoginRequest, RegisterRequest, APIKey, CreateAPIKeyRequest, AuthContextType } from '../src/types'

describe('Types', () => {
  describe('User interface', () => {
    it('should have required properties', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
      expect(user.id).toBe('1')
      expect(user.email).toBe('test@example.com')
    })

    it('should allow optional name property', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
      expect(user.name).toBe('Test User')
    })
  })

  describe('AuthResponse interface', () => {
    it('should have required properties', () => {
      const response: AuthResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        },
        success: true
      }
      expect(response.success).toBe(true)
      expect(response.user.id).toBe('1')
    })
  })

  describe('LoginRequest interface', () => {
    it('should have email and password', () => {
      const request: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      }
      expect(request.email).toBe('test@example.com')
      expect(request.password).toBe('password123')
    })
  })

  describe('RegisterRequest interface', () => {
    it('should have email and password', () => {
      const request: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123'
      }
      expect(request.email).toBe('test@example.com')
      expect(request.password).toBe('password123')
    })

    it('should allow optional name', () => {
      const request: RegisterRequest = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }
      expect(request.name).toBe('Test User')
    })
  })

  describe('APIKey interface', () => {
    it('should have required properties', () => {
      const apiKey: APIKey = {
        id: '1',
        name: 'Test Key',
        key: 'key_123',
        permissions: ['read'],
        createdAt: '2023-01-01T00:00:00Z',
        isActive: true
      }
      expect(apiKey.id).toBe('1')
      expect(apiKey.name).toBe('Test Key')
      expect(apiKey.isActive).toBe(true)
    })
  })

  describe('CreateAPIKeyRequest interface', () => {
    it('should have required properties', () => {
      const request: CreateAPIKeyRequest = {
        name: 'Test Key',
        permissions: ['read', 'write']
      }
      expect(request.name).toBe('Test Key')
      expect(request.permissions).toEqual(['read', 'write'])
    })
  })
})