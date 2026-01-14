"use client"

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Search, Shield, Key, HandshakeIcon } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse thousands of verified listings with advanced filters to find your ideal property.",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is verified by our team to ensure accuracy and legitimacy.",
  },
  {
    icon: HandshakeIcon,
    title: "Connect with Agents",
    description: "Work with trusted, licensed agents who guide you through every step.",
  },
  {
    icon: Key,
    title: "Secure Your Property",
    description: "Complete transactions safely with our secure platform and legal support.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-2">How It Works</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Simple process, exceptional results</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined approach makes finding and securing your property easier than ever.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={step.title}>
              <div className="relative text-center">
                {/* Icon Container with Step Number */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
                  <step.icon className="h-8 w-8" />
                  {/* Step Number Badge - Better positioned for mobile */}
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                {/* Connecting Line - Only on desktop */}
                <div
                  className="absolute top-8 left-[calc(50%+40px)] hidden lg:block w-[calc(100%-80px)] h-[2px] bg-border"
                  style={{ display: index === steps.length - 1 ? "none" : undefined }}
                />
                <h3 className="font-semibold mb-2 text-base sm:text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-2 sm:px-0">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
