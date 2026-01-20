'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function ServiceWorkerRegister() {
  const [isOnline, setIsOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [offlineBannerDismissed, setOfflineBannerDismissed] = useState(false)

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
    const handleOnline = () => {
      setIsOnline(true)
      // Reset dismissed state when coming back online
      setOfflineBannerDismissed(false)
    }
    const handleOffline = () => {
      setIsOnline(false)
      // Reset dismissed state when going offline (show banner again)
      setOfflineBannerDismissed(false)
    }

    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Add/remove body class when banner is visible to adjust header position
  useEffect(() => {
    const bannerVisible = !isOnline && !offlineBannerDismissed
    if (bannerVisible) {
      document.body.classList.add('has-offline-banner')
    } else {
      document.body.classList.remove('has-offline-banner')
    }
    return () => {
      document.body.classList.remove('has-offline-banner')
    }
  }, [isOnline, offlineBannerDismissed])

  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  return (
    <>
      {/* Online/Offline Indicator */}
      {!isOnline && !offlineBannerDismissed && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 dark:bg-yellow-600 text-white py-2.5 px-4 text-sm font-medium shadow-md animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 relative pr-8 sm:pr-10">
            <svg
              className="w-4 h-4 flex-shrink-0"
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
            <span className="text-center">You're offline. Some features may be limited.</span>
            <button
              onClick={() => setOfflineBannerDismissed(true)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors flex-shrink-0"
              aria-label="Dismiss offline notification"
            >
              <X className="h-4 w-4" />
            </button>
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

