import React, { useState } from 'react'
import { RoboSystemsAuthClient, User } from '@robosystems/auth-core'

export interface SignUpFormProps {
  onSuccess?: (user: User) => void
  onRedirect?: (url: string) => void
  redirectTo?: string
  className?: string
  showConfirmPassword?: boolean
  showTermsAcceptance?: boolean
  autoSignIn?: boolean
  apiUrl: string
}

export function SignUpForm({
  onSuccess,
  onRedirect,
  redirectTo = '/login',
  className = '',
  showConfirmPassword = true,
  showTermsAcceptance = true,
  autoSignIn = false,
  apiUrl
}: SignUpFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const authClient = new RoboSystemsAuthClient(apiUrl)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate confirm password if enabled
    if (showConfirmPassword && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const result = await authClient.register(formData.email, formData.password, formData.name)

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result.user)
      }
      
      // Use window.location.href for reliable redirect
      window.location.href = redirectTo
    } catch (error: any) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignInClick = () => {
    if (onRedirect) {
      onRedirect('/login')
    } else {
      window.location.href = '/login'
    }
  }

  const handleTermsClick = (link: string) => {
    if (onRedirect) {
      onRedirect(link)
    } else {
      window.location.href = link
    }
  }

  return (
    <div className={className}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-300 bg-red-900 border border-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="your.email@company.com"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="Create a secure password"
              disabled={loading}
            />
          </div>

          {showConfirmPassword && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {showTermsAcceptance && (
          <div className="text-center text-xs text-gray-400">
            By creating an account, you agree with our{' '}
            <button
              type="button"
              onClick={() => handleTermsClick('/pages/terms')}
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => handleTermsClick('/pages/privacy')}
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Privacy Policy
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleSignInClick}
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

