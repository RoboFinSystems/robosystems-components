import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SignUpForm } from '../src/SignUpForm'

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
})

// Mock the auth client
const mockRegister = jest.fn()
jest.mock('@robosystems/auth-core', () => ({
  RoboSystemsAuthClient: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    register: mockRegister,
    logout: jest.fn(),
    refreshSession: jest.fn(),
  })),
}))

function renderSignUpForm(props = {}) {
  const defaultProps = {
    apiUrl: 'https://api.test.com',
    onSuccess: jest.fn(),
    onRedirect: jest.fn(),
    ...props,
  }
  return render(<SignUpForm {...defaultProps} />)
}

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.location.href = ''
  })

  it('should render all required inputs when showConfirmPassword is true', async () => {
    await act(async () => {
      renderSignUpForm({ showConfirmPassword: true })
    })

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()
  })

  it('should not render confirm password field when showConfirmPassword is false', async () => {
    await act(async () => {
      renderSignUpForm({ showConfirmPassword: false })
    })

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/confirm password/i)).not.toBeInTheDocument()
  })

  it('should update input values when user types', async () => {
    await act(async () => {
      renderSignUpForm({ showConfirmPassword: true })
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'password123' },
      })
    })

    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('password123')
  })

  it('should show error when passwords do not match', async () => {
    await act(async () => {
      renderSignUpForm({ showConfirmPassword: true })
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'differentpassword' },
      })
      fireEvent.click(submitButton)
    })

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('should call onSuccess and redirect on successful registration', async () => {
    const mockOnSuccess = jest.fn()
    const mockUser = { id: '1', email: 'john@example.com', name: 'John Doe' }

    mockRegister.mockResolvedValueOnce({ user: mockUser })

    await act(async () => {
      renderSignUpForm({
        onSuccess: mockOnSuccess,
        showConfirmPassword: true,
        redirectTo: '/login',
      })
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'password123' },
      })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        'John Doe'
      )
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser)
      expect(window.location.href).toBe('/login')
    })
  })

  it('should display error message on registration failure', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Registration failed'))

    await act(async () => {
      renderSignUpForm({ showConfirmPassword: true })
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'password123' },
      })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    })
  })

  it('should show loading state during registration', async () => {
    let resolveRegister: (value: any) => void
    const registerPromise = new Promise((resolve) => {
      resolveRegister = resolve
    })
    mockRegister.mockReturnValueOnce(registerPromise)

    await act(async () => {
      renderSignUpForm({ showConfirmPassword: true })
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'password123' },
      })
      fireEvent.click(submitButton)
    })

    expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Resolve the register promise
    await act(async () => {
      resolveRegister!({ user: { id: '1', email: 'john@example.com' } })
    })
  })

  it('should show terms acceptance when showTermsAcceptance is true', async () => {
    await act(async () => {
      renderSignUpForm({ showTermsAcceptance: true })
    })

    expect(
      screen.getByText(/by creating an account, you agree/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument()
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
  })

  it('should not show terms acceptance when showTermsAcceptance is false', async () => {
    await act(async () => {
      renderSignUpForm({ showTermsAcceptance: false })
    })

    expect(
      screen.queryByText(/by creating an account, you agree/i)
    ).not.toBeInTheDocument()
  })

  it('should navigate to terms page when terms link is clicked', async () => {
    const mockOnRedirect = jest.fn()

    await act(async () => {
      renderSignUpForm({
        onRedirect: mockOnRedirect,
        showTermsAcceptance: true,
      })
    })

    const termsLink = screen.getByText(/terms of service/i)

    await act(async () => {
      fireEvent.click(termsLink)
    })

    expect(mockOnRedirect).toHaveBeenCalledWith('/pages/terms')
  })

  it('should navigate to privacy page when privacy link is clicked', async () => {
    const mockOnRedirect = jest.fn()

    await act(async () => {
      renderSignUpForm({
        onRedirect: mockOnRedirect,
        showTermsAcceptance: true,
      })
    })

    const privacyLink = screen.getByText(/privacy policy/i)

    await act(async () => {
      fireEvent.click(privacyLink)
    })

    expect(mockOnRedirect).toHaveBeenCalledWith('/pages/privacy')
  })
})
