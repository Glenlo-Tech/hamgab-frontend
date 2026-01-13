# HAMGAB Agent Portal - Monorepo

Multi-domain architecture with separate portals for public, agents, and admins.

## 🏗️ Architecture

```
domain.com          → Public website (apps/public)
agent.domain.com    → Agent portal (apps/agent)
admin.domain.com    → Admin portal (apps/admin)
```

## 📦 Project Structure

```
propflow/
├── apps/
│   ├── public/     # Public website (domain.com)
│   ├── agent/       # Agent portal (agent.domain.com)
│   └── admin/       # Admin portal (admin.domain.com)
└── packages/
    ├── types/       # Shared TypeScript types
    ├── utils/       # Shared utilities
    └── hooks/       # Shared React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies for all packages
pnpm install

# Install Turborepo globally (optional)
pnpm add -g turbo
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter @propflow/public dev   # Port 3000
pnpm --filter @propflow/agent dev    # Port 3001
pnpm --filter @propflow/admin dev    # Port 3002
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter @propflow/public build
pnpm --filter @propflow/agent build
pnpm --filter @propflow/admin build
```

## 📝 Environment Variables

Create `.env.local` files in each app directory:

### apps/public/.env.local
```env
NEXT_PUBLIC_PUBLIC_URL=https://domain.com
NEXT_PUBLIC_API_URL=https://api.domain.com
```

### apps/agent/.env.local
```env
NEXT_PUBLIC_AGENT_URL=https://agent.domain.com
NEXT_PUBLIC_API_URL=https://api.domain.com
```

### apps/admin/.env.local
```env
NEXT_PUBLIC_ADMIN_URL=https://admin.domain.com
NEXT_PUBLIC_API_URL=https://api.domain.com
```

## 🔧 Shared Packages

### @propflow/types
Shared TypeScript type definitions.

```tsx
import type { Property, Agent } from '@propflow/types'
```

### @propflow/utils
Shared utility functions.

```tsx
import { cn, fetchWithRetry } from '@propflow/utils'
```

### @propflow/hooks
Shared React hooks.

```tsx
import { useMobile, useToast } from '@propflow/hooks'
```

## 📚 Documentation

- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md) - Performance and architecture guide
- [Multi-Domain Architecture](./MULTI_DOMAIN_ARCHITECTURE.md) - Multi-domain setup guide
- [Migration Guide](./MIGRATION_GUIDE.md) - Migration from single app
- [Implementation Examples](./IMPLEMENTATION_EXAMPLES.md) - Code examples

## 🚢 Deployment

### Docker (Recommended)

**Quick Start:**
```bash
# Development mode (hot reload)
make docker-dev
# or
pnpm docker:dev

# Production mode
make docker-prod-build
# or
pnpm docker:prod:build
```

**Access:**
- Public: http://localhost:3000
- Agent: http://localhost:3001
- Admin: http://localhost:3002

See [DOCKER.md](./DOCKER.md) for complete Docker guide.

### Vercel

Each app can be deployed independently to Vercel:

```bash
# Deploy public site
cd apps/public
vercel --prod

# Deploy agent portal
cd apps/agent
vercel --prod

# Deploy admin portal
cd apps/admin
vercel --prod
```

### Self-Hosted

Build and deploy each app separately:

```bash
pnpm build
# Deploy apps/public/.next
# Deploy apps/agent/.next
# Deploy apps/admin/.next
```

## 🔐 Cross-Domain Authentication

Authentication utilities are available in `@propflow/utils`:

```tsx
import { getAuthToken, setAuthToken, authConfig } from '@propflow/utils'

// Get auth token (checks localStorage and cookies)
const token = getAuthToken()

// Set auth token (sets both localStorage and cookie)
setAuthToken(token)
```

Cookies are set on `.domain.com` domain, making them accessible across all subdomains.

## 📊 Scripts

- `pnpm dev` - Start all apps in development
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all apps
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean all build artifacts

## 🎯 Next Steps

1. Set up DNS records for subdomains
2. Configure SSL certificates (wildcard recommended)
3. Set up CI/CD pipelines
4. Configure environment variables
5. Deploy to production

## 📖 Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

