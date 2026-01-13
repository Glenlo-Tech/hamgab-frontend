"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, Loader2, ArrowLeft, RefreshCw } from "lucide-react"
import { verifyOTP, resendOTP, getPendingVerificationEmail } from "@/lib/auth"
import { ApiClientError } from "@/lib/api-client"

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60 // 60 seconds

export function OTPVerification() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [email, setEmail] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get email from localStorage
    const pendingEmail = getPendingVerificationEmail()
    if (!pendingEmail) {
      // No pending verification, redirect to signup
      router.push("/auth/signup")
      return
    }
    setEmail(pendingEmail)

    // Start countdown if needed
    const lastResendTime = localStorage.getItem("otp_last_resend")
    if (lastResendTime) {
      const timeSinceLastResend = Math.floor(
        (Date.now() - parseInt(lastResendTime)) / 1000
      )
      if (timeSinceLastResend < RESEND_COOLDOWN) {
        setCountdown(RESEND_COOLDOWN - timeSinceLastResend)
      }
    }
  }, [router])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()
    const digits = pastedData.replace(/\D/g, "").slice(0, OTP_LENGTH).split("")

    if (digits.length === 0) return

    const newOtp = [...otp]
    digits.forEach((digit, i) => {
      if (i < OTP_LENGTH) {
        newOtp[i] = digit
      }
    })
    setOtp(newOtp)

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    const focusIndex = nextEmptyIndex === -1 ? OTP_LENGTH - 1 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpCode = otp.join("")
    if (otpCode.length !== OTP_LENGTH) {
      setError("Please enter the complete OTP code")
      return
    }

    if (!email) {
      setError("Email not found. Please sign up again.")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await verifyOTP(email, otpCode)
      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError("Verification failed. Please try again.")
      }
      // Clear OTP on error
      setOtp(Array(OTP_LENGTH).fill(""))
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!email || countdown > 0) return

    setIsResending(true)
    setError(null)

    try {
      await resendOTP(email)
      // Update last resend time
      localStorage.setItem("otp_last_resend", Date.now().toString())
      setCountdown(RESEND_COOLDOWN)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError("Failed to resend OTP. Please try again.")
      }
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-16 pb-8 px-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Building2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
        <p className="text-muted-foreground text-center">
          We've sent a 6-digit code to
        </p>
        <p className="text-muted-foreground font-medium mt-1">{email}</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-safe-bottom">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-3">
            <Label>Enter Verification Code</Label>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Resend OTP */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
            {countdown > 0 ? (
              <span className="text-sm text-muted-foreground">
                Resend in {countdown}s
              </span>
            ) : (
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleResendOTP}
                disabled={isResending || isLoading}
                className="h-auto p-0 text-primary"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Resend Code
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || otp.join("").length !== OTP_LENGTH}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          {/* Back to signup */}
          <div className="text-center pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/auth/signup")}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

