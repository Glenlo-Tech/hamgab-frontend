# 🚀 Quick Start Guide - What to Use Now

## 📍 Current Situation

You have **TWO** copies of your code:

1. **OLD** (root level) - Backup, can be removed later
2. **NEW** (apps/*) - **USE THIS!**

## ✅ Use These Directories

```
✅ apps/public/     → Public website (domain.com)
✅ apps/agent/      → Agent portal (agent.domain.com)  
✅ apps/admin/      → Admin portal (admin.domain.com)
✅ packages/         → Shared code (types, utils, hooks)
```

## ❌ Ignore These (Old Structure)

```
❌ app/             → Old routes (backup)
❌ components/      → Old components (backup)
❌ lib/             → Old utils (backup)
❌ hooks/           → Old hooks (backup)
```

## 🎯 Where to Work

### Public Website
```bash
cd apps/public
# Edit: apps/public/app/
# Edit: apps/public/components/
pnpm dev  # Runs on port 3000
```

### Agent Portal
```bash
cd apps/agent
# Edit: apps/agent/app/
# Edit: apps/agent/components/
pnpm dev  # Runs on port 3001
```

### Admin Portal
```bash
cd apps/admin
# Edit: apps/admin/app/
# Edit: apps/admin/components/
pnpm dev  # Runs on port 3002
```

### Shared Code
```bash
# Types: packages/types/src/
# Utils: packages/utils/src/
# Hooks: packages/hooks/src/
```

## 🔄 Code Flow

```
Your Code (Original)
    ↓
    ├─→ apps/public/    (Public site)
    ├─→ apps/agent/     (Agent portal)
    ├─→ apps/admin/     (Admin portal)
    └─→ packages/        (Shared code)
```

## 🧪 Test It

```bash
# From root directory
pnpm install

# Run all apps
pnpm dev

# Or run individually
pnpm --filter @propflow/public dev
pnpm --filter @propflow/agent dev
pnpm --filter @propflow/admin dev
```

## 🧹 Clean Up Later

After testing, you can backup old files:

```bash
./cleanup-old-files.sh
```

Or manually:
```bash
mkdir .backup
mv app components lib hooks .backup/
```

## 📝 Summary

- ✅ **Use**: `apps/public/`, `apps/agent/`, `apps/admin/`
- ❌ **Ignore**: `app/`, `components/`, `lib/`, `hooks/` (root level)
- 🧹 **Clean up**: After verifying everything works

Your code is safe - it's been copied, not moved!

