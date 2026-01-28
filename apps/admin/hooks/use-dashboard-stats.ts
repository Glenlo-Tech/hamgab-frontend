"use client"

import { useCallback, useEffect, useState } from "react"
import { ApiClientError } from "@/lib/api-client"
import {
  AdminDashboardStats,
  fetchAdminDashboardStats,
} from "@/lib/admin-dashboard"

interface UseDashboardStatsResult {
  stats: AdminDashboardStats | null
  isLoading: boolean
  error: ApiClientError | null
  refresh: () => Promise<void>
}

export function useDashboardStats(): UseDashboardStatsResult {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<ApiClientError | null>(null)

  const loadStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchAdminDashboardStats()
      setStats(data)
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err
          : new ApiClientError("Failed to load dashboard statistics")
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  return {
    stats,
    isLoading,
    error,
    refresh: loadStats,
  }
}

