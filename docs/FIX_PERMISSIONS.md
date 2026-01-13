# Fixing Permission Issues

If you encounter `EACCES: permission denied` errors when running `pnpm dev`, follow these steps:

## Quick Fix

```bash
# Remove .next directories (they'll be recreated)
rm -rf apps/*/.next

# Ensure you have write permissions
chmod -R u+w apps/

# Try running again
pnpm dev
```

## If Still Having Issues

### Option 1: Remove and Recreate
```bash
# Stop all dev servers first
# Then remove .next directories
find apps/ -name ".next" -type d -exec rm -rf {} +

# Run dev again - Next.js will recreate them
pnpm dev
```

### Option 2: Fix Ownership (if created by root)
```bash
# If .next was created by root/sudo, fix ownership
sudo chown -R $USER:$USER apps/
```

### Option 3: Use Docker
```bash
# Docker handles permissions automatically
make docker-dev
```

## What Was Fixed

1. ✅ Removed deprecated `images.domains` → Updated to `images.remotePatterns`
2. ✅ Added `turbopack.root` config to silence workspace warnings
3. ✅ Cleaned up .next directories

## Next Steps

After fixing permissions, run:
```bash
pnpm dev
```

The .next directories will be recreated with proper permissions.

