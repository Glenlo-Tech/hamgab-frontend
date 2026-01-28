import { apiClient, ApiClientError, ApiResponse } from "@/lib/api-client"

export type UserRole = "ADMIN" | "AGENT" | "CLIENT"
export type UserStatus = "PENDING" | "ACTIVE" | "REJECTED" | "INACTIVE"

export interface AdminUser {
  id: string
  email: string
  phone: string | null
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface UsersPaginationMeta {
  count: number
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PaginatedUsers {
  users: AdminUser[]
  meta: UsersPaginationMeta
}

export interface UsersFilters {
  page?: number
  page_size?: number
  role?: UserRole | null
  status?: UserStatus | null
}

export async function fetchUsers(filters: UsersFilters = {}): Promise<PaginatedUsers> {
  const {
    page = 1,
    page_size = 20,
    role,
    status,
  } = filters

  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("page_size", String(page_size))

  if (role) params.set("role", role)
  if (status) params.set("status", status)

  try {
    const response: ApiResponse<AdminUser[]> = await apiClient.get(
      `/api/v1/admin/users?${params.toString()}`
    )

    if (!response.success) {
      throw new ApiClientError(response.message || "Failed to fetch users")
    }

    return {
      users: response.data,
      meta: (response.meta || {}) as UsersPaginationMeta,
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to fetch users"
    )
  }
}

