# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development Commands

```bash
# Start development server for all packages
npm run dev

# Build all packages
npm run build

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run typecheck

# Clean build artifacts
npm run clean
```

### Package Management

```bash
# Install dependencies
npm install

# Add dependency to specific package
npm install <package> --workspace=@robosystems/auth-core

# Run command in specific package
npm run build --workspace=@robosystems/auth-components

# Generate changelogs for release
npm run changeset

# Version packages based on changesets
npm run version-packages

# Publish to npm
npm run release
```

## Architecture

This monorepo contains shared React components and utilities for RoboSystems applications.

### Packages

- **@robosystems/auth-core** - Authentication utilities and API client
- **@robosystems/auth-components** - React authentication components

### Used By

- [RoboLedger](https://roboledger.ai) - Financial reporting & accounting
- [RoboInvestor](https://roboinvestor.ai) - Investment portfolio management  
- [RoboSystems](https://robosystems.ai) - Platform dashboard

## Testing

This project uses Jest for testing with the following patterns:

- Tests are located in `__tests__` directories
- Test files use the pattern `*.test.ts` or `*.test.tsx`
- Coverage reports are generated in the `coverage/` directory
- Run individual package tests: `npm test --workspace=@robosystems/auth-core`

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

1. Make your changes
2. Run `npm run changeset` to document changes
3. Run `npm run version-packages` to bump versions
4. Run `npm run release` to publish to npm

## Development Patterns

### Code Style

- ESLint with TypeScript, React, and Prettier plugins
- Prettier for code formatting with organize imports
- No semicolons, single quotes, 2-space indentation
- Trailing commas for better diffs

### TypeScript

- Target ES2017 for broad compatibility
- Non-strict mode for flexibility
- React JSX transform
- Module resolution: bundler

### Testing

- Jest with jsdom environment
- React Testing Library for component tests
- Coverage thresholds enforced in CI

## Integration

### Installing in Applications

```bash
npm install @robosystems/auth-core @robosystems/auth-components
```

### Usage Example

```tsx
import { AuthProvider, SignInForm } from '@robosystems/auth-components'

function App() {
  return (
    <AuthProvider apiUrl="https://api.robosystems.ai">
      <SignInForm redirectTo="/dashboard" />
    </AuthProvider>
  )
}
```