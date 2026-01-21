/**
 * usePublicProperties Hook
 * Fetches public properties with filters and pagination using SWR
 */

"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { getPublicProperties, PublicPropertiesFilters, PublicPropertiesListResponse } from "@/lib/public-properties"

type UsePublicPropertiesArgs = PublicPropertiesFilters

export interface UsePublicPropertiesReturn {
  properties: PublicPropertiesListResponse["data"]
  meta: PublicPropertiesListResponse["meta"] | null
  isLoading: boolean
  isError: boolean
  error: Error | undefined
  refresh: () => void
}

export function usePublicProperties(filters: UsePublicPropertiesArgs): UsePublicPropertiesReturn {
  const [data, setData] = useState<PublicPropertiesListResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const lastFiltersKeyRef = useRef<string | null>(null)

  const fetchData = useCallback(async (currentFilters: UsePublicPropertiesArgs) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getPublicProperties(currentFilters)
      setData(response)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const key = JSON.stringify(filters)
    // Avoid duplicate fetches in React StrictMode by checking last filters key
    if (lastFiltersKeyRef.current === key) return
    lastFiltersKeyRef.current = key
    fetchData(filters)
  }, [filters, fetchData])

  return {
    properties: data?.data || [],
    meta: data?.meta || null,
    isLoading,
    isError: !!error,
    error: error || undefined,
    refresh: () => fetchData(filters),
  }
}
