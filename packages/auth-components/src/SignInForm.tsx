import React, { useState } from 'react'
import { RoboSystemsAuthClient, User } from '@robosystems/auth-core'

export interface SignInFormProps {
  onSuccess?: (user: User) => void
  onRedirect?: (url: string) => void
  redirectTo?: string
  className?: string
  apiUrl: string
}

export function SignInForm({
  onSuccess,
  onRedirect,
  redirectTo = '/home',
  className = '',
  apiUrl
}: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const result = await authClient.login(formData.email, formData.password)

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result.user)
      }
      
      // Use window.location.href for reliable redirect
      window.location.href = redirectTo
    } catch (error: any) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpClick = () => {
    if (onRedirect) {
      onRedirect('/register')
    } else {
      window.location.href = '/register'
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={handleSignUpClick}
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    Create one here
                  </button>
                </p>
              </div>
            </form>
    </div>
  )
}

