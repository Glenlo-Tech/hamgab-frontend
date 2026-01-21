/**
 * API Client for HAMGAB Public Frontend
 * Lightweight wrapper around fetch with shared error handling
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: any
  error: string | null
}

export class ApiClientError extends Error {
  status?: number
  data?: any

  constructor(message: string, status?: number, data?: any) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.data = data
  }
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    let data: ApiResponse<T>
    try {
      data = await response.json()
    } catch {
      throw new ApiClientError("Invalid response format", response.status, await response.text())
    }

    if (!response.ok) {
      const errorMessage =
        data?.message || data?.error || `Request failed with status ${response.status}`
      throw new ApiClientError(errorMessage, response.status, data)
    }

    if (data.success === false) {
      throw new ApiClientError(data.message || "Request failed", response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiClientError("Network error. Please check your internet connection.", 0)
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      0
    )
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, { method: "GET" })
  },
}


