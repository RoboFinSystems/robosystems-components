import { RoboSystemsAuthClient } from '../src/client'

// Mock fetch globally
global.fetch = jest.fn()

describe('RoboSystemsAuthClient', () => {
  let client: RoboSystemsAuthClient
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    client = new RoboSystemsAuthClient('https://api.test.com')
    mockFetch.mockClear()
  })

  describe('constructor', () => {
    it('should create client with baseUrl', () => {
      expect(client).toBeInstanceOf(RoboSystemsAuthClient)
    })

    it('should remove trailing slash from baseUrl', () => {
      const clientWithSlash = new RoboSystemsAuthClient('https://api.test.com/')
      expect(clientWithSlash).toBeInstanceOf(RoboSystemsAuthClient)
    })
  })

  describe('login', () => {
    it('should make POST request to /v1/auth/login', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          user: { id: '1', email: 'test@example.com' },
          success: true
        })
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      await client.login('test@example.com', 'password')

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: 'test@example.com', password: 'password' })
      })
    })

    it('should throw error on failed login', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: 'Unauthorized'
      } as any)

      await expect(client.login('test@example.com', 'wrong')).rejects.toThrow('Login failed: Unauthorized')
    })
  })

  describe('register', () => {
    it('should make POST request to /v1/auth/register', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          user: { id: '1', email: 'test@example.com' },
          success: true
        })
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      await client.register('test@example.com', 'password', 'Test User')

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: 'test@example.com', password: 'password', name: 'Test User' })
      })
    })
  })

  describe('logout', () => {
    it('should make POST request to /v1/auth/logout', async () => {
      mockFetch.mockResolvedValue({ ok: true } as any)

      await client.logout()

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/v1/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    })
  })

  describe('getCurrentUser', () => {
    it('should make GET request to /v1/auth/me', async () => {
      const mockUser = { id: '1', email: 'test@example.com' }
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ user: mockUser })
      } as any)

      const user = await client.getCurrentUser()

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/v1/auth/me', {
        credentials: 'include'
      })
      expect(user).toEqual(mockUser)
    })
  })
})