import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SignInForm } from '../src/SignInForm'
import { AuthProvider } from '../src/AuthProvider'

// Mock the auth client
jest.mock('@robosystems/auth-core', () => ({
  RoboSystemsAuthClient: jest.fn().mockImplementation(() => ({
    getCurrentUser: jest.fn().mockRejectedValue(new Error('Not authenticated')),
    login: jest.fn(),
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
})