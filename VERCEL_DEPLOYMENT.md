# Vercel Deployment Guide for HAMGAB Agent Portal

## Problem
Vercel was trying to use `npm install` but this is a **pnpm monorepo** with workspace dependencies.

## Solution

### Option 1: Configure in Vercel Dashboard (Recommended)

1. Go to your Vercel project:
2. Navigate to **Settings** → **General**
3. Under **Build & Development Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: Leave empty (or set to `apps/agent` if deploying from subdirectory)
   - **Build Command**: `cd ../.. && pnpm --filter @propflow/agent build`
   - **Install Command**: `cd ../.. && pnpm install`
   - **Output Directory**: `.next` (auto-detected)
4. Under **Installation**:
   - **Package Manager**: Select `pnpm` (important!)

### Option 2: Use vercel.json (Already Created)

The `apps/agent/vercel.json` file is already configured with:
```json
{
  "installCommand": "cd ../.. && pnpm install",
  "buildCommand": "cd ../.. && pnpm --filter @propflow/agent build",
  "devCommand": "cd ../.. && pnpm --filter @propflow/agent dev",
  "framework": "nextjs"
}
```

### Option 3: Deploy from Monorepo Root (Best for Monorepos)

1. Delete the current Vercel project link:
   ```bash
   rm -rf apps/agent/.vercel
   ```

2. From the **monorepo root**, run:
   ```bash
   vercel
   ```

3. When prompted:
   - **Which scope?** Your scope
   - **Link to existing project?** No (or Yes if you want to link)
   - **Project name?** hamgab-agent-portal
   - **In which directory is your code located?** `apps/agent`
   - **Want to modify settings?** Yes
     - **Root Directory**: `apps/agent`
     - **Build Command**: `pnpm --filter @propflow/agent build`
     - **Install Command**: `pnpm install`
     - **Package Manager**: `pnpm`

## Environment Variables

Make sure to set these in Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://hamgab-backend.com`)

## Verify Deployment

After deployment, check:
1. ✅ Build logs show `pnpm install` (not `npm install`)
2. ✅ Build completes successfully
3. ✅ App is accessible at the Vercel URL

## Troubleshooting

### Error: "Command 'npm install' exited with 1"
- **Fix**: Make sure Package Manager is set to `pnpm` in Vercel dashboard

### Error: "Cannot find module '@propflow/types'"
- **Fix**: Install command must run from monorepo root to install workspace dependencies

### Error: "Build failed"
- **Fix**: Check that Root Directory is set correctly and build command includes the filter flag

## Current Configuration

- **Monorepo**: pnpm workspaces
- **App Location**: `apps/agent`
- **Package Name**: `@propflow/agent`
- **Workspace Dependencies**: `@propflow/types`, `@propflow/utils`, `@propflow/hooks`

