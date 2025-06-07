import { RoboSystemsAuthClient } from '../src/client'

// Mock the entire SDK module
jest.mock('@robosystems/sdk', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  getCurrentAuthUser: jest.fn(),
  refreshSession: jest.fn(),
  listUserApiKeys: jest.fn(),
  createUserApiKey: jest.fn(),
  revokeUserApiKey: jest.fn(),
  client: {
    setConfig: jest.fn(),
    getConfig: jest.fn().mockReturnValue({ baseUrl: 'https://api.test.com' })
  }
}))

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentAuthUser,
  refreshSession,
  listUserApiKeys,
  createUserApiKey,
  revokeUserApiKey
} from '@robosystems/sdk'

const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>
const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>
const mockLogoutUser = logoutUser as jest.MockedFunction<typeof logoutUser>
const mockGetCurrentAuthUser = getCurrentAuthUser as jest.MockedFunction<typeof getCurrentAuthUser>
const mockRefreshSession = refreshSession as jest.MockedFunction<typeof refreshSession>
const mockListUserApiKeys = listUserApiKeys as jest.MockedFunction<typeof listUserApiKeys>
const mockCreateUserApiKey = createUserApiKey as jest.MockedFunction<typeof createUserApiKey>
const mockRevokeUserApiKey = revokeUserApiKey as jest.MockedFunction<typeof revokeUserApiKey>

describe('RoboSystemsAuthClient', () => {
  let client: RoboSystemsAuthClient

  beforeEach(() => {
    client = new RoboSystemsAuthClient('https://api.test.com')
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create client with baseUrl', () => {
      expect(client).toBeInstanceOf(RoboSystemsAuthClient)
    })

    it('should handle trailing slash in baseUrl', () => {
      const clientWithSlash = new RoboSystemsAuthClient('https://api.test.com/')
      expect(clientWithSlash).toBeInstanceOf(RoboSystemsAuthClient)
    })
  })

  describe('login', () => {
    it('should call loginUser SDK function and return mapped response', async () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
      const mockSDKResponse = {
        data: {
          user: mockUser,
          message: 'Login successful'
        }
      }
      mockLoginUser.mockResolvedValue(mockSDKResponse as any)

      const result = await client.login('test@example.com', 'password')

      expect(mockLoginUser).toHaveBeenCalledWith({
        client: expect.any(Object),
        body: { email: 'test@example.com', password: 'password' }
      })
      expect(result).toEqual({
        user: mockUser,
        success: true,
        message: 'Login successful'
      })
    })

    it('should throw error on failed login', async () => {
      mockLoginUser.mockRejectedValue(new Error('Invalid credentials'))

      await expect(client.login('test@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      )
    })
  })

  describe('register', () => {
    it('should call registerUser SDK function and return mapped response', async () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
      const mockSDKResponse = {
        data: {
          user: mockUser,
          message: 'Registration successful'
        }
      }
      mockRegisterUser.mockResolvedValue(mockSDKResponse as any)

      const result = await client.register('test@example.com', 'password', 'Test User')

      expect(mockRegisterUser).toHaveBeenCalledWith({
        client: expect.any(Object),
        body: { email: 'test@example.com', password: 'password', name: 'Test User' }
      })
      expect(result).toEqual({
        user: mockUser,
        success: true,
        message: 'Registration successful'
      })
    })
  })

  describe('logout', () => {
    it('should call logoutUser SDK function', async () => {
      mockLogoutUser.mockResolvedValue({} as any)

      await client.logout()

      expect(mockLogoutUser).toHaveBeenCalledWith({
        client: expect.any(Object)
      })
    })
  })

  describe('getCurrentUser', () => {
    it('should call getCurrentAuthUser SDK function and return user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' }
      const mockSDKResponse = {
        data: { user: mockUser }
      }
      mockGetCurrentAuthUser.mockResolvedValue(mockSDKResponse as any)

      const user = await client.getCurrentUser()

      expect(mockGetCurrentAuthUser).toHaveBeenCalledWith({
        client: expect.any(Object)
      })
      expect(user).toEqual(mockUser)
    })
  })

  describe('getAPIKeys', () => {
    it('should call listUserApiKeys SDK function and return mapped API keys', async () => {
      const mockSDKResponse = {
        data: {
          api_keys: [
            {
              id: 'key1',
              name: 'Test Key',
              prefix: 'rsk_test',
              is_active: true,
              created_at: '2023-01-01T00:00:00Z',
              last_used_at: '2023-01-02T00:00:00Z'
            }
          ]
        }
      }
      mockListUserApiKeys.mockResolvedValue(mockSDKResponse as any)

      const apiKeys = await client.getAPIKeys()

      expect(mockListUserApiKeys).toHaveBeenCalledWith({
        client: expect.any(Object)
      })
      expect(apiKeys).toEqual([
        {
          id: 'key1',
          name: 'Test Key',
          key: 'rsk_test...',
          permissions: [],
          createdAt: '2023-01-01T00:00:00Z',
          isActive: true,
          lastUsedAt: '2023-01-02T00:00:00Z'
        }
      ])
    })
  })

  describe('createAPIKey', () => {
    it('should call createUserApiKey SDK function and return mapped API key', async () => {
      const mockRequest = {
        name: 'Test Key',
        permissions: ['read', 'write'],
        graphId: 'graph123'
      }
      const mockSDKResponse = {
        data: {
          api_key: {
            id: 'key1',
            name: 'Test Key',
            is_active: true,
            created_at: '2023-01-01T00:00:00Z',
            last_used_at: null
          },
          key: 'rsk_test_actual_key'
        }
      }
      mockCreateUserApiKey.mockResolvedValue(mockSDKResponse as any)

      const apiKey = await client.createAPIKey(mockRequest)

      expect(mockCreateUserApiKey).toHaveBeenCalledWith({
        client: expect.any(Object),
        body: {
          name: 'Test Key',
          description: 'read, write'
        }
      })
      expect(apiKey).toEqual({
        id: 'key1',
        name: 'Test Key',
        key: 'rsk_test_actual_key',
        permissions: ['read', 'write'],
        graphId: 'graph123',
        createdAt: '2023-01-01T00:00:00Z',
        isActive: true,
        lastUsedAt: null,
        expiresAt: undefined
      })
    })
  })

  describe('revokeAPIKey', () => {
    it('should call revokeUserApiKey SDK function', async () => {
      mockRevokeUserApiKey.mockResolvedValue({} as any)

      await client.revokeAPIKey('key123')

      expect(mockRevokeUserApiKey).toHaveBeenCalledWith({
        client: expect.any(Object),
        path: { api_key_id: 'key123' }
      })
    })
  })

  describe('refreshSession', () => {
    it('should call refreshSession SDK function', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@example.com' },
          message: 'Session refreshed'
        }
      }
      mockRefreshSession.mockResolvedValue(mockResponse as any)

      const result = await client.refreshSession()

      expect(mockRefreshSession).toHaveBeenCalledWith({
        client: expect.any(Object)
      })
      expect(result).toEqual({
        user: { id: '1', email: 'test@example.com' },
        success: true,
        message: 'Session refreshed'
      })
    })
  })
})