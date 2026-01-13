/**
 * Authentication utilities for agent portal
 * TODO: Replace with actual API calls when backend is ready
 */

export interface Agent {
  id: string
  fullName: string
  email: string
  phone: string
  avatar?: string
}

export interface AuthResponse {
  token: string
  agent: Agent
}

const AUTH_TOKEN_KEY = "auth_token"
const AGENT_DATA_KEY = "agent_data"
const ONBOARDING_COMPLETE_KEY = "onboarding_complete"

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
}

/**
 * Login agent
 * TODO: Replace with actual API endpoint
 */
export async function loginAgent(
  email: string,
  password: string
): Promise<AuthResponse> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/agent/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // })
  // 
  // if (!response.ok) {
  //   const data = await response.json()
  //   throw new Error(data.message || 'Login failed')
  // }
  // 
  // return await response.json()

  // Mock implementation - remove when backend is ready
  throw new Error("Backend API not implemented yet")
}

/**
 * Signup agent
 * TODO: Replace with actual API endpoint
 */
export async function signupAgent(data: {
  fullName: string
  email: string
  phone: string
  password: string
}): Promise<AuthResponse> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/agent/auth/signup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // })
  // 
  // if (!response.ok) {
  //   const data = await response.json()
  //   throw new Error(data.message || 'Signup failed')
  // }
  // 
  // return await response.json()

  // Mock implementation - remove when backend is ready
  throw new Error("Backend API not implemented yet")
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

