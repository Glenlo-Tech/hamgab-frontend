import { apiClient, ApiClientError, ApiResponse } from "@/lib/api-client"

export interface AdminDashboardStats {
  total_properties: number
  total_properties_trend: number
  active_users: number
  active_users_trend: number
  monthly_revenue: number
  monthly_revenue_trend: number
  pending_approvals: number
  pending_approvals_trend: number
}

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    const response: ApiResponse<AdminDashboardStats> = await apiClient.get(
      "/api/v1/admin/dashboard/stats"
    )

    if (!response.success || !response.data) {
      throw new ApiClientError(
        response.message || "Failed to fetch admin dashboard statistics"
      )
    }

    return response.data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    throw new ApiClientError(
      error instanceof Error
        ? error.message
        : "Failed to fetch admin dashboard statistics"
    )
  }
}

