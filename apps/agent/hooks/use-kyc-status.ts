/**
 * Custom hook for KYC status management with SWR
 * Provides cached, deduplicated KYC status with automatic revalidation
 */

import useSWR from "swr"
import { getKYCStatus, isKYCApproved, KYCSubmissionResponse } from "@/lib/auth"
import { kycKeys } from "@/lib/swr-config"
import { ApiClientError } from "@/lib/api-client"

/**
 * Fetcher function for SWR
 */
async function kycStatusFetcher(): Promise<KYCSubmissionResponse | null> {
  try {
    const status = await getKYCStatus()
    return status
  } catch (error) {
    // Handle 404 gracefully (KYC not submitted yet)
    if (error instanceof ApiClientError && error.status === 404) {
      return null
    }
    // Re-throw other errors for SWR to handle
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
    }
  )

  const kycStatus = data ?? null
  const kycApproved = isKYCApproved(kycStatus)

  const refreshKYC = async (): Promise<KYCSubmissionResponse | null> => {
    const result = await mutate()
    return result ?? null
  }

  return {
    kycStatus: data ?? null,
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    kycApproved,
    mutate: refreshKYC,
    refresh: refreshKYC,
  }
}

