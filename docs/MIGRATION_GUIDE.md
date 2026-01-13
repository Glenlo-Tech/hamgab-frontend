# Migration Guide: Single App → Multi-Domain Architecture
## Step-by-Step Migration Plan

---

## 📋 Pre-Migration Checklist

Before starting, ensure you have:
- [ ] Git repository with current codebase
- [ ] Backup of current codebase
- [ ] Access to DNS management
- [ ] SSL certificate (wildcard recommended)
- [ ] Deployment platform access (Vercel/self-hosted)

---

## 🚀 Migration Steps

### Step 1: Set Up Monorepo Structure

```bash
# Create new monorepo structure
mkdir -p apps/{public,agent,admin}
mkdir -p packages/{ui,types,utils,hooks,config}

# Install Turborepo
pnpm add -D turbo

# Create workspace config
```

**Create pnpm-workspace.yaml:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Create root package.json:**
```json
{
  "name": "propflow-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

**Create turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

### Step 2: Move Current Code to Public App

```bash
# Copy current app to public app
cp -r app apps/public/app
cp -r components apps/public/components
cp -r lib apps/public/lib
cp -r hooks apps/public/hooks
cp -r public apps/public/public
cp package.json apps/public/package.json
cp next.config.mjs apps/public/next.config.mjs
cp tsconfig.json apps/public/tsconfig.json
cp tailwind.config.js apps/public/tailwind.config.js
```

**Update apps/public/package.json:**
```json
{
  "name": "@propflow/public",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000"
  },
  "dependencies": {
    // Move all current dependencies here
  }
}
```

**Update apps/public/next.config.mjs:**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://domain.com' 
    : '',
  images: {
    domains: ['domain.com'],
  },
}

export default nextConfig
```

---

### Step 3: Create Shared Packages

#### 3.1 Create UI Package

**packages/ui/package.json:**
```json
{
  "name": "@propflow/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "peerDependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

**packages/ui/src/index.ts:**
```ts
// Export all shared UI components
export { Button } from './components/button'
export { Card } from './components/card'
// ... etc
```

**Move shared components:**
```bash
# Move UI components to shared package
cp -r apps/public/components/ui packages/ui/src/components/
```

#### 3.2 Create Types Package

**packages/types/package.json:**
```json
{
  "name": "@propflow/types",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

**packages/types/src/index.ts:**
```ts
export type { Property } from './property'
export type { User } from './user'
export type { Agent } from './agent'
// ... etc
```

**Move types:**
```bash
# Create types directory and move type definitions
mkdir -p packages/types/src
# Move your type definitions here
```

#### 3.3 Create Utils Package

**packages/utils/package.json:**
```json
{
  "name": "@propflow/utils",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

**Move utilities:**
```bash
# Move shared utilities
cp apps/public/lib/utils.ts packages/utils/src/
cp apps/public/lib/fetch-utils.ts packages/utils/src/
```

---

### Step 4: Create Agent Portal

```bash
# Create agent app structure
mkdir -p apps/agent/{app,components,lib}
```

**apps/agent/package.json:**
```json
{
  "name": "@propflow/agent",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001"
  },
  "dependencies": {
    "next": "16.0.10",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@propflow/ui": "workspace:*",
    "@propflow/types": "workspace:*",
    "@propflow/utils": "workspace:*"
  }
}
```

**apps/agent/next.config.mjs:**
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
}

export default nextConfig
```

**Move agent-specific code:**
```bash
# Move agent routes
cp -r apps/public/app/agent apps/agent/app/
cp -r apps/public/components/agent apps/agent/components/
```

**apps/agent/app/layout.tsx:**
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agent Portal | PropFlow',
  description: 'Manage your property listings and submissions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

---

### Step 5: Create Admin Portal

```bash
# Create admin app structure
mkdir -p apps/admin/{app,components,lib}
```

**apps/admin/package.json:**
```json
{
  "name": "@propflow/admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002"
  },
  "dependencies": {
    "next": "16.0.10",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@propflow/ui": "workspace:*",
    "@propflow/types": "workspace:*",
    "@propflow/utils": "workspace:*"
  }
}
```

**apps/admin/next.config.mjs:**
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
}

export default nextConfig
```

**Move admin-specific code:**
```bash
# Move admin routes
cp -r apps/public/app/admin apps/admin/app/
cp -r apps/public/components/admin apps/admin/components/
```

---

### Step 6: Update Public App

Remove agent/admin routes from public app:

```bash
# Remove agent and admin routes from public app
rm -rf apps/public/app/agent
rm -rf apps/public/app/admin
rm -rf apps/public/components/agent
rm -rf apps/public/components/admin
```

**Update apps/public/package.json to use shared packages:**
```json
{
  "dependencies": {
    "@propflow/ui": "workspace:*",
    "@propflow/types": "workspace:*",
    "@propflow/utils": "workspace:*"
  }
}
```

**Update imports in apps/public:**
```tsx
// Before
import { Button } from '@/components/ui/button'

// After
import { Button } from '@propflow/ui'
```

---

### Step 7: Set Up Cross-Domain Authentication

**Create packages/utils/src/auth.ts:**
```ts
export const authConfig = {
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || 'auth.domain.com',
  apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || 'api.domain.com',
  cookieDomain: '.domain.com',
}

export async function login(credentials: LoginCredentials) {
  const response = await fetch(`https://${authConfig.authDomain}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return response.json()
}

export function getAuthToken(): string | null {
  // Implementation for getting token
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}
```

---

### Step 8: Update Environment Variables

**Create .env.example in root:**
```env
# Public Site
NEXT_PUBLIC_PUBLIC_URL=https://domain.com

# Agent Portal
NEXT_PUBLIC_AGENT_URL=https://agent.domain.com

# Admin Portal
NEXT_PUBLIC_ADMIN_URL=https://admin.domain.com

# API
NEXT_PUBLIC_API_URL=https://api.domain.com

# Auth
NEXT_PUBLIC_AUTH_DOMAIN=auth.domain.com
```

**Create apps/public/.env.local:**
```env
NEXT_PUBLIC_SITE_URL=https://domain.com
NEXT_PUBLIC_API_URL=https://api.domain.com
```

**Create apps/agent/.env.local:**
```env
NEXT_PUBLIC_SITE_URL=https://agent.domain.com
NEXT_PUBLIC_API_URL=https://api.domain.com
```

**Create apps/admin/.env.local:**
```env
NEXT_PUBLIC_SITE_URL=https://admin.domain.com
NEXT_PUBLIC_API_URL=https://api.domain.com
```

---

### Step 9: Update Import Paths

Create a script to update imports:

**scripts/update-imports.js:**
```js
const fs = require('fs')
const path = require('path')

function updateImports(dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      updateImports(filePath)
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Update imports
      content = content.replace(
        /from ['"]@\/components\/ui\/(.*)['"]/g,
        "from '@propflow/ui'"
      )
      content = content.replace(
        /from ['"]@\/types\/(.*)['"]/g,
        "from '@propflow/types'"
      )
      content = content.replace(
        /from ['"]@\/lib\/(.*)['"]/g,
        "from '@propflow/utils'"
      )
      
      fs.writeFileSync(filePath, content)
    }
  })
}

// Update each app
updateImports('./apps/public')
updateImports('./apps/agent')
updateImports('./apps/admin')
```

---

### Step 10: Test Locally

```bash
# Install all dependencies
pnpm install

# Run all apps in development
pnpm dev

# Or run individually
pnpm --filter @propflow/public dev
pnpm --filter @propflow/agent dev
pnpm --filter @propflow/admin dev
```

**Test URLs:**
- Public: http://localhost:3000
- Agent: http://localhost:3001
- Admin: http://localhost:3002

---

### Step 11: Configure DNS

Add DNS records:

```
Type    Name    Value
A       @       Your Server IP
A       agent   Your Server IP
A       admin   Your Server IP
```

Or if using Vercel:
- Configure each app with its subdomain
- Vercel will handle DNS automatically

---

### Step 12: Deploy

#### Option A: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy public site
cd apps/public
vercel --prod

# Deploy agent portal
cd ../agent
vercel --prod

# Deploy admin portal
cd ../admin
vercel --prod
```

#### Option B: Self-Hosted

```bash
# Build all apps
pnpm build

# Deploy each app separately
# Use your deployment method (Docker, PM2, etc.)
```

---

## 🔍 Post-Migration Checklist

- [ ] All apps build successfully
- [ ] Shared packages work correctly
- [ ] Cross-domain navigation works
- [ ] Authentication works across domains
- [ ] All routes accessible
- [ ] Images load correctly
- [ ] API calls work
- [ ] No broken imports
- [ ] Performance is maintained
- [ ] SEO still works (public site)

---

## 🐛 Common Issues & Solutions

### Issue: Module not found errors
**Solution:** Ensure shared packages are built before building apps:
```bash
pnpm --filter @propflow/ui build
pnpm --filter @propflow/types build
```

### Issue: Type errors in shared packages
**Solution:** Ensure TypeScript configs extend root config:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Styles not loading
**Solution:** Ensure Tailwind config includes shared packages:
```js
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  '../../packages/ui/**/*.{js,ts,jsx,tsx}',
]
```

### Issue: Cross-domain cookies not working
**Solution:** Ensure cookie domain is set correctly:
```ts
document.cookie = `token=${value}; domain=.domain.com; path=/; secure; samesite=strict`
```

---

## 📊 Migration Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Phase 1** | 2-3 days | Set up monorepo, create shared packages |
| **Phase 2** | 2-3 days | Create agent portal, migrate code |
| **Phase 3** | 2-3 days | Create admin portal, migrate code |
| **Phase 4** | 1-2 days | Update public app, fix imports |
| **Phase 5** | 1-2 days | Set up authentication, test |
| **Phase 6** | 1 day | Deploy, configure DNS, SSL |
| **Total** | **9-14 days** | Full migration |

---

## ✅ Success Criteria

Migration is successful when:
- ✅ All three portals work independently
- ✅ Shared components work across all apps
- ✅ Authentication works across domains
- ✅ No broken links or imports
- ✅ Performance is maintained or improved
- ✅ All features work as before
- ✅ Deployment is successful

---

This migration guide will help you transition smoothly from a single app to a professional multi-domain architecture.

