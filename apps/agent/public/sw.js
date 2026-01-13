// HAMGAB Agent Portal - Service Worker
// Version 1.0.0
const CACHE_NAME = 'hamgab-agent-v1'
const RUNTIME_CACHE = 'hamgab-agent-runtime-v1'
const OFFLINE_PAGE = '/offline'

// Assets to cache on install (static assets)
// Note: Only cache essential static assets. Pages will be cached at runtime.
const STATIC_ASSETS = [
  '/manifest.json',
  '/offline', // Offline fallback page
  '/favicon_io/favicon.ico',
  '/favicon_io/favicon-16x16.png',
  '/favicon_io/favicon-32x32.png',
  '/favicon_io/apple-touch-icon.png',
  '/favicon_io/android-chrome-192x192.png',
  '/favicon_io/android-chrome-512x512.png',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets')
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Failed to cache some assets:', err)
        // Continue even if some assets fail to cache
        return Promise.resolve()
      })
    })
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim()
    })
  )
})

// Listen for skip waiting message (for updates)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/') || url.hostname.includes('hamgab-backend')) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Static assets (images, fonts, etc.) - Cache first
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|eot)$/i)
  ) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // HTML pages - Network first with offline fallback
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithOfflineFallback(request))
    return
  }

  // Default: Network first
  event.respondWith(networkFirstStrategy(request))
})

// Network First Strategy - Try network, fallback to cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url)
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // If it's an API request and we have no cache, return a meaningful error
    if (request.url.includes('/api/') || request.url.includes('hamgab-backend')) {
      return new Response(
        JSON.stringify({
          error: 'You are offline. Please check your connection.',
          offline: true,
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
    
    throw error
  }
}

// Cache First Strategy - Check cache first, fallback to network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[Service Worker] Failed to fetch:', request.url)
    throw error
  }
}

// Network First with Offline Fallback - Try network, show offline page if needed
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[Service Worker] Network failed for page, showing offline fallback')
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Show offline page
    const offlinePage = await caches.match(OFFLINE_PAGE)
    if (offlinePage) {
      return offlinePage
    }
    
    // Last resort: return a basic offline message
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - HAMGAB Agent</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f5f5f5;
              color: #333;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            h1 { margin-bottom: 1rem; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }
}

// Background sync for queued actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-actions') {
    event.waitUntil(syncQueuedActions())
  }
})

async function syncQueuedActions() {
  // This would sync any queued actions when connection is restored
  // Implementation depends on your offline queue system
  console.log('[Service Worker] Syncing queued actions...')
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon_io/android-chrome-192x192.png',
        badge: '/favicon_io/favicon-32x32.png',
      })
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})

