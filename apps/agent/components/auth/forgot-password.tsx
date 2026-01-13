"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { requestPasswordReset } from "@/lib/auth"
import { ApiClientError } from "@/lib/api-client"

export function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [touched, setTouched] = useState(false)

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return "Email is required"
    }
    if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address"
    }
    return undefined
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setError(null)
    if (touched) {
      const error = validateEmail(value)
      setFieldError(error)
    }
  }

  const handleBlur = () => {
    setTouched(true)
    const error = validateEmail(email)
    setFieldError(error)
  }

  const isFormValid = (): boolean => {
    return !!email.trim() && !validateEmail(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    setError(null)

    const emailError = validateEmail(email)
    if (emailError) {
      setFieldError(emailError)
      return
    }

    setIsLoading(true)

    try {
      // Request password reset with backend
      await requestPasswordReset(email)
      
      setSuccess(true)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError(err instanceof Error ? err.message : "Failed to send reset link. Please try again.")
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
            Check Your Email
          </h1>
          <p className="text-muted-foreground text-center text-base max-w-md">
            We've sent a password reset link to
          </p>
          <p className="text-blue-600 font-semibold mt-1">{email}</p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-safe-bottom overflow-y-auto">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="p-6 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30">
              <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                If an account exists with this email address, you'll receive a password reset link shortly. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <Button
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                  setTouched(false)
                  setFieldError(undefined)
                }}
                variant="outline"
                className="w-full h-11"
              >
                Try Another Email
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-20 pb-10 px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/5">
          <Building2 className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Forgot Password?
        </h1>
        <p className="text-muted-foreground text-center text-base max-w-md">
          No worries! Enter your email address and we'll send you a link to reset your password.
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
                onBlur={handleBlur}
                className={cn(
                  "pl-11 h-11",
                  touched && fieldError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                required
                disabled={isLoading}
                autoComplete="email"
                aria-invalid={touched && !!fieldError}
              />
            </div>
            {touched && fieldError && (
              <p className="text-xs text-destructive font-medium">{fieldError}</p>
            )}
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
                Sending Reset Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          {/* Back to login */}
          <div className="text-center pt-4">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

