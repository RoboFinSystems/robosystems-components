# RoboSystems Components

Shared React components and utilities for RoboSystems applications.

## Packages

- [`@robosystems/auth-core`](./packages/auth-core) - Authentication utilities and API client
- [`@robosystems/auth-components`](./packages/auth-components) - React authentication components
- [`@robosystems/ui-core`](./packages/ui-core) - Core UI components and design system

## Quick Start

```bash
npm install @robosystems/auth-core @robosystems/auth-components
```

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

## Development

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build all packages
npm run build

# Run tests
npm run test
```

## Architecture

This monorepo contains shared components used across:
- [RoboLedger](https://roboledger.ai) - Financial reporting & accounting
- [RoboInvestor](https://roboinvestor.ai) - Investment portfolio management  
- [RoboSystems](https://robosystems.ai) - Platform dashboard

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Run `npm run changeset` to document changes
5. Submit a pull request

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

```bash
# Document changes
npm run changeset

# Version packages
npm run version-packages

# Publish to npm
npm run release
```