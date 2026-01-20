/**
 * Property Management API
 * Handles property submission and related operations
 */

import { apiClient, ApiClientError } from "./api-client"

/**
 * Property Type Enum (matches backend)
 */
export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  CONDO = "CONDO",
  VILLA = "VILLA",
  LAND = "LAND",
  COMMERCIAL = "COMMERCIAL",
  OTHER = "OTHER",
}

/**
 * Transaction Type Enum (matches backend)
 */
export enum TransactionType {
  SALE = "SALE",
  RENT = "RENT",
  LEASE = "LEASE",
}

/**
 * Price Period Enum (matches backend)
 */
export enum PricePeriod {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

/**
 * Property submission data interface
 */
export interface PropertySubmissionData {
  // Required fields
  title: string
  property_type: PropertyType
  transaction_type: TransactionType
  latitude: number
  longitude: number
  images: File[] // Multiple images
  documents: File[] // Multiple documents

  // Optional fields
  postal_code?: string
  gps_timestamp?: string // ISO format
  price?: number
  city?: string
  state?: string
  address?: string
  country?: string
  price_period?: PricePeriod
  description?: string
  security_deposit?: number
}

/**
 * Property location interface
 */
export interface PropertyLocation {
  latitude: number
  longitude: number
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

/**
 * Property media interface
 */
export interface PropertyMedia {
  file_path: string
  file_type: string
  file_size: number
  mime_type: string
  id: string
  property_id: string
  uploaded_at: string
}

/**
 * Property document interface
 */
export interface PropertyDocument {
  file_path: string
  document_type: string
  file_name: string
  file_size: number
  mime_type: string
  id: string
  property_id: string
  uploaded_at: string
}

/**
 * Property interface (from API)
 */
export interface Property {
  title: string
  description: string | null
  property_type: string
  transaction_type: string
  price: number | null
  security_deposit: number | null
  price_period: string | null
  id: string
  agent_id: string
  verification_status: "RED" | "YELLOW" | "GREEN"
  visibility: string
  admin_feedback: string | null
  created_at: string
  updated_at: string
  locations: PropertyLocation[]
  media: PropertyMedia[]
  documents: PropertyDocument[]
}

/**
 * Properties list response
 */
export interface PropertiesListResponse {
  success: boolean
  message: string
  data: Property[]
  meta: {
    count: number
    total: number
    page: number
    page_size: number
    total_pages: number
  }
  error: string | null
}

/**
 * Property submission response
 */
export interface PropertySubmissionResponse {
  success: boolean
  message: string
  data: {
    id: string
    title: string
    description: string | null
    property_type: string
    transaction_type: string
    price: number | null
    security_deposit: number | null
    price_period: string | null
    agent_id: string
    verification_status: string
    visibility: string
    admin_feedback: string | null
    created_at: string
    updated_at: string
    locations: Array<{
      latitude: number
      longitude: number
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
    }>
    media: Array<{
      file_path: string
      file_type: string
      file_size: number
      mime_type: string
      id: string
      property_id: string
      uploaded_at: string
    }>
    documents: Array<{
      file_path: string
      document_type: string
      file_name: string
      file_size: number
      mime_type: string
      id: string
      property_id: string
      uploaded_at: string
    }>
  }
  meta: any
  error: string | null
}

/**
 * Submit a new property
 */
export async function submitProperty(
  data: PropertySubmissionData
): Promise<PropertySubmissionResponse> {
  try {
    // Validate required fields
    if (!data.title || !data.title.trim()) {
      throw new ApiClientError("Title is required")
    }

    if (!data.property_type) {
      throw new ApiClientError("Property type is required")
    }

    if (!data.transaction_type) {
      throw new ApiClientError("Transaction type is required")
    }

    if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
      throw new ApiClientError("Valid latitude and longitude are required")
    }

    if (!data.images || data.images.length === 0) {
      throw new ApiClientError("At least one image is required")
    }

    if (!data.documents || data.documents.length === 0) {
      throw new ApiClientError("At least one document is required")
    }

    // Create FormData
    const formData = new FormData()

    // Required fields
    formData.append("title", data.title.trim())
    formData.append("property_type", data.property_type)
    formData.append("transaction_type", data.transaction_type)
    formData.append("latitude", data.latitude.toString())
    formData.append("longitude", data.longitude.toString())

    // Append images (multiple)
    data.images.forEach((image) => {
      formData.append("images", image)
    })

    // Append documents (multiple)
    data.documents.forEach((document) => {
      formData.append("documents", document)
    })

    // Optional fields
    if (data.postal_code) {
      formData.append("postal_code", data.postal_code)
    }

    if (data.gps_timestamp) {
      formData.append("gps_timestamp", data.gps_timestamp)
    }

    if (data.price !== undefined && data.price !== null) {
      formData.append("price", data.price.toString())
    }

    if (data.city) {
      formData.append("city", data.city)
    }

    if (data.state) {
      formData.append("state", data.state)
    }

    if (data.address) {
      formData.append("address", data.address)
    }

    if (data.country) {
      formData.append("country", data.country)
    }

    if (data.price_period) {
      formData.append("price_period", data.price_period)
    }

    if (data.description) {
      formData.append("description", data.description.trim())
    }

    if (data.security_deposit !== undefined && data.security_deposit !== null) {
      formData.append("security_deposit", data.security_deposit.toString())
    }

    // Make API call
    const response = await apiClient.post<PropertySubmissionResponse["data"]>(
      "/api/v1/properties",
      formData,
      true // isFormData flag
    )

    if (!response.success || !response.data) {
      throw new ApiClientError(response.message || "Property submission failed")
    }

    return {
      success: true,
      message: response.message || "Property submitted successfully",
      data: response.data,
      meta: response.meta || {},
      error: null,
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Property submission failed"
    )
  }
}

/**
 * Get properties list with pagination
 */
export async function getProperties(params?: {
  page?: number
  page_size?: number
}): Promise<PropertiesListResponse> {
  try {
    const page = params?.page || 1
    const pageSize = params?.page_size || 20

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    })

    // API returns: { success, message, data: Property[], meta: {...}, error }
    const response = await apiClient.get<Property[]>(
      `/api/v1/properties?${queryParams.toString()}`
    )

    if (!response.success) {
      throw new ApiClientError(response.message || "Failed to fetch properties")
    }

    // Extract properties array and meta from response
    const properties = Array.isArray(response.data) ? response.data : []
    
    // Meta is at the root level of the API response
    // Access it from the response object (apiClient returns ApiResponse which has optional meta)
    const responseWithMeta = response as any
    const meta = responseWithMeta.meta || {
      count: properties.length,
      total: properties.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(properties.length / pageSize),
    }

    return {
      success: true,
      message: response.message || "Properties retrieved successfully",
      data: properties,
      meta,
      error: null,
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

