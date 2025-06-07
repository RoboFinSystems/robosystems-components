import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SignInForm } from '../src/SignInForm'

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
})

// Mock the auth client
const mockLogin = jest.fn()
jest.mock('@robosystems/auth-core', () => ({
  RoboSystemsAuthClient: jest.fn().mockImplementation(() => ({
    login: mockLogin,
    register: jest.fn(),
    logout: jest.fn(),
    refreshSession: jest.fn(),
  })),
}))

function renderSignInForm(props = {}) {
  const defaultProps = {
    apiUrl: 'https://api.test.com',
    onSuccess: jest.fn(),
    onRedirect: jest.fn(),
    ...props,
  }
  return render(<SignInForm {...defaultProps} />)
}

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.location.href = ''
  })

  it('should render email and password inputs', async () => {
    await act(async () => {
      renderSignInForm()
    })

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should update input values when user types', async () => {
    await act(async () => {
      renderSignInForm()
    })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
    })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should call onSuccess and redirect on successful login', async () => {
    const mockOnSuccess = jest.fn()
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }

    mockLogin.mockResolvedValueOnce({ user: mockUser })

    await act(async () => {
      renderSignInForm({ onSuccess: mockOnSuccess })
    })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser)
      expect(window.location.href).toBe('/home')
    })
  })

  it('should display error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))

    await act(async () => {
      renderSignInForm()
    })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during login', async () => {
    let resolveLogin: (value: any) => void
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve
    })
    mockLogin.mockReturnValueOnce(loginPromise)

    await act(async () => {
      renderSignInForm()
    })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
    })

    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Resolve the login promise
    await act(async () => {
      resolveLogin!({ user: { id: '1', email: 'test@example.com' } })
    })
  })

})
