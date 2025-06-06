// Root package that re-exports all sub-packages

// Export auth-core with namespace to avoid conflicts
export * as AuthCore from '@robosystems/auth-core'

// Export auth-components
export {
  AuthProvider,
  useAuth,
  SignInForm,
  SignUpForm
} from '@robosystems/auth-components'

// Export SDK with namespace to avoid conflicts
export * as SDK from '@robosystems/sdk'

// For backward compatibility, also export the main auth types directly
export type {
  User,
  AuthContextType,
  APIKey
} from '@robosystems/auth-core'