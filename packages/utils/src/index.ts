// Re-export all utilities from their respective modules
export { cn } from './cn'
export { fetchWithRetry, swrFetcher } from './fetch-utils'

// Auth utilities
export const authConfig = {
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || 'auth.domain.com',
  apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || 'api.domain.com',
  cookieDomain: '.domain.com',
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token') || 
         document.cookie
           .split(';')
           .find(c => c.trim().startsWith('auth_token='))
           ?.split('=')[1] || null
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
  document.cookie = `auth_token=${token}; domain=${authConfig.cookieDomain}; path=/; secure; samesite=strict`
}

