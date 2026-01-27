/**
 * API Client for HAMGAB Admin Backend
 * Centralized API communication with error handling and response parsing
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL

// Use a distinct key so admin auth does not conflict with agent/public
const ADMIN_AUTH_TOKEN_KEY = "admin_auth_token"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: any
  error: string | null
}

export interface ApiError {
  message: string
  status?: number
  data?: any
}

/**
 * Custom API error class
 */
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

/**
 * Make API request with error handling
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
  }

  // Only set Content-Type if not FormData (browser will set it automatically for FormData)
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json"
  }

  // Add admin auth token if available
  const token =
    typeof window !== "undefined" ? localStorage.getItem(ADMIN_AUTH_TOKEN_KEY) : null
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
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

    // Parse response
    let data: ApiResponse<T>
    try {
      data = await response.json()
    } catch {
      throw new ApiClientError(
        "Invalid response format",
        response.status,
        await response.text()
      )
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorMessage =
        (data && (data.message || data.error)) ||
        `Request failed with status ${response.status}`
      throw new ApiClientError(errorMessage, response.status, data)
    }

    // Check if response indicates failure
    if (data.success === false) {
      throw new ApiClientError(data.message || "Request failed", response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    // Network or other errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiClientError(
        "Network error. Please check your internet connection.",
        0
      )
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      0
    )
  }
}

/**
 * API Client methods
 */
export const apiClient = {
  /**
   * POST request
   */
  post: <T = any>(endpoint: string, body?: any, isFormData?: boolean): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {}

    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!isFormData && body) {
      headers["Content-Type"] = "application/json"
    }

    return apiRequest<T>(endpoint, {
      method: "POST",
      // Stringify body if it's not FormData
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      headers,
    })
  },

  /**
   * GET request
   */
  get: <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: "GET",
    })
  },

  /**
   * PUT request
   */
  put: <T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  /**
   * PATCH request
   */
  patch: <T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  /**
   * DELETE request
   */
  delete: <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: "DELETE",
    })
  },
}

export { ADMIN_AUTH_TOKEN_KEY }


