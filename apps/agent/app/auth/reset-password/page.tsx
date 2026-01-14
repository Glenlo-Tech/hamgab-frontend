"use client"

import { Suspense } from "react"
import { ResetPassword } from "@/components/auth/reset-password"

function ResetPasswordFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPassword />
    </Suspense>
  )
}

