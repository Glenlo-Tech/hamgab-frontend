/**
 * useProperty Hook
 * Fetches a single property by ID using SWR
 */

import useSWR from "swr"
import { getPropertyById, Property } from "@/lib/properties"

export interface UsePropertyReturn {
  property: Property | null
  isLoading: boolean
  isError: boolean
  error: Error | undefined
  refresh: () => Promise<Property | null>
}

async function propertyFetcher([_key, id]: [string, string]): Promise<Property> {
  const response = await getPropertyById(id)
  return response.data
}

export function useProperty(id?: string | null): UsePropertyReturn {
  const shouldFetch = !!id

  const { data, error, isLoading, mutate } = useSWR<Property>(
    shouldFetch ? ["property", id as string] : null,
    propertyFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  const refresh = async (): Promise<Property | null> => {
    const result = await mutate()
    return result ?? null
  }

  return {
    property: data ?? null,
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    refresh,
  }
}


