"use client"

import { FormEvent, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function AuthDialog() {
  const { authModalOpen, authModalMode, closeAuthModal, login, register, loading, error, clearError } =
    useAuth()

  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    setMode(authModalMode)
  }, [authModalMode])

  useEffect(() => {
    if (!authModalOpen) {
      setEmail("")
      setPhone("")
      setPassword("")
      clearError()
    }
  }, [authModalOpen, clearError])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email || !password) return

    if (mode === "login") {
      await login(email, password)
      return
    }

    if (!phone) return
    await register(email, phone, password)
  }

  return (
    <Dialog open={authModalOpen} onOpenChange={(open) => (!open ? closeAuthModal() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Log in" : "Create your account"}</DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Access your HAMGAB account to manage and save properties."
              : "Create a HAMGAB account to save properties and manage your activity."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-full bg-muted/60 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full px-3 py-1.5 transition ${
              mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full px-3 py-1.5 transition ${
              mode === "register" ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode === "register" && (
            <div className="space-y-1.5">
              <label htmlFor="auth-phone" className="text-sm font-medium text-foreground">
                Phone
              </label>
              <Input
                id="auth-phone"
                type="tel"
                autoComplete="tel"
                placeholder="e.g. 674652812"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={mode === "register"}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-xs text-destructive mt-1">{error}</p>}

          <Button type="submit" className="w-full rounded-full mt-2" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Continue"
              : "Sign up"}
          </Button>
        </form>

        <p className="mt-2 text-xs text-muted-foreground">
          For now, sign in with email and password. Phone, Google, and Facebook sign-in will be added
          later.
        </p>
      </DialogContent>
    </Dialog>
  )
}

