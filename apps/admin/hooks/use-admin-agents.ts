"use client"

import { useCallback, useEffect, useState } from "react"
import {
  AdminAgent,
  PendingAgent,
  fetchAgents,
  fetchPendingAgents,
  PaginationMeta,
} from "@/lib/admin-agents"
import { ApiClientError } from "@/lib/api-client"

interface UseAdminAgentsOptions {
  page?: number
  pageSize?: number
}

interface UseAdminAgentsResult {
  agents: AdminAgent[]
  meta: PaginationMeta | null
  isLoading: boolean
  error: ApiClientError | null
  refresh: () => Promise<void>
}

export function useAdminAgents(
  options: UseAdminAgentsOptions = {}
): UseAdminAgentsResult {
  const { page = 1, pageSize = 20 } = options

  const [agents, setAgents] = useState<AdminAgent[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiClientError | null>(null)

  const loadAgents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchAgents(page, pageSize)
      setAgents(result.agents)
      setMeta(result.meta)
    } catch (err) {
      setError(err instanceof ApiClientError ? err : new ApiClientError("Failed to load agents"))
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    void loadAgents()
  }, [loadAgents])

  return {
    agents,
    meta,
    isLoading,
    error,
    refresh: loadAgents,
  }
}

interface UsePendingAgentsResult {
  pendingAgents: PendingAgent[]
  meta: PaginationMeta | null
  isLoading: boolean
  error: ApiClientError | null
  refresh: () => Promise<void>
}

export function usePendingAgents(
  options: UseAdminAgentsOptions = {}
): UsePendingAgentsResult {
  const { page = 1, pageSize = 20 } = options

  const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiClientError | null>(null)

  const loadPending = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchPendingAgents(page, pageSize)
      setPendingAgents(result.pendingAgents)
      setMeta(result.meta)
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err
          : new ApiClientError("Failed to load pending agents")
      )
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    void loadPending()
  }, [loadPending])

  return {
    pendingAgents,
    meta,
    isLoading,
    error,
    refresh: loadPending,
  }
}


