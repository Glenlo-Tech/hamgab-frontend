/**
 * Authentication utilities for agent portal
 * Integrated with HAMGAB Backend API
 */

import { apiClient, ApiClientError } from "./api-client"

export interface Agent {
  id: string
  fullName: string
  email: string
  phone: string
  role?: string
  status?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

/**
 * Map backend agent data to frontend Agent interface
 */
function mapAgentData(data: any): Agent {
  return {
    id: data.id || "",
    fullName: data.full_name || data.fullName || "",
    email: data.email || "",
    phone: data.phone || "",
    role: data.role,
    status: data.status,
    avatar: data.avatar,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export interface RegisterResponse {
  email: string
  phone: string
  role: string
  id: string
  status: string
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  token: string
  agent: Agent
}

const AUTH_TOKEN_KEY = "auth_token"
const AGENT_DATA_KEY = "agent_data"
const ONBOARDING_COMPLETE_KEY = "onboarding_complete"
const PENDING_VERIFICATION_EMAIL_KEY = "pending_verification_email"

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true"
}

/**
 * Mark onboarding as complete
 */
export function completeOnboarding(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true")
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Get agent data
 */
export function getAgentData(): Agent | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(AGENT_DATA_KEY)
  if (!data) return null
  try {
    return JSON.parse(data) as Agent
  } catch {
    return null
  }
}

/**
 * Set auth data
 */
export function setAuthData(token: string, agent: Agent): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AGENT_DATA_KEY, JSON.stringify(agent))
}

/**
 * Clear auth data
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AGENT_DATA_KEY)
  localStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY)
}

/**
 * Store pending verification email
 */
export function setPendingVerificationEmail(email: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email)
}

/**
 * Get pending verification email
 */
export function getPendingVerificationEmail(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)
}

/**
 * Register agent
 */
export async function registerAgent(data: {
  full_name: string
  email: string
  phone: string
  password: string
}): Promise<RegisterResponse> {
  try {
    const response = await apiClient.post<RegisterResponse>(
      "/api/v1/auth/agent/register",
      data
    )

    if (!response.success || !response.data) {
      throw new ApiClientError(response.message || "Registration failed")
    }

    // Store email for OTP verification
    setPendingVerificationEmail(data.email)

    return response.data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Registration failed"
    )
  }
}

/**
 * Verify OTP
 * Note: Response structure may vary - adjust based on actual API response
 */
export async function verifyOTP(email: string, otpCode: string): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/auth/verify-otp",
      {
        email,
        otp_code: otpCode,
      }
    )

    if (!response.success || !response.data) {
      throw new ApiClientError(response.message || "OTP verification failed")
    }

    // Handle different possible response structures
    const data = response.data
    let token: string
    let agent: Agent

    // If token and agent are directly in data
    if (data.token && data.agent) {
      token = data.token
      agent = data.agent
    }
    // If token is separate and agent data is in data
    else if (data.token) {
      token = data.token
      agent = mapAgentData(data)
    }
    // If response structure is different
    else {
      throw new ApiClientError("Invalid OTP verification response format")
    }

    // Store auth data
    setAuthData(token, agent)

    // Clear pending verification email
    if (typeof window !== "undefined") {
      localStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY)
    }

    return { token, agent }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "OTP verification failed"
    )
  }
}

/**
 * Resend OTP
 */
export async function resendOTP(email: string): Promise<void> {
  try {
    const response = await apiClient.post("/api/v1/auth/resend-otp", { email })

    if (!response.success) {
      throw new ApiClientError(response.message || "Failed to resend OTP")
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to resend OTP"
    )
  }
}

/**
 * Login agent
 * Note: Response structure may vary - adjust based on actual API response
 */
export async function loginAgent(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/auth/agent/login",
      {
        email,
        password,
      }
    )

    if (!response.success || !response.data) {
      throw new ApiClientError(response.message || "Login failed")
    }

    // Handle different possible response structures
    const data = response.data
    let token: string
    let agent: Agent

    // If token and agent are directly in data
    if (data.token && data.agent) {
      token = data.token
      agent = data.agent
    }
    // If token is separate and agent data is in data
    else if (data.token) {
      token = data.token
      agent = mapAgentData(data)
    }
    // If response structure is different
    else {
      throw new ApiClientError("Invalid login response format")
    }

    // Store auth data
    setAuthData(token, agent)

    return { token, agent }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(error instanceof Error ? error.message : "Login failed")
  }
}

/**
 * Request password reset
 * TODO: Replace with actual API endpoint when backend is ready
 */
export async function requestPasswordReset(email: string): Promise<void> {
  try {
    // TODO: Replace with actual API call
    // const response = await apiClient.post("/api/v1/auth/forgot-password", { email })
    // 
    // if (!response.success) {
    //   throw new ApiClientError(response.message || "Failed to send reset link")
    // }

    // Mock implementation - remove when backend is ready
    throw new Error("Coming Soon!")
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to send reset link"
    )
  }
}

/**
 * Reset password with token
 * TODO: Replace with actual API endpoint when backend is ready
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    // TODO: Replace with actual API call
    // const response = await apiClient.post("/api/v1/auth/reset-password", {
    //   token,
    //   password: newPassword,
    // })
    // 
    // if (!response.success) {
    //   throw new ApiClientError(response.message || "Failed to reset password")
    // }

    // Mock implementation - remove when backend is ready
    throw new Error("Coming Soon!")
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    throw new ApiClientError(
      error instanceof Error ? error.message : "Failed to reset password"
    )
  }
}

/**
 * Logout agent
 */
export function logoutAgent(): void {
  clearAuthData()
  if (typeof window !== "undefined") {
    window.location.href = "/"
  }
}
