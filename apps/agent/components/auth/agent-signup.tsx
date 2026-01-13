"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { registerAgent } from "@/lib/auth"
import { ApiClientError } from "@/lib/api-client"

interface FieldErrors {
  fullName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export function AgentSignup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  // Phone validation (supports international format)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "fullName":
        if (!value.trim()) {
          return "Full name is required"
        }
        if (value.trim().length < 2) {
          return "Full name must be at least 2 characters"
        }
        break
      case "email":
        if (!value.trim()) {
          return "Email is required"
        }
        if (!emailRegex.test(value.trim())) {
          return "Please enter a valid email address"
        }
        break
      case "phone":
        if (!value.trim()) {
          return "Phone number is required"
        }
        // Remove spaces and dashes for validation
        const cleanPhone = value.replace(/[\s-]/g, "")
        if (!phoneRegex.test(cleanPhone)) {
          return "Please enter a valid phone number"
        }
        break
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

  const isFormValid = (): boolean => {
    // Check all required fields
    if (!formData.fullName.trim()) return false
    if (!formData.email.trim()) return false
    if (!formData.phone.trim()) return false
    if (formData.password.length < 8) return false
    if (formData.password !== formData.confirmPassword) return false
    if (!acceptTerms) return false
    
    // Check for any field errors
    if (Object.values(fieldErrors).some((error) => error !== undefined)) return false
    
    // Validate all fields one more time
    const errors: FieldErrors = {}
    errors.fullName = validateField("fullName", formData.fullName)
    errors.email = validateField("email", formData.email)
    errors.phone = validateField("phone", formData.phone)
    errors.password = validateField("password", formData.password)
    errors.confirmPassword = validateField("confirmPassword", formData.confirmPassword)
    
    return !Object.values(errors).some((error) => error !== undefined)
  }

  const validateForm = () => {
    // Mark all fields as touched
    const allFields = ["fullName", "email", "phone", "password", "confirmPassword"]
    allFields.forEach((field) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
    })

    // Validate all fields
    const errors: FieldErrors = {}
    errors.fullName = validateField("fullName", formData.fullName)
    errors.email = validateField("email", formData.email)
    errors.phone = validateField("phone", formData.phone)
    errors.password = validateField("password", formData.password)
    errors.confirmPassword = validateField("confirmPassword", formData.confirmPassword)

    setFieldErrors(errors)

    // Check if form is valid
    if (Object.values(errors).some((error) => error !== undefined)) {
      const firstError = Object.values(errors).find((error) => error !== undefined)
      setError(firstError || "Please fix the errors in the form")
      return false
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Register agent with backend
      await registerAgent({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })
      
      // Redirect to OTP verification
      router.push("/auth/verify-otp")
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : "Signup failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = formData.password.length >= 8 && 
    /[A-Z]/.test(formData.password) && 
    /[a-z]/.test(formData.password) && 
    /[0-9]/.test(formData.password)

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-16 pb-8 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/5">
          <Building2 className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-muted-foreground text-center text-base">
          Join HAMGAB as a property agent
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

          {/* Full Name */}
          <div className="space-y-2.5">
            <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                onBlur={() => handleBlur("fullName")}
                className={cn(
                  "pl-11 h-11",
                  touched.fullName && fieldErrors.fullName && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                required
                disabled={isLoading}
                autoComplete="name"
                aria-invalid={touched.fullName && !!fieldErrors.fullName}
              />
            </div>
            {touched.fullName && fieldErrors.fullName && (
              <p className="text-xs text-destructive font-medium">{fieldErrors.fullName}</p>
            )}
          </div>

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
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
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

          {/* Phone */}
          <div className="space-y-2.5">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="phone"
                type="tel"
                placeholder="+237 673952611"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                className={cn(
                  "pl-11 h-11",
                  touched.phone && fieldErrors.phone && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                required
                disabled={isLoading}
                autoComplete="tel"
                aria-invalid={touched.phone && !!fieldErrors.phone}
              />
            </div>
            {touched.phone && fieldErrors.phone && (
              <p className="text-xs text-destructive font-medium">{fieldErrors.phone}</p>
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
              Confirm Password
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

          {/* Terms and conditions */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Sign in link */}
          <div className="text-center pt-6 pb-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

