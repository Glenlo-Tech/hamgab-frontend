"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { loginAgent } from "@/lib/auth"
import { ApiClientError } from "@/lib/api-client"

export function AgentLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "email":
        if (!value.trim()) {
          return "Email is required"
        }
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address"
        }
        break
      case "password":
        if (!value) {
          return "Password is required"
        }
        break
    }
    return undefined
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setError(null)
    if (touched.email) {
      const error = validateField("email", value)
      setFieldErrors((prev) => ({ ...prev, email: error }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setError(null)
    if (touched.password) {
      const error = validateField("password", value)
      setFieldErrors((prev) => ({ ...prev, password: error }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = field === "email" ? email : password
    const error = validateField(field, value)
    setFieldErrors((prev) => ({ ...prev, [field]: error }))
  }

  const isFormValid = (): boolean => {
    if (!email.trim() || !password) return false
    if (fieldErrors.email || fieldErrors.password) return false
    return !validateField("email", email) && !validateField("password", password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Login agent with backend
      await loginAgent(email, password)
      
      // Navigate to dashboard on success
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : "Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-20 pb-10 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/5">
          <Building2 className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-center text-base">
          Sign in to your agent account
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-safe-bottom overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 backdrop-blur-sm">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="agent@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={() => handleBlur("email")}
                className={cn(
                  "pl-11 h-11",
                  touched.email && fieldErrors.email && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                required
                disabled={isLoading}
                autoComplete="email"
                aria-invalid={touched.email && !!fieldErrors.email}
              />
            </div>
            {touched.email && fieldErrors.email && (
              <p className="text-xs text-destructive font-medium">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => handleBlur("password")}
                className={cn(
                  "pl-11 pr-11 h-11",
                  touched.password && fieldErrors.password && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                required
                disabled={isLoading}
                autoComplete="current-password"
                aria-invalid={touched.password && !!fieldErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {touched.password && fieldErrors.password && (
              <p className="text-xs text-destructive font-medium">{fieldErrors.password}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end pt-1">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Sign up link */}
          <div className="text-center pt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

