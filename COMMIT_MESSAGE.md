# Commit Message

```
refactor: implement multi-domain monorepo architecture with pnpm workspace

BREAKING CHANGE: Project restructured from single Next.js app to monorepo with
separate applications for public, agent, and admin portals.

## Architecture Changes

- Migrated to pnpm monorepo with Turborepo for build orchestration
- Separated codebase into three independent Next.js applications:
  * apps/public - Public website (domain.com)
  * apps/agent - Agent portal (agent.domain.com)
  * apps/admin - Admin portal (admin.domain.com)
- Created shared packages for code reuse:
  * packages/types - Shared TypeScript type definitions
  * packages/utils - Shared utility functions (fetch, auth, cn)
  * packages/hooks - Shared React hooks (useMobile, useToast)

## Infrastructure

- Added Docker support with multi-stage builds for production
- Configured docker-compose for development and production environments
- Added ESLint configuration with TypeScript support
- Updated Next.js configs to use remotePatterns instead of deprecated domains
- Configured proper security headers per domain (stricter for admin)

## Code Quality

- Removed duplicate code in utils package
- Fixed routing issues in agent portal
- Restored original agent landing page structure
- Cleaned up unused files and documentation
- Added proper TypeScript path aliases for shared packages

## Developer Experience

- Added comprehensive scripts for development, build, and Docker operations
- Configured Turborepo pipeline for efficient builds
- Set up proper workspace dependencies using pnpm workspace protocol
- Added environment variable documentation

## Technical Details

- Next.js 16.0.10 with App Router
- React 19.2.0
- TypeScript strict mode enabled
- Tailwind CSS 4.1.9
- Radix UI components
- Framer Motion for animations

## Migration Notes

- All existing UI components and functionality preserved
- Routes updated to remove redundant /agent prefix in agent app
- Shared utilities moved to packages/utils
- Each app maintains its own public assets and components
- Backward compatibility maintained through re-export files

Co-authored-by: Architecture Review <review@propflow.com>
```

