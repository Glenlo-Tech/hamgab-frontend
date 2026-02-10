"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { loginClient, registerClient, type AuthUser } from "@/lib/auth"
import { ApiClientError } from "@/lib/api-client"

type AuthMode = "login" | "register"

type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  authModalOpen: boolean
  authModalMode: AuthMode
}

type AuthContextValue = AuthState & {
  openAuthModal: (mode?: AuthMode) => void
  closeAuthModal: () => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, phone: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = "hamgab_public_auth"

type StoredAuth = {
  token: string
  email: string
}

function readStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

function writeStoredAuth(value: StoredAuth | null) {
  if (typeof window === "undefined") return
  try {
    if (!value) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    }
  } catch {
    // Ignore storage errors gracefully
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<AuthMode>("login")

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = readStoredAuth()
    if (stored) {
      setToken(stored.token)
      setUser({
        email: stored.email,
      })
    }
  }, [])

  const isAuthenticated = useMemo(() => !!token, [token])

  const openAuthModal = useCallback((mode: AuthMode = "login") => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
    setError(null)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { token: accessToken } = await loginClient({ email, password })
      setToken(accessToken)
      setUser({ email })
      writeStoredAuth({ token: accessToken, email })
      setAuthModalOpen(false)
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Unable to login. Please check your details and try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, phone: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await registerClient({ email, phone, password })
      // After successful registration, switch to login tab but do not auto-login
      setAuthModalMode("login")
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Unable to register. Please check your details and try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    writeStoredAuth(null)
  }, [])

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    authModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}

