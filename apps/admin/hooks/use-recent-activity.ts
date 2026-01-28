"use client"

import { useEffect, useState } from "react"
import { fetchRecentActivity, type ActivityItem } from "@/lib/admin-dashboard"
import { ApiClientError } from "@/lib/api-client"

interface UseRecentActivityResult {
  activities: ActivityItem[]
  isLoading: boolean
  error: ApiClientError | null
  refresh: () => Promise<void>
}

export function useRecentActivity(limit: number = 5): UseRecentActivityResult {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<ApiClientError | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchRecentActivity(limit)
      setActivities(data)
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err
          : new ApiClientError("Failed to load recent activity")
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [limit])

  return {
    activities,
    isLoading,
    error,
    refresh: fetchData,
  }
}
