# Multi-Domain Architecture Guide
## Professional Subdomain Strategy for PropFlow

---

## 🎯 Architecture Overview

```
domain.com              → Public-facing website
agent.domain.com        → Agent portal
admin.domain.com        → Admin portal
api.domain.com          → Backend API (future)
```

---

## ✅ Benefits of Multi-Domain Architecture

### 1. **Security & Isolation**
- **Separate security contexts**: Each subdomain has isolated cookies, localStorage, and session storage
- **Reduced attack surface**: Admin portal isolated from public site
- **Independent security policies**: Different CORS, CSP, and security headers per domain
- **Role-based access**: Easier to enforce strict access controls

### 2. **Performance & Scalability**
- **Independent scaling**: Scale admin/agent portals separately based on traffic
- **CDN optimization**: Different caching strategies per domain
- **Bundle optimization**: Smaller bundles per domain (no unused code)
- **Independent deployments**: Deploy updates without affecting other portals

### 3. **Professional Branding**
- **Clear separation**: Users know exactly where they are
- **Better UX**: Tailored experience per user type
- **Trust & credibility**: Professional appearance
- **SEO benefits**: Better organization for search engines

### 4. **Development & Maintenance**
- **Team separation**: Different teams can work independently
- **Easier testing**: Test each portal in isolation
- **Clearer codebase**: Each domain has focused code
- **Simpler CI/CD**: Independent deployment pipelines

---

## 🏗️ Implementation Strategies

### Strategy 1: Monorepo with Multi-Zone Next.js (Recommended)

**Best for**: Shared components, unified codebase, easier maintenance

```
propflow/
├── apps/
│   ├── public/              # domain.com
│   │   ├── app/
│   │   ├── components/
│   │   └── package.json
│   ├── agent/              # agent.domain.com
│   │   ├── app/
│   │   ├── components/
│   │   └── package.json
│   └── admin/              # admin.domain.com
│       ├── app/
│       ├── components/
│       └── package.json
├── packages/
│   ├── ui/                 # Shared UI components
│   │   ├── components/
│   │   └── package.json
│   ├── config/             # Shared config (tsconfig, eslint)
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Shared utilities
│   └── hooks/              # Shared hooks
├── package.json            # Root package.json
└── pnpm-workspace.yaml     # Workspace config
```

**Pros:**
- ✅ Shared components and utilities
- ✅ Single codebase to maintain
- ✅ TypeScript types shared across all apps
- ✅ Easier refactoring
- ✅ Unified dependency management

**Cons:**
- ⚠️ Requires monorepo tooling (Turborepo, Nx, or pnpm workspaces)
- ⚠️ Slightly more complex initial setup

---

### Strategy 2: Separate Repositories

**Best for**: Complete independence, different teams, different tech stacks

```
propflow-public/           # domain.com
propflow-agent/            # agent.domain.com
propflow-admin/            # admin.domain.com
propflow-shared/           # Shared package (npm/pnpm)
```

**Pros:**
- ✅ Complete independence
- ✅ Different deployment schedules
- ✅ Easier to scale teams
- ✅ Can use different Next.js versions if needed

**Cons:**
- ⚠️ Harder to share code (need npm package)
- ⚠️ More complex dependency management
- ⚠️ Version synchronization challenges

---

### Strategy 3: Next.js Multi-Zone (Single Repo)

**Best for**: Simpler setup, shared codebase, single deployment

```
propflow/
├── apps/
│   ├── public/
│   ├── agent/
│   └── admin/
└── shared/
```

**Pros:**
- ✅ Next.js built-in support
- ✅ Simpler than monorepo
- ✅ Shared codebase

**Cons:**
- ⚠️ Less flexible than monorepo
- ⚠️ All apps must use same Next.js version

---

## 🎯 Recommended Approach: Monorepo with Turborepo

I recommend **Strategy 1** with Turborepo for the best balance of flexibility and maintainability.

---

## 📦 Project Structure (Monorepo)

```
propflow/
├── .github/
│   └── workflows/          # CI/CD workflows
├── apps/
│   ├── public/            # domain.com
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── listings/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   └── landing/
│   │   ├── public/
│   │   ├── next.config.mjs
│   │   └── package.json
│   │
│   ├── agent/             # agent.domain.com
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── submit/
│   │   │   └── listings/
│   │   ├── components/
│   │   │   └── agent/
│   │   ├── next.config.mjs
│   │   └── package.json
│   │
│   └── admin/             # admin.domain.com
│       ├── app/
│       │   ├── dashboard/
│       │   ├── users/
│       │   └── verification/
│       ├── components/
│       │   └── admin/
│       ├── next.config.mjs
│       └── package.json
│
├── packages/
│   ├── ui/                # Shared UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── ...
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/            # Shared configs
│   │   ├── eslint-config/
│   │   ├── typescript-config/
│   │   └── tailwind-config/
│   │
│   ├── types/             # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── property.ts
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/             # Shared utilities
│   │   ├── src/
│   │   │   ├── fetch-utils.ts
│   │   │   ├── error-tracking.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── hooks/             # Shared hooks
│       ├── src/
│       │   ├── use-property-filters.ts
│       │   └── index.ts
│       └── package.json
│
├── package.json           # Root package.json
├── pnpm-workspace.yaml    # pnpm workspace config
├── turbo.json            # Turborepo config
└── tsconfig.json         # Root tsconfig
```

---

## 🔧 Implementation Steps

### Step 1: Set Up Monorepo Structure

```bash
# Install Turborepo
pnpm add -D turbo

# Create workspace structure
mkdir -p apps/{public,agent,admin}
mkdir -p packages/{ui,config,types,utils,hooks}
```

### Step 2: Configure pnpm Workspace

**pnpm-workspace.yaml**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**package.json (root)**
```json
{
  "name": "propflow-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5"
  }
}
```

### Step 3: Configure Turborepo

**turbo.json**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    }
  }
}
```

### Step 4: Configure Each Next.js App

**apps/public/next.config.mjs**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Public site config
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://domain.com' 
    : '',
  
  // Shared package imports
  transpilePackages: ['@propflow/ui', '@propflow/types', '@propflow/utils'],
  
  images: {
    domains: ['domain.com', 'agent.domain.com', 'admin.domain.com'],
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

**apps/agent/next.config.mjs**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://agent.domain.com' 
    : '',
  
  transpilePackages: ['@propflow/ui', '@propflow/types', '@propflow/utils'],
  
  images: {
    domains: ['domain.com', 'agent.domain.com'],
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Stricter for agent portal
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

**apps/admin/next.config.mjs**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://admin.domain.com' 
    : '',
  
  transpilePackages: ['@propflow/ui', '@propflow/types', '@propflow/utils'],
  
  images: {
    domains: ['domain.com', 'admin.domain.com'],
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Strictest for admin
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## 🔐 Authentication Across Domains

### Challenge: Cookies & Sessions

Cookies are domain-specific. You need a strategy for cross-domain authentication.

### Solution 1: Shared Authentication Domain (Recommended)

Use a dedicated auth subdomain that all portals can access:

```
auth.domain.com           # Authentication service
```

**Implementation:**

```tsx
// lib/auth-config.ts (shared package)
export const authConfig = {
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || 'auth.domain.com',
  cookieDomain: '.domain.com', // Shared cookie domain
  apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || 'api.domain.com',
}

// Authentication flow
export async function login(credentials: LoginCredentials) {
  const response = await fetch(`https://${authConfig.authDomain}/api/auth/login`, {
    method: 'POST',
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
  
  // Cookie is set on .domain.com, accessible to all subdomains
  return response.json()
}
```

### Solution 2: Token-Based with Shared Storage

Use JWT tokens stored in a way accessible across domains:

```tsx
// lib/auth.ts (shared package)
export function setAuthToken(token: string) {
  // Store in localStorage (domain-specific)
  localStorage.setItem('auth_token', token)
  
  // Also set cookie on parent domain
  document.cookie = `auth_token=${token}; domain=.domain.com; path=/; secure; samesite=strict`
}

export function getAuthToken(): string | null {
  // Try localStorage first
  const token = localStorage.getItem('auth_token')
  if (token) return token
  
  // Fallback to cookie
  const cookies = document.cookie.split(';')
  const authCookie = cookies.find(c => c.trim().startsWith('auth_token='))
  return authCookie?.split('=')[1] || null
}
```

### Solution 3: OAuth 2.0 / OpenID Connect

Use industry-standard OAuth flow:

```tsx
// Redirect to auth.domain.com for login
window.location.href = `https://auth.domain.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`

// After login, redirect back with code
// Exchange code for token
const token = await exchangeCodeForToken(code)
```

---

## 🌐 Domain Configuration

### DNS Setup

```
A Record:
  @                    → Your server IP
  agent                → Your server IP
  admin                → Your server IP
  api                  → Your API server IP (future)
  auth                 → Your auth server IP (optional)

CNAME (if using CDN):
  @                    → cdn.domain.com
  agent                → cdn.domain.com
  admin                → cdn.domain.com
```

### SSL Certificates

Use wildcard SSL certificate:
- `*.domain.com` covers all subdomains
- Single certificate for all subdomains
- Easier to manage

Or individual certificates per subdomain (more secure but more management).

---

## 🚀 Deployment Strategy

### Option 1: Vercel (Recommended for Next.js)

**vercel.json** (root)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/public/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "apps/agent/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "apps/admin/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/public/$1"
    }
  ]
}
```

**Deploy each app separately:**
```bash
# Deploy public site
vercel --cwd apps/public --prod

# Deploy agent portal
vercel --cwd apps/agent --prod --scope agent-domain

# Deploy admin portal
vercel --cwd apps/admin --prod --scope admin-domain
```

### Option 2: Self-Hosted with Nginx

**nginx.conf**
```nginx
# Public site
server {
    server_name domain.com www.domain.com;
    root /var/www/propflow/apps/public/.next;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Agent portal
server {
    server_name agent.domain.com;
    root /var/www/propflow/apps/agent/.next;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin portal
server {
    server_name admin.domain.com;
    root /var/www/propflow/apps/admin/.next;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📦 Shared Package Setup

### packages/ui/package.json
```json
{
  "name": "@propflow/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@radix-ui/react-button": "latest"
  },
  "peerDependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

### packages/types/package.json
```json
{
  "name": "@propflow/types",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

### Using Shared Packages

**apps/agent/package.json**
```json
{
  "dependencies": {
    "@propflow/ui": "workspace:*",
    "@propflow/types": "workspace:*",
    "@propflow/utils": "workspace:*"
  }
}
```

**apps/agent/app/page.tsx**
```tsx
import { Button } from '@propflow/ui'
import type { Property } from '@propflow/types'
import { formatPrice } from '@propflow/utils'
```

---

## 🔄 Migration Strategy

### Phase 1: Prepare Monorepo (Week 1)
1. Set up Turborepo structure
2. Move current code to `apps/public`
3. Create shared packages
4. Extract shared components to `packages/ui`

### Phase 2: Split Agent Portal (Week 2)
1. Create `apps/agent`
2. Move agent-specific routes and components
3. Set up agent domain configuration
4. Test agent portal independently

### Phase 3: Split Admin Portal (Week 3)
1. Create `apps/admin`
2. Move admin-specific routes and components
3. Set up admin domain configuration
4. Test admin portal independently

### Phase 4: Deploy & Test (Week 4)
1. Configure DNS
2. Set up SSL certificates
3. Deploy each portal
4. Test cross-domain authentication
5. Monitor and optimize

---

## ✅ Checklist

### Setup
- [ ] Set up monorepo structure
- [ ] Configure Turborepo
- [ ] Set up pnpm workspace
- [ ] Create shared packages
- [ ] Configure Next.js apps

### Authentication
- [ ] Design cross-domain auth strategy
- [ ] Implement auth service
- [ ] Set up cookie domain
- [ ] Test authentication flow

### Deployment
- [ ] Configure DNS records
- [ ] Set up SSL certificates
- [ ] Configure deployment pipeline
- [ ] Set up monitoring per domain

### Testing
- [ ] Test each portal independently
- [ ] Test cross-domain navigation
- [ ] Test authentication flow
- [ ] Test shared components
- [ ] Performance testing

---

## 🎯 Benefits Summary

| Aspect | Benefit |
|--------|---------|
| **Security** | Isolated security contexts, reduced attack surface |
| **Performance** | Independent scaling, optimized bundles |
| **UX** | Clear separation, tailored experiences |
| **Development** | Team independence, easier maintenance |
| **Deployment** | Independent deployments, faster releases |

---

## 🚨 Considerations

### Challenges
1. **Cross-domain cookies**: Need shared auth strategy
2. **Shared state**: Cannot share localStorage/sessionStorage
3. **CORS**: Need proper CORS configuration
4. **Deployment complexity**: More moving parts
5. **Cost**: Potentially more infrastructure

### Mitigations
1. Use shared authentication domain
2. Use API for shared state
3. Configure CORS properly
4. Use CI/CD automation
5. Optimize resource usage

---

This architecture will make your application more professional, secure, and scalable. The monorepo approach ensures code sharing while maintaining separation.

