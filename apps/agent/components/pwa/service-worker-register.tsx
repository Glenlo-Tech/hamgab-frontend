'use client'

import { useEffect, useState } from 'react'

export function ServiceWorkerRegister() {
  const [isOnline, setIsOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Register service worker
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  setUpdateAvailable(true)
                }
              })
            }
          })

          // Check if there's a waiting service worker
          if (registration.waiting) {
            setUpdateAvailable(true)
          }

          // Listen for controller change (when new SW takes control)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload()
          })
        })
        .catch((error) => {
          console.error('[SW] Service Worker registration failed:', error)
        })
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  return (
    <>
      {/* Online/Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center py-2 px-4 text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>You're offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {/* Update Available Banner */}
      {updateAvailable && isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white text-center py-2 px-4 text-sm font-medium">
          <div className="flex items-center justify-center gap-3">
            <span>New version available!</span>
            <button
              onClick={handleUpdate}
              className="underline font-semibold hover:opacity-80 transition-opacity"
            >
              Update now
            </button>
            <button
              onClick={() => setUpdateAvailable(false)}
              className="ml-2 hover:opacity-80 transition-opacity"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}

