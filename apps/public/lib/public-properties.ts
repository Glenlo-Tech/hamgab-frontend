/**
 * Public Properties API
 * Fetches publicly visible properties for the marketing/listings site
 */

import { apiClient, ApiClientError, ApiResponse } from "@/lib/api-client"

export interface PublicPropertyLocation {
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

export interface PublicPropertyMedia {
  file_path: string
  file_type: string
  file_size: number
  mime_type: string
  id: string
  property_id: string
  uploaded_at: string
}

export interface PublicProperty {
  title: string
  description: string | null
  property_type: string
  transaction_type: string
  price: number | null
  security_deposit: number | null
  price_period: string | null
  id: string
  verification_status: "RED" | "YELLOW" | "GREEN"
  created_at: string
  locations: PublicPropertyLocation[]
  media: PublicPropertyMedia[]
}

export interface PublicPropertiesListResponse {
  success: boolean
  message: string
  data: PublicProperty[]
  meta: {
    count: number
    total: number
    page: number
    page_size: number
    total_pages: number
  }
  error: string | null
}

export interface PublicPropertiesFilters {
  page?: number
  page_size?: number
  property_type?: string | null
  min_price?: number | null
  max_price?: number | null
  city?: string | null
  country?: string | null
  latitude?: number | null
  longitude?: number | null
  radius_km?: number | null
}

export async function getPublicProperties(
  filters: PublicPropertiesFilters
): Promise<PublicPropertiesListResponse> {
  try {
    const {
      page = 1,
      page_size = 20,
      property_type,
      min_price,
      max_price,
      city,
      country,
      latitude,
      longitude,
      radius_km,
    } = filters

    const params = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    })

    if (property_type) params.set("property_type", property_type)
    if (min_price != null) params.set("min_price", String(min_price))
    if (max_price != null) params.set("max_price", String(max_price))
    if (city) params.set("city", city)
    if (country) params.set("country", country)
    if (latitude != null) params.set("latitude", String(latitude))
    if (longitude != null) params.set("longitude", String(longitude))
    if (radius_km != null) params.set("radius_km", String(radius_km))

    const response: ApiResponse<PublicProperty[]> = await apiClient.get<PublicProperty[]>(
      `/api/v1/public/properties?${params.toString()}`
    )

    if (!response.success) {
      throw new ApiClientError(response.message || "Failed to fetch public properties")
    }

    const properties = Array.isArray(response.data) ? response.data : []
    const responseWithMeta = response as any
    const meta = responseWithMeta.meta || {
      count: properties.length,
      total: properties.length,
      page,
      page_size,
      total_pages: Math.ceil(properties.length / page_size),
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
      error instanceof Error ? error.message : "Failed to fetch public properties"
    )
  }
}


