import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { RoboSystemsAuthClient, User, AuthContextType } from '@robosystems/auth-core'

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
  apiUrl: string
}

export function AuthProvider({ children, apiUrl }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authClient] = useState(() => new RoboSystemsAuthClient(apiUrl))

  const isAuthenticated = user !== null

  // Check session on mount
  useEffect(() => {
    checkSession()
  }, [])

  // Auto-refresh session every 10 minutes
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(async () => {
      try {
        await refreshSession()
      } catch (error) {
        console.error('Auto-refresh failed:', error)
        await logout()
      }
    }, 10 * 60 * 1000) // 10 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const checkSession = async () => {
    try {
      const user = await authClient.getCurrentUser()
      setUser(user)
    } catch (error) {
      // User not authenticated, that's fine
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await authClient.login(email, password)
    if (response.success) {
      setUser(response.user)
    } else {
      throw new Error(response.message || 'Login failed')
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    const response = await authClient.register(email, password, name)
    if (response.success) {
      setUser(response.user)
    } else {
      throw new Error(response.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await authClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const refreshSession = async () => {
    const response = await authClient.refreshSession()
    if (response.success) {
      setUser(response.user)
    } else {
      throw new Error('Session refresh failed')
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}