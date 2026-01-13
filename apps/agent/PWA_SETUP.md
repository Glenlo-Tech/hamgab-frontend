# PWA Setup Guide for Agent Portal

## ✅ Completed

- ✅ Mobile-first responsive layout
- ✅ Bottom navigation bar for mobile
- ✅ PWA manifest.json configured
- ✅ Viewport and metadata optimized
- ✅ Safe area insets for notched devices
- ✅ Touch-friendly targets (44px minimum)

## 📱 PWA Icons Required

You need to add the following icons to `apps/agent/public/`:

1. **icon-192x192.png** - 192x192px PNG
2. **icon-512x512.png** - 512x512px PNG
3. **apple-icon.png** - 180x180px PNG (for iOS)

### Quick Icon Generation

You can use tools like:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

Or create them from your existing logo.

## 🔧 Service Worker (Optional)

For offline functionality, you can add a service worker:

```typescript
// apps/agent/public/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('hamgab-agent-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/dashboard',
        '/manifest.json',
      ])
    })
  )
})
```

Then register it in your layout or a client component.

## 📱 Testing PWA

1. **Chrome DevTools:**
   - Open DevTools → Application → Manifest
   - Check "Add to homescreen" works

2. **Mobile Testing:**
   - Deploy to HTTPS
   - Open on mobile device
   - Use "Add to Home Screen" option

3. **Lighthouse:**
   - Run Lighthouse audit
   - Check PWA score (should be 90+)

## 🎨 Mobile Design Features

- ✅ Bottom navigation bar (mobile)
- ✅ Left sidebar (desktop)
- ✅ Responsive cards and grids
- ✅ Touch-friendly buttons (44px min)
- ✅ Safe area support (notches)
- ✅ Standalone mode ready

## 📊 Responsive Breakpoints

- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (sm-lg)
- **Desktop:** > 1024px (lg+)

Bottom nav shows on mobile/tablet, sidebar on desktop.

