"use client"

import { apiClient, ApiClientError, ADMIN_AUTH_TOKEN_KEY } from "@/lib/api-client"

export interface AdminLoginResult {
  accessToken: string
  tokenType: string
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token)
}

export function clearAdminToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY)
}

/**
 * Login admin with email and password.
 * Wraps the `/api/v1/admin/login` endpoint.
 */
export async function loginAdmin(email: string, password: string): Promise<AdminLoginResult> {
  try {
    const response = await apiClient.post<{
      access_token: string
      token_type: string
    }>("/api/v1/admin/login", {
      email,
      password,
    })

    if (!response.success || !response.data) {
      throw new ApiClientError(response.message || "Login failed")
    }

    const { access_token, token_type } = response.data

    if (!access_token) {
      throw new ApiClientError("No access token received from server")
    }

    // Persist token for subsequent admin API calls
    setAdminToken(access_token)

    return {
      accessToken: access_token,
      tokenType: token_type || "bearer",
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : "Login failed. Please try again."
    )
  }
}


