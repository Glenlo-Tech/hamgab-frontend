/**
 * GPS Location Hook
 * Captures current GPS location and timestamp automatically
 * Runs in background - user doesn't need to know
 */

import { useState, useEffect, useCallback } from "react"

export interface GPSLocation {
  latitude: number
  longitude: number
  gpsTimestamp: string // ISO format
  accuracy?: number
  error?: string
}

export interface UseGPSLocationReturn {
  location: GPSLocation | null
  isLoading: boolean
  error: string | null
  captureLocation: () => Promise<GPSLocation | null>
}

export function useGPSLocation(): UseGPSLocationReturn {
  const [location, setLocation] = useState<GPSLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const captureLocation = useCallback(async (): Promise<GPSLocation | null> => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser"
      setError(errorMsg)
      return null
    }

    setIsLoading(true)
    setError(null)

    return new Promise((resolve) => {
      const options: PositionOptions = {
        enableHighAccuracy: true, // Use GPS if available
        timeout: 10000, // 10 seconds timeout
        maximumAge: 0, // Don't use cached position
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gpsData: GPSLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            gpsTimestamp: new Date(position.timestamp).toISOString(),
            accuracy: position.coords.accuracy,
          }

          setLocation(gpsData)
          setIsLoading(false)
          resolve(gpsData)
        },
        (err) => {
          let errorMsg = "Failed to get location"
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMsg = "Location permission denied. Please enable location access."
              break
            case err.POSITION_UNAVAILABLE:
              errorMsg = "Location information unavailable."
              break
            case err.TIMEOUT:
              errorMsg = "Location request timed out."
              break
            default:
              errorMsg = "An unknown error occurred while getting location."
              break
          }

          setError(errorMsg)
          setIsLoading(false)
          resolve(null)
        },
        options
      )
    })
  }, [])

  // Auto-capture location when hook is used (background job)
  useEffect(() => {
    // Only capture if we don't have location yet
    if (!location && !isLoading) {
      captureLocation().catch(() => {
        // Silently fail - this is a background job
      })
    }
  }, []) // Only run once on mount

  return {
    location,
    isLoading,
    error,
    captureLocation,
  }
}

