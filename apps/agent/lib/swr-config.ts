/**
 * SWR Configuration
 * Centralized configuration for SWR data fetching
 */

import { SWRConfiguration } from "swr"

/**
 * Default SWR configuration
 * - Deduplicates requests within 2 seconds
 * - Revalidates on window focus (for real-time updates)
 * - Revalidates on reconnect
 * - 5 minute cache by default
 */
export const swrConfig: SWRConfiguration = {
  // Request deduplication interval (2 seconds)
  dedupingInterval: 2000,
  
  // Revalidate on window focus (good for KYC status updates)
  revalidateOnFocus: true,
  
  // Revalidate when network reconnects
  revalidateOnReconnect: true,
  
  // Don't revalidate on mount if data exists (use stale-while-revalidate)
  revalidateOnMount: true,
  
  // Keep previous data while revalidating
  keepPreviousData: true,
  
  // Error retry configuration
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Focus throttle interval (prevent too many requests)
  focusThrottleInterval: 5000,
  
  // Loading timeout
  loadingTimeout: 3000,
  
  // Should retry on error
  shouldRetryOnError: (error) => {
    // Don't retry on 404 (KYC not submitted yet)
    if (error?.status === 404) {
      return false
    }
    // Retry on network errors and 5xx errors
    return error?.status >= 500 || !error?.status
  },
}

/**
 * SWR key factory for KYC status
 */
export const kycKeys = {
  all: ["kyc"] as const,
  status: () => [...kycKeys.all, "status"] as const,
}

