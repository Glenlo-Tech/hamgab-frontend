"use client"

import { WifiOff, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-white p-6 rounded-full shadow-lg">
              <WifiOff className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">You're Offline</h1>
          <p className="text-gray-600 text-lg">
            It looks like you've lost your internet connection. Don't worry, you can still view
            cached content.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            onClick={() => window.location.reload()}
            variant="default"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard">
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Helpful Info */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            While offline, you can still:
          </p>
          <ul className="mt-3 text-sm text-gray-600 space-y-1">
            <li>✓ View previously loaded pages</li>
            <li>✓ Browse cached listings</li>
            <li>✓ Access your profile</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

