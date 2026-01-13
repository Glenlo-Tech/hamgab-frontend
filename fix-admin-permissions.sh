#!/bin/bash

# Fix admin app permissions
echo "🔧 Fixing admin app permissions..."

cd "$(dirname "$0")/apps/admin"

# Remove .next directory if it exists
if [ -d ".next" ]; then
    echo "Removing .next directory..."
    rm -rf .next
    echo "✅ Removed .next directory"
fi

# Ensure we have write permissions
chmod -R u+w . 2>/dev/null || true

echo "✅ Permissions fixed!"
echo ""
echo "Now try running: pnpm dev"

