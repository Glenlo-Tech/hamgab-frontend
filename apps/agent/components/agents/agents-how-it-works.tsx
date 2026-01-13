"use client"

import { FadeIn } from "@/components/motion-wrapper"
import { UserPlus, FileSearch, Handshake, Banknote } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Profile",
    description: "Sign up and complete your agent profile with credentials, experience, and service areas.",
  },
  {
    icon: FileSearch,
    step: "02",
    title: "Get Verified",
    description: "Our team reviews your application and verifies your credentials within 24-48 hours.",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Start Listing",
    description: "Access property submissions, connect with owners, and start listing properties.",
  },
  {
    icon: Banknote,
    step: "04",
    title: "Earn & Grow",
    description: "Close deals, earn competitive commissions, and grow your client base.",
  },
]

export function AgentsHowItWorks() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">How It Works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Start earning in 4 simple steps
          </h2>
        </FadeIn>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.1}>
                <div className="relative text-center">
                  {/* Step circle */}
                  <div className="relative z-10 mx-auto mb-6">
                    <div className="h-20 w-20 rounded-full bg-card border-2 border-border flex items-center justify-center mx-auto relative">
                      <step.icon className="h-8 w-8" />
                      <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
