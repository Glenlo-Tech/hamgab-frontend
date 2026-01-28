"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ApiClientError } from "@/lib/api-client"
import {
  AdminUser,
  UsersPaginationMeta,
  UsersFilters,
  fetchUsers,
} from "@/lib/admin-users"

interface UseAdminUsersOptions extends UsersFilters {}

interface UseAdminUsersResult {
  users: AdminUser[]
  meta: UsersPaginationMeta | null
  isLoading: boolean
  error: ApiClientError | null
  refresh: () => Promise<void>
}

export function useAdminUsers(
  options: UseAdminUsersOptions = {}
): UseAdminUsersResult {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [meta, setMeta] = useState<UsersPaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiClientError | null>(null)
  const lastOptionsKeyRef = useRef<string | null>(null)

  const fetchData = useCallback(
    async (currentOptions: UseAdminUsersOptions) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await fetchUsers(currentOptions)
        setUsers(result.users)
        setMeta(result.meta)
      } catch (err) {
        setError(
          err instanceof ApiClientError
            ? err
            : new ApiClientError("Failed to load users")
        )
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const key = JSON.stringify(options)
    if (lastOptionsKeyRef.current === key) return
    lastOptionsKeyRef.current = key
    void fetchData(options)
  }, [options, fetchData])

  return {
    users,
    meta,
    isLoading,
    error,
    refresh: () => fetchData(options),
  }
}

