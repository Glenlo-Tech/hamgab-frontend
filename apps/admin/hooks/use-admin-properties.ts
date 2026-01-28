"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ApiClientError } from "@/lib/api-client"
import {
  VerificationQueueProperty,
  VerificationQueueMeta,
  AllPropertiesFilters,
  fetchAllProperties,
} from "@/lib/admin-properties"

interface UseAdminPropertiesResult {
  properties: VerificationQueueProperty[]
  meta: VerificationQueueMeta | null
  isLoading: boolean
  error: ApiClientError | null
  refresh: () => Promise<void>
}

export function useAdminProperties(
  filters: AllPropertiesFilters = {}
): UseAdminPropertiesResult {
  const [properties, setProperties] = useState<VerificationQueueProperty[]>([])
  const [meta, setMeta] = useState<VerificationQueueMeta | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiClientError | null>(null)
  const lastFiltersKeyRef = useRef<string | null>(null)

  const fetchData = useCallback(
    async (currentFilters: AllPropertiesFilters) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await fetchAllProperties(currentFilters)
        setProperties(result.properties)
        setMeta(result.meta)
      } catch (err) {
        setError(
          err instanceof ApiClientError
            ? err
            : new ApiClientError("Failed to load properties")
        )
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const key = JSON.stringify(filters)
    if (lastFiltersKeyRef.current === key) return
    lastFiltersKeyRef.current = key
    void fetchData(filters)
  }, [filters, fetchData])

  return {
    properties,
    meta,
    isLoading,
    error,
    refresh: () => fetchData(filters),
  }
}
