"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { resetPassword } from "@/lib/auth"
import { ApiClientError } from "@/lib/api-client"

interface FieldErrors {
  password?: string
  confirmPassword?: string
}

export function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Get token from URL (will be provided by backend)
  const token = searchParams.get("token")

  useEffect(() => {
    // If no token, redirect to forgot password
    if (!token) {
      router.push("/auth/forgot-password")
    }
  }, [token, router])

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "password":
        if (!value) {
          return "Password is required"
        }
        if (value.length < 8) {
          return "Password must be at least 8 characters"
        }
        break
      case "confirmPassword":
        if (!value) {
          return "Please confirm your password"
        }
        if (value !== formData.password) {
          return "Passwords do not match"
        }
        break
    }
    return undefined
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
    
    // Validate field if it has been touched
    if (touched[field]) {
      const error = validateField(field, value)
      setFieldErrors((prev) => ({ ...prev, [field]: error }))
    }
    
    // Special handling for confirm password - validate against password
    if (field === "password" && touched.confirmPassword && formData.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword)
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof typeof formData])
    setFieldErrors((prev) => ({ ...prev, [field]: error }))
  }

  const passwordStrength = formData.password.length >= 8 && 
    /[A-Z]/.test(formData.password) && 
    /[a-z]/.test(formData.password) && 
    /[0-9]/.test(formData.password)

  const isFormValid = (): boolean => {
    // Check all required fields
    if (formData.password.length < 8) return false
    if (formData.password !== formData.confirmPassword) return false
    
    // Check for any field errors
    if (Object.values(fieldErrors).some((error) => error !== undefined)) return false
    
    // Validate all fields one more time
    const errors: FieldErrors = {}
    errors.password = validateField("password", formData.password)
    errors.confirmPassword = validateField("confirmPassword", formData.confirmPassword)
    
    return !Object.values(errors).some((error) => error !== undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Mark all fields as touched
    setTouched({ password: true, confirmPassword: true })

    // Validate all fields
    const errors: FieldErrors = {}
    errors.password = validateField("password", formData.password)
    errors.confirmPassword = validateField("confirmPassword", formData.confirmPassword)

    setFieldErrors(errors)

    // Check if form is valid
    if (Object.values(errors).some((error) => error !== undefined)) {
      const firstError = Object.values(errors).find((error) => error !== undefined)
      setError(firstError || "Please fix the errors in the form")
      return
    }

    if (!token) {
      setError("Invalid reset token. Please request a new password reset link.")
      return
    }

    setIsLoading(true)

    try {
      // Reset password with backend
      await resetPassword(token, formData.password)
      
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col h-screen w-full bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-20 pb-10 px-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 flex items-center justify-center mb-6 shadow-lg shadow-green-500/5">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Password Reset Successful
          </h1>
          <p className="text-muted-foreground text-center text-base max-w-md">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-safe-bottom overflow-y-auto">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="p-6 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30">
              <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed text-center">
                Redirecting you to the login page...
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-16 pb-8 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/5">
          <Building2 className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Reset Password
        </h1>
        <p className="text-muted-foreground text-center text-base">
          Enter your new password below
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-safe-bottom">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 backdrop-blur-sm">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Password */}
          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={cn(
                  "pl-11 pr-11 h-11",
                  touched.password && fieldErrors.password && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                required
                disabled={isLoading}
                autoComplete="new-password"
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
            {touched.password && fieldErrors.password ? (
              <p className="text-xs text-destructive font-medium">{fieldErrors.password}</p>
            ) : formData.password && !fieldErrors.password ? (
              <div className="flex items-center gap-2 text-xs">
                {passwordStrength ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Strong password</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    Use uppercase, lowercase, and numbers
                  </span>
                )}
              </div>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2.5">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                className={cn(
                  "pl-11 pr-11 h-11",
                  touched.confirmPassword && fieldErrors.confirmPassword && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                required
                disabled={isLoading}
                autoComplete="new-password"
                aria-invalid={touched.confirmPassword && !!fieldErrors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {touched.confirmPassword && fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive font-medium">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          {/* Back to login */}
          <div className="text-center pt-6 pb-4">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

