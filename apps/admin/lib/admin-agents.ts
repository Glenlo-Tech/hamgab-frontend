import { apiClient, ApiClientError, ApiResponse } from "@/lib/api-client"

export type AgentStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "REJECTED"

export interface AdminAgent {
  id: string
  email: string
  phone: string
  role: "AGENT"
  status: AgentStatus
  created_at: string
  updated_at: string
}

export interface KycSubmission {
  id: string
  user_id: string
  full_name: string | null
  id_front_path: string | null
  id_back_path: string | null
  selfie_path: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  reviewed_by: string | null
  review_notes: string | null
  submitted_at: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface PendingAgent {
  id: string
  email: string
  phone: string
  status: AgentStatus
  created_at: string
  kyc_submission: KycSubmission | null
}

export interface PaginationMeta {
  count: number
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PaginatedAgents {
  agents: AdminAgent[]
  meta: PaginationMeta
}

export interface PaginatedPendingAgents {
  pendingAgents: PendingAgent[]
  meta: PaginationMeta
}

export async function fetchAgents(
  page = 1,
  pageSize = 20
): Promise<PaginatedAgents> {
  try {
    const response = await apiClient.get<AdminAgent[]>(
      `/api/v1/admin/agents?page=${page}&page_size=${pageSize}`
    )

    if (!response.success) {
      throw new ApiClientError(response.message || "Failed to fetch agents")
    }

    return {
      agents: response.data,
      meta: (response.meta || {}) as PaginationMeta,
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to fetch agents"
    )
  }
}

export async function fetchPendingAgents(
  page = 1,
  pageSize = 20
): Promise<PaginatedPendingAgents> {
  try {
    const response: ApiResponse<PendingAgent[]> = await apiClient.get(
      `/api/v1/admin/pending-agents?page=${page}&page_size=${pageSize}`
    )

    if (!response.success) {
      throw new ApiClientError(response.message || "Failed to fetch pending agents")
    }

    return {
      pendingAgents: response.data,
      meta: (response.meta || {}) as PaginationMeta,
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to fetch pending agents"
    )
  }
}

export async function approveAgent(agentId: string, notes: string): Promise<AdminAgent> {
  try {
    const response = await apiClient.post<AdminAgent>("/api/v1/admin/approve-agent", {
      agent_id: agentId,
      notes,
    })

    if (!response.success || !response.data) {
      throw new ApiClientError(response.message || "Failed to approve agent")
    }

    return response.data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to approve agent"
    )
  }
}

export async function rejectAgent(agentId: string, notes: string): Promise<void> {
  try {
    const response = await apiClient.post("/api/v1/admin/reject-agent", {
      agent_id: agentId,
      notes,
    })

    if (!response.success) {
      throw new ApiClientError(response.message || "Failed to reject agent")
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to reject agent"
    )
  }
}

export async function deleteAgent(agentId: string): Promise<void> {
  try {
    const response = await apiClient.delete(`/api/v1/admin/agents/${agentId}`)

    if (!response.success) {
      throw new ApiClientError(response.message || "Failed to delete agent")
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to delete agent"
    )
  }
}


