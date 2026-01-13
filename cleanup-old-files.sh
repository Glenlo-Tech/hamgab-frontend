#!/bin/bash

# Script to backup old files before removing them
# Run this AFTER verifying the new structure works

echo "🧹 Cleaning up old files..."
echo ""
echo "⚠️  This will move old files to .backup/ directory"
echo "⚠️  Make sure you've tested the new structure first!"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Create backup directory
mkdir -p .backup

# Move old files to backup
echo "📦 Moving files to backup..."

[ -d "app" ] && mv app .backup/ && echo "✅ Moved app/"
[ -d "components" ] && mv components .backup/ && echo "✅ Moved components/"
[ -d "lib" ] && mv lib .backup/ && echo "✅ Moved lib/"
[ -d "hooks" ] && mv hooks .backup/ && echo "✅ Moved hooks/"
[ -d "public" ] && mv public .backup/public-old && echo "✅ Moved public/"
[ -f "next.config.mjs" ] && mv next.config.mjs .backup/ && echo "✅ Moved next.config.mjs"
[ -f "postcss.config.mjs" ] && mv postcss.config.mjs .backup/ && echo "✅ Moved postcss.config.mjs"
[ -f "components.json" ] && mv components.json .backup/ && echo "✅ Moved components.json"
[ -d "styles" ] && mv styles .backup/ && echo "✅ Moved styles/"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📁 Old files are in .backup/ directory"
echo "🗑️  You can delete .backup/ later if everything works"
echo ""
echo "🚀 Now use the new structure:"
echo "   - apps/public/ for public site"
echo "   - apps/agent/ for agent portal"
echo "   - apps/admin/ for admin portal"

