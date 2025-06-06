import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '../src/AuthProvider'

// Mock the auth client
jest.mock('@robosystems/auth-core', () => ({
  RoboSystemsAuthClient: jest.fn().mockImplementation(() => ({
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshSession: jest.fn()
  }))
}))

// Test component that uses the auth context
function TestComponent() {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user ? user.email : 'null'}</div>
    </div>
  )
}

describe('AuthProvider', () => {
  const mockApiUrl = 'https://api.test.com'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide auth context to children', () => {
    render(
      <AuthProvider apiUrl={mockApiUrl}>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByTestId('authenticated')).toBeInTheDocument()
    expect(screen.getByTestId('user')).toBeInTheDocument()
  })

  it('should initially show loading state', () => {
    render(
      <AuthProvider apiUrl={mockApiUrl}>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('null')
  })
})

describe('useAuth', () => {
  it('should throw error when used outside AuthProvider', () => {
    // Mock console.error to avoid noise in test output
    const originalError = console.error
    console.error = jest.fn()

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')

    console.error = originalError
  })
})