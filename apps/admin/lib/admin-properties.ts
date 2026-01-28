import { apiClient, ApiClientError, ApiResponse } from "@/lib/api-client"

export type VerificationStatus = "RED" | "YELLOW" | "GREEN"
export type Visibility = "PUBLIC" | "PRIVATE"

export interface VerificationLocation {
  latitude: number | null
  longitude: number | null
  gps_timestamp: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
  id: string
  property_id: string
  created_at: string
  updated_at: string
}

export interface VerificationMedia {
  file_path: string
  file_type: string
  file_size: number
  mime_type: string
  id: string
  property_id: string
  uploaded_at: string
}

export interface VerificationDocument {
  file_path: string
  document_type: string
  file_name: string
  file_size: number
  mime_type: string
  id: string
  property_id: string
  uploaded_at: string
}

export interface VerificationQueueProperty {
  id: string
  title: string
  description: string | null
  property_type: string
  transaction_type: string
  price: number | null
  security_deposit: number | null
  price_period: string | null
  agent_id: string
  verification_status: VerificationStatus
  visibility: Visibility
  admin_feedback: string | null
  created_at: string
  updated_at: string
  locations: VerificationLocation[]
  media: VerificationMedia[]
  documents: VerificationDocument[]
  agent_email: string
}

export interface VerificationQueueMeta {
  count: number
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface VerificationQueueResult {
  properties: VerificationQueueProperty[]
  meta: VerificationQueueMeta
}

export interface VerificationQueueFilters {
  page?: number
  page_size?: number
  agent_id?: string | null
  date_from?: string | null
  date_to?: string | null
  city?: string | null
  country?: string | null
}

export interface AllPropertiesFilters {
  page?: number
  page_size?: number
  agent_id?: string | null
  verification_status?: VerificationStatus | null
  visibility?: Visibility | null
  date_from?: string | null
  date_to?: string | null
  city?: string | null
  country?: string | null
}

export interface AllPropertiesResult {
  properties: VerificationQueueProperty[]
  meta: VerificationQueueMeta
}

export async function fetchVerificationQueue(
  filters: VerificationQueueFilters = {}
): Promise<VerificationQueueResult> {
  const {
    page = 1,
    page_size = 20,
    agent_id,
    date_from,
    date_to,
    city,
    country,
  } = filters

  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("page_size", String(page_size))

  if (agent_id) params.set("agent_id", agent_id)
  if (date_from) params.set("date_from", date_from)
  if (date_to) params.set("date_to", date_to)
  if (city) params.set("city", city)
  if (country) params.set("country", country)

  try {
    const response: ApiResponse<VerificationQueueProperty[]> = await apiClient.get(
      `/api/v1/admin/verification-queue?${params.toString()}`
    )

    if (!response.success) {
      throw new ApiClientError(
        response.message || "Failed to fetch verification queue"
      )
    }

    return {
      properties: response.data,
      meta: (response.meta || {}) as VerificationQueueMeta,
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to fetch verification queue"
    )
  }
}

export async function updatePropertyStatus(
  propertyId: string,
  status: VerificationStatus,
  adminFeedback?: string | null
): Promise<VerificationQueueProperty> {
  try {
    const response: ApiResponse<VerificationQueueProperty> = await apiClient.patch(
      `/api/v1/admin/properties/${propertyId}/status`,
      {
        status,
        admin_feedback: adminFeedback ?? "",
      }
    )

    if (!response.success || !response.data) {
      throw new ApiClientError(response.message || "Failed to update property status")
    }

    return response.data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to update property status"
    )
  }
}

export async function updatePropertyVisibility(
  propertyId: string,
  visibility: Visibility
): Promise<VerificationQueueProperty> {
  try {
    const response: ApiResponse<VerificationQueueProperty> = await apiClient.patch(
      `/api/v1/admin/properties/${propertyId}/visibility`,
      { visibility }
    )

    if (!response.success || !response.data) {
      throw new ApiClientError(
        response.message || "Failed to update property visibility"
      )
    }

    return response.data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to update property visibility"
    )
  }
}

export async function fetchAllProperties(
  filters: AllPropertiesFilters = {}
): Promise<AllPropertiesResult> {
  const {
    page = 1,
    page_size = 20,
    agent_id,
    verification_status,
    visibility,
    date_from,
    date_to,
    city,
    country,
  } = filters

  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("page_size", String(page_size))

  if (agent_id) params.set("agent_id", agent_id)
  if (verification_status) params.set("verification_status", verification_status)
  if (visibility) params.set("visibility", visibility)
  if (date_from) params.set("date_from", date_from)
  if (date_to) params.set("date_to", date_to)
  if (city) params.set("city", city)
  if (country) params.set("country", country)

  try {
    const response: ApiResponse<VerificationQueueProperty[]> = await apiClient.get(
      `/api/v1/admin/properties?${params.toString()}`
    )

    if (!response.success) {
      throw new ApiClientError(
        response.message || "Failed to fetch properties"
      )
    }

    return {
      properties: response.data,
      meta: (response.meta || {}) as VerificationQueueMeta,
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to fetch properties"
    )
  }
}



