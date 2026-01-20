/**
 * Properties Hook
 * SWR hook for fetching properties with pagination and caching
 */

import useSWR from "swr"
import { getProperties, PropertiesListResponse } from "@/lib/properties"
import { kycKeys } from "@/lib/swr-config"

/**
 * Properties fetcher function for SWR
 */
async function propertiesFetcher([key, page, pageSize]: [
  string,
  number,
  number
]): Promise<PropertiesListResponse> {
  return getProperties({ page, page_size: pageSize })
}

import { Property } from "@/lib/properties"

/**
 * Hook return type
 */
export interface UsePropertiesReturn {
  properties: Property[]
  isLoading: boolean
  isError: boolean
  error: Error | undefined
  meta: PropertiesListResponse["meta"] | null
  mutate: () => Promise<PropertiesListResponse | undefined>
  refresh: () => Promise<PropertiesListResponse | undefined>
}

/**
 * Custom hook for fetching properties
 * 
 * @param page - Page number (default: 1)
 * @param pageSize - Items per page (default: 20)
 * @returns Properties data and utilities
 */
export function useProperties(
  page: number = 1,
  pageSize: number = 20
): UsePropertiesReturn {
  const { data, error, isLoading, mutate } = useSWR<PropertiesListResponse>(
    ["properties", page, pageSize],
    propertiesFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: true,
      fallbackData: {
        success: true,
        message: "",
        data: [],
        meta: {
          count: 0,
          total: 0,
          page: 1,
          page_size: 20,
          total_pages: 0,
        },
        error: null,
      },
    }
  )

  const refreshProperties = async (): Promise<PropertiesListResponse | undefined> => {
    const result = await mutate()
    return result
  }

  return {
    properties: data?.data || [],
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    meta: data?.meta || null,
    mutate: refreshProperties,
    refresh: refreshProperties,
  }
}

