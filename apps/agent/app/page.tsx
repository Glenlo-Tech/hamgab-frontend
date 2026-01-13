"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingCarousel } from "@/components/onboarding/onboarding-carousel"
import { AgentLogin } from "@/components/auth/agent-login"
import { hasCompletedOnboarding, isAuthenticated, completeOnboarding } from "@/lib/auth"

export default function AgentPage() {
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      router.push("/dashboard")
      return
    }

    // Check if onboarding is complete
    const onboardingComplete = hasCompletedOnboarding()
    setShowOnboarding(!onboardingComplete)
    setIsLoading(false)
  }, [router])

  const handleOnboardingComplete = () => {
    completeOnboarding()
    setShowOnboarding(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingCarousel onComplete={handleOnboardingComplete} />
  }

  return <AgentLogin />
}
