# @robosystems/sdk

Auto-generated TypeScript SDK for RoboSystems API services.

## Installation

```bash
npm install @robosystems/sdk
```

## Usage

First, generate the SDK from the OpenAPI specification:

```bash
# Set the service URL
export ROBOSYSTEMS_SERVICE_URL="https://api.robosystems.ai"

# Generate the SDK
npm run generate:sdk
```

Then use in your application:

```typescript
import { client, ApiService } from '@robosystems/sdk'

// Configure the client
client.setConfig({
  baseUrl: 'https://api.robosystems.ai'
})

// Use the generated API methods
const result = await ApiService.getSomeData()
```

## Development

### Generate SDK

```bash
# Set environment variable for API endpoint
export ROBOSYSTEMS_SERVICE_URL="http://localhost:8000"

# Generate SDK from OpenAPI spec
npm run generate

# Or from workspace root
npm run generate:sdk
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Configuration

The SDK generation requires the `ROBOSYSTEMS_SERVICE_URL` environment variable to be set to the base URL of your RoboSystems API service.

## Generated Files

- `src/generated/sdk.gen.ts` - API service methods
- `src/generated/types.gen.ts` - TypeScript type definitions  
- `src/generated/client.gen.ts` - HTTP client configuration

## Integration

This package is designed to be used across RoboSystems applications:

- [RoboLedger](https://roboledger.ai) - Financial reporting & accounting
- [RoboInvestor](https://roboinvestor.ai) - Investment portfolio management  
- [RoboSystems](https://robosystems.ai) - Platform dashboard