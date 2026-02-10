"use client"

import { apiClient, ApiResponse, ApiClientError } from "@/lib/api-client"

const CLIENT_REGISTER_ENDPOINT = "/api/v1/auth/client/register"
const CLIENT_LOGIN_ENDPOINT = "/api/v1/auth/client/login"

export interface AuthRegisterPayload {
  email: string
  phone: string
  password: string
}

export interface AuthLoginPayload {
  email: string
  password: string
}

export interface AuthUser {
  id?: string
  email: string
  full_name?: string | null
}

interface RegisterResponseData {
  email: string
  phone: string
  role: string
  id: string
  status: string
  full_name: string | null
  created_at: string
  updated_at: string
}

interface LoginResponseData {
  access_token: string
  token_type: string
}

export async function registerClient(payload: AuthRegisterPayload): Promise<AuthUser> {
  try {
    const response: ApiResponse<RegisterResponseData> = await apiClient.post<RegisterResponseData>(
      CLIENT_REGISTER_ENDPOINT,
      payload
    )

    const data = response.data

    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to register. Please try again."
    )
  }
}

export async function loginClient(
  payload: AuthLoginPayload
): Promise<{ token: string; tokenType: string }> {
  try {
    const response: ApiResponse<LoginResponseData> = await apiClient.post<LoginResponseData>(
      CLIENT_LOGIN_ENDPOINT,
      payload
    )

    const data = response.data

    if (!data?.access_token) {
      throw new ApiClientError("Invalid login response. Missing access token.")
    }

    return {
      token: data.access_token,
      tokenType: data.token_type,
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to login. Please try again."
    )
  }
}

