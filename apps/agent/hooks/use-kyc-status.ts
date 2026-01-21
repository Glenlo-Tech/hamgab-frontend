/**
 * Custom hook for KYC status management with SWR
 * Provides cached, deduplicated KYC status with automatic revalidation
 */

import useSWR from "swr"
import { getKYCStatus, isKYCApproved, KYCSubmissionResponse } from "@/lib/auth"
import { kycKeys } from "@/lib/swr-config"
import { ApiClientError } from "@/lib/api-client"

// Track 401 errors - shared across all hook instances since they use the same SWR key
let last401Error: boolean = false

/**
 * Fetcher function for SWR
 */
async function kycStatusFetcher(): Promise<KYCSubmissionResponse | null> {
  try {
    last401Error = false // Reset on successful request
    const status = await getKYCStatus()
    return status
  } catch (error) {
    // Handle 404 gracefully (KYC not submitted yet)
    if (error instanceof ApiClientError && error.status === 404) {
      last401Error = false
      return null
    }
    // Handle 401 gracefully (auth issue - might be transient or endpoint-specific)
    // Since other endpoints work, we'll treat this as "status unavailable" rather than blocking the UI
    if (error instanceof ApiClientError && error.status === 401) {
      console.warn("KYC status endpoint returned 401 - treating as unavailable")
      last401Error = true
      return null
    }
    // Re-throw other errors for SWR to handle
    last401Error = false
    throw error
  }
}

/**
 * Hook return type
 */
export interface UseKYCStatusReturn {
  kycStatus: KYCSubmissionResponse | null
  isLoading: boolean
  isError: boolean
  error: Error | undefined
  kycApproved: boolean
  isKYCUnavailable: boolean // True if KYC status is unavailable (e.g., due to auth issues)
  mutate: () => Promise<KYCSubmissionResponse | null>
  refresh: () => Promise<KYCSubmissionResponse | null>
}

/**
 * Custom hook for KYC status
 * 
 * Features:
 * - Automatic caching and request deduplication
 * - Revalidates on window focus
 * - Polling support for real-time updates
 * - Optimistic updates support
 * 
 * @param options - SWR options (polling interval, etc.)
 * @returns KYC status data and utilities
 */
export function useKYCStatus(options?: {
  refreshInterval?: number
  revalidateOnFocus?: boolean
}): UseKYCStatusReturn {
  const { data, error, isLoading, mutate } = useSWR<KYCSubmissionResponse | null>(
    kycKeys.status(),
    kycStatusFetcher,
    {
      // Poll every 30 seconds if status is PENDING (for real-time updates)
      refreshInterval: (data) => {
        if (options?.refreshInterval !== undefined) {
          return options.refreshInterval
        }
        // Auto-poll if status is PENDING
        return data?.status === "PENDING" ? 30000 : 0
      },
      revalidateOnFocus: options?.revalidateOnFocus ?? true,
      // Don't show loading state if we have cached data
      fallbackData: null,
      // Don't retry on 401 errors (auth issues)
      shouldRetryOnError: (error) => {
        if (error instanceof ApiClientError && error.status === 401) {
          return false
        }
        return true
      },
      // Reduce retry attempts
      errorRetryCount: 2,
    }
  )

  const kycStatus = data ?? null
  const kycApproved = isKYCApproved(kycStatus)
  
  // Check if KYC status is unavailable due to auth issues (401)
  // Since we return null for 401 (no error thrown), we check the module-level flag
  // We only consider it unavailable if we have no data, no error, and the flag is set
  const isKYCUnavailable = last401Error && !isLoading && data === null && !error

  const refreshKYC = async (): Promise<KYCSubmissionResponse | null> => {
    const result = await mutate()
    return result ?? null
  }

  return {
    kycStatus: data ?? null,
    isLoading,
    isError: !!error && !isKYCUnavailable, // Don't treat 401 as error for UI purposes
    error: error as Error | undefined,
    kycApproved,
    isKYCUnavailable,
    mutate: refreshKYC,
    refresh: refreshKYC,
  }
}

