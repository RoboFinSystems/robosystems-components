import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInForm } from '../src/SignInForm'
import { AuthProvider } from '../src/AuthProvider'

// Mock the auth client
const mockLogin = jest.fn()
jest.mock('@robosystems/auth-core', () => ({
  RoboSystemsAuthClient: jest.fn().mockImplementation(() => ({
    getCurrentUser: jest.fn().mockRejectedValue(new Error('Not authenticated')),
    login: mockLogin,
    register: jest.fn(),
    logout: jest.fn(),
    refreshSession: jest.fn()
  }))
}))

function renderSignInForm(props = {}) {
  return render(
    <AuthProvider apiUrl="https://api.test.com">
      <SignInForm {...props} />
    </AuthProvider>
  )
}

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render email and password inputs', () => {
    renderSignInForm()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should update input values when user types', async () => {
    const user = userEvent.setup()
    renderSignInForm()

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should call login on form submission', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      success: true
    })

    renderSignInForm()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderSignInForm()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('should show error message on login failure', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))

    renderSignInForm()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should call onSuccess callback when login succeeds', async () => {
    const user = userEvent.setup()
    const onSuccess = jest.fn()
    const mockUser = { id: '1', email: 'test@example.com' }
    
    mockLogin.mockResolvedValue({
      user: mockUser,
      success: true
    })

    renderSignInForm({ onSuccess })

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})