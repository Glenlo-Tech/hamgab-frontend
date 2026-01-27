"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, Shield, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { loginAdmin } from "@/lib/admin-auth"
import { ApiClientError } from "@/lib/api-client"

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateField = (field: "email" | "password", value: string): string | undefined => {
    switch (field) {
      case "email": {
        if (!value.trim()) return "Email is required"
        if (!emailRegex.test(value.trim())) return "Please enter a valid email address"
        return undefined
      }
      case "password": {
        if (!value) return "Password is required"
        if (value.length < 8) return "Password must be at least 8 characters"
        return undefined
      }
    }
  }

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = field === "email" ? email : password
    const err = validateField(field, value)
    setFieldErrors((prev) => ({ ...prev, [field]: err }))
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setError(null)
    if (touched.email) {
      const err = validateField("email", value)
      setFieldErrors((prev) => ({ ...prev, email: err }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setError(null)
    if (touched.password) {
      const err = validateField("password", value)
      setFieldErrors((prev) => ({ ...prev, password: err }))
    }
  }

  const isFormValid = () => {
    if (!email.trim() || !password) return false
    if (fieldErrors.email || fieldErrors.password) return false
    return !validateField("email", email) && !validateField("password", password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const emailError = validateField("email", email)
    const passwordError = validateField("password", password)
    setFieldErrors({ email: emailError, password: passwordError })
    setTouched({ email: true, password: true })

    if (emailError || passwordError) return

    setIsLoading(true)
    try {
      await loginAdmin(email.trim(), password)
      // Redirect to admin dashboard on success
      router.push("/admin")
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Login failed. Please check your credentials and try again."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/40">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">HAMGAB</p>
            <p className="text-xs text-muted-foreground leading-tight">Admin Portal</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Secure access for administrators
        </span>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Login</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Sign in with your admin credentials to manage the platform.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 sm:p-7 shadow-lg shadow-black/5 space-y-5"
          >
            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  autoComplete="email"
                  disabled={isLoading}
                  aria-invalid={touched.email && !!fieldErrors.email}
                  className={cn(
                    "pl-10 h-11",
                    touched.email &&
                      fieldErrors.email &&
                      "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                  )}
                />
              </div>
              {touched.email && fieldErrors.email && (
                <p className="text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  autoComplete="current-password"
                  disabled={isLoading}
                  aria-invalid={touched.password && !!fieldErrors.password}
                  className={cn(
                    "pl-10 pr-10 h-11",
                    touched.password &&
                      fieldErrors.password &&
                      "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/60"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className="text-xs text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Use your admin email and password.</span>
              <Link href="#" className="hover:underline opacity-60 pointer-events-none">
                Forgot password
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-1"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}


