import { apiClient, ApiClientError, ApiResponse } from "@/lib/api-client"
import { fetchAllProperties } from "./admin-properties"
import { fetchUsers } from "./admin-users"

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

export interface ActivityItem {
  id: string
  type: "approval" | "rejection" | "user" | "submission"
  message: string
  time: string
  user: string
  created_at: string
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

export async function fetchRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
  try {
    // Fetch recent properties and users to build activity feed
    const [propertiesResult, usersResult] = await Promise.allSettled([
      fetchAllProperties({ page: 1, page_size: 20 }),
      fetchUsers({ page: 1, page_size: 20 }),
    ])

    const activities: ActivityItem[] = []

    // Process properties as submissions
    if (propertiesResult.status === "fulfilled") {
      const properties = propertiesResult.value.properties

      properties.slice(0, Math.ceil(limit / 2)).forEach((property) => {
        const location = property.locations?.[0]
        const locationStr = location
          ? [location.city, location.country].filter(Boolean).join(", ") || "Unknown location"
          : "Unknown location"

        // Add submission activity
        activities.push({
          id: `property-submission-${property.id}`,
          type: "submission",
          message: `New property submitted: ${property.title}${locationStr !== "Unknown location" ? ` in ${locationStr}` : ""}`,
          time: formatTimeAgo(property.created_at),
          user: property.agent_email || "Unknown agent",
          created_at: property.created_at,
        })

        // Add status change activity if updated recently and status is GREEN or RED
        if (property.updated_at !== property.created_at) {
          const statusType =
            property.verification_status === "GREEN"
              ? "approval"
              : property.verification_status === "RED"
                ? "rejection"
                : null

          if (statusType) {
            activities.push({
              id: `property-${statusType}-${property.id}`,
              type: statusType,
              message: `Property "${property.title}" ${statusType === "approval" ? "approved" : "rejected"}`,
              time: formatTimeAgo(property.updated_at),
              user: "Admin",
              created_at: property.updated_at,
            })
          }
        }
      })
    }

    // Process new users/agents
    if (usersResult.status === "fulfilled") {
      const users = usersResult.value.users

      users
        .filter((user) => user.role === "AGENT" && user.status === "PENDING")
        .slice(0, Math.ceil(limit / 2))
        .forEach((user) => {
          activities.push({
            id: `user-registration-${user.id}`,
            type: "user",
            message: `New agent registered: ${user.email}`,
            time: formatTimeAgo(user.created_at),
            user: "System",
            created_at: user.created_at,
          })
        })
    }

    // Sort by created_at (most recent first) and limit
    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  } catch (error) {
    // Return empty array on error to not break the UI
    console.error("Failed to fetch recent activity:", error)
    return []
  }
}

function formatTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  }
  const days = Math.floor(diffInSeconds / 86400)
  return `${days} ${days === 1 ? "day" : "days"} ago`
}
