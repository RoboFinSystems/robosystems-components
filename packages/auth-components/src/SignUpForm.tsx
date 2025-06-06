import React, { useState } from 'react'
import { useAuth } from './AuthProvider'
import { User } from '@robosystems/auth-core'

export interface SignUpFormProps {
  onSuccess?: (user: User) => void
  onRedirect?: (url: string) => void
  redirectTo?: string
  className?: string
  // Theme and styling options
  theme?: {
    container?: string
    form?: string
    title?: string
    subtitle?: string
    errorAlert?: string
    fieldContainer?: string
    label?: string
    input?: string
    button?: string
    loadingButton?: string
    linkText?: string
    footer?: string
    termsText?: string
  }
  // Content customization
  content?: {
    title?: string
    subtitle?: string
    nameLabel?: string
    namePlaceholder?: string
    emailLabel?: string
    emailPlaceholder?: string
    passwordLabel?: string
    passwordPlaceholder?: string
    confirmPasswordLabel?: string
    confirmPasswordPlaceholder?: string
    submitButton?: string
    loadingText?: string
    termsText?: string
    termsLink?: string
    termsLinkText?: string
    privacyLink?: string
    privacyLinkText?: string
    signInText?: string
    signInLink?: string
    signInLinkText?: string
  }
  // Logo and branding
  branding?: {
    logo?: {
      src: string
      alt: string
      width?: number
      height?: number
    }
    appName?: string
    showFooter?: boolean
    footerText?: string
  }
  // Layout options
  layout?: {
    fullScreen?: boolean
    showBackground?: boolean
    backgroundClass?: string
  }
  // Features
  features?: {
    showConfirmPassword?: boolean
    showTermsAcceptance?: boolean
    autoSignIn?: boolean
  }
}

const defaultTheme = {
  container: 'min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
  form: 'w-full max-w-md space-y-8',
  title: 'font-bold text-3xl text-white text-center',
  subtitle: 'text-gray-300 text-center mt-2',
  errorAlert: 'p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md',
  fieldContainer: 'space-y-4',
  label: 'block text-sm font-medium text-gray-200',
  input: 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-zinc-800/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
  button: 'w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300',
  loadingButton: 'w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-700 to-blue-600 opacity-50 cursor-not-allowed',
  linkText: 'font-medium text-blue-400 transition-colors hover:text-blue-300',
  footer: 'text-center text-xs text-gray-500 space-y-2',
  termsText: 'text-center text-xs leading-relaxed text-gray-400'
}

const defaultContent = {
  title: 'Join the future',
  subtitle: 'Create your account and get started',
  nameLabel: 'Full Name',
  namePlaceholder: 'Enter your full name',
  emailLabel: 'Email Address',
  emailPlaceholder: 'your.email@company.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Create a secure password',
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordPlaceholder: 'Confirm your password',
  submitButton: 'Create Account',
  loadingText: 'Creating Account...',
  termsText: 'By creating an account, you agree with our',
  termsLink: '/pages/terms',
  termsLinkText: 'Terms of Service',
  privacyLink: '/pages/privacy',
  privacyLinkText: 'Privacy Policy',
  signInText: 'Already have an account?',
  signInLink: '/login',
  signInLinkText: 'Sign in here'
}

export function SignUpForm({
  onSuccess,
  onRedirect,
  redirectTo = '/home',
  className = '',
  theme = {},
  content = {},
  branding,
  layout = {},
  features = {}
}: SignUpFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, login } = useAuth()

  // Merge themes, content, and features
  const mergedTheme = { ...defaultTheme, ...theme }
  const mergedContent = { ...defaultContent, ...content }
  const { fullScreen = true, showBackground = true, backgroundClass } = layout
  const { 
    showConfirmPassword = false, 
    showTermsAcceptance = true, 
    autoSignIn = true 
  } = features

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate confirm password if enabled
    if (showConfirmPassword && password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const result = await register(email, password, name)
      
      if (result && autoSignIn) {
        // Auto sign in after successful registration
        const loginResult = await login(email, password)
        if (loginResult && onSuccess) {
          onSuccess(loginResult as User)
        } else if (onRedirect) {
          onRedirect(redirectTo)
        }
      } else if (result && onSuccess) {
        onSuccess(result as User)
      } else if (onRedirect) {
        onRedirect(redirectTo)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInClick = () => {
    if (onRedirect && mergedContent.signInLink) {
      onRedirect(mergedContent.signInLink)
    }
  }

  const handleTermsClick = (link: string) => {
    if (onRedirect) {
      onRedirect(link)
    }
  }

  const containerClass = fullScreen
    ? `${showBackground ? (backgroundClass || mergedTheme.container) : ''} ${className}`
    : className

  const contentWrapper = fullScreen ? (
    <div className={containerClass}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <FormContent />
      </div>
    </div>
  ) : (
    <div className={containerClass}>
      <FormContent />
    </div>
  )

  function FormContent() {
    return (
      <div className={mergedTheme.form}>
        {/* Branding Header */}
        {branding && (
          <div className="text-center">
            {branding.logo && (
              <div className="mb-6 flex items-center justify-center">
                <img
                  src={branding.logo.src}
                  alt={branding.logo.alt}
                  width={branding.logo.width || 48}
                  height={branding.logo.height || 48}
                  className="mr-3"
                />
                {branding.appName && (
                  <span className="font-heading text-3xl font-semibold text-white">
                    {branding.appName}
                  </span>
                )}
              </div>
            )}
            <h1 className={mergedTheme.title}>
              {mergedContent.title}
            </h1>
            <p className={mergedTheme.subtitle}>
              {mergedContent.subtitle}
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="border-gray-700/50 bg-zinc-900/80 backdrop-blur-sm rounded-lg p-6">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
              <div className={mergedTheme.errorAlert}>
                {error}
              </div>
            )}
            
            <div className={mergedTheme.fieldContainer}>
              <div>
                <label htmlFor="name" className={mergedTheme.label}>
                  {mergedContent.nameLabel}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`${mergedTheme.input} mt-1`}
                  placeholder={mergedContent.namePlaceholder}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="email" className={mergedTheme.label}>
                  {mergedContent.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${mergedTheme.input} mt-1`}
                  placeholder={mergedContent.emailPlaceholder}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className={mergedTheme.label}>
                  {mergedContent.passwordLabel}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${mergedTheme.input} mt-1`}
                  placeholder={mergedContent.passwordPlaceholder}
                  disabled={isLoading}
                />
              </div>

              {showConfirmPassword && (
                <div>
                  <label htmlFor="confirmPassword" className={mergedTheme.label}>
                    {mergedContent.confirmPasswordLabel}
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`${mergedTheme.input} mt-1`}
                    placeholder={mergedContent.confirmPasswordPlaceholder}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={isLoading ? mergedTheme.loadingButton : mergedTheme.button}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {mergedContent.loadingText}
                </div>
              ) : (
                mergedContent.submitButton
              )}
            </button>

            {showTermsAcceptance && (
              <div className={mergedTheme.termsText}>
                {mergedContent.termsText}{' '}
                <button
                  type="button"
                  onClick={() => handleTermsClick(mergedContent.termsLink)}
                  className={mergedTheme.linkText}
                >
                  {mergedContent.termsLinkText}
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => handleTermsClick(mergedContent.privacyLink)}
                  className={mergedTheme.linkText}
                >
                  {mergedContent.privacyLinkText}
                </button>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-400">
                {mergedContent.signInText}{' '}
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className={mergedTheme.linkText}
                >
                  {mergedContent.signInLinkText}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        {branding?.showFooter && branding.footerText && (
          <div className={mergedTheme.footer}>
            <p>{branding.footerText}</p>
          </div>
        )}
      </div>
    )
  }

  return contentWrapper
}

// Export default theme and content for easy customization
export { defaultTheme as signUpDefaultTheme, defaultContent as signUpDefaultContent }