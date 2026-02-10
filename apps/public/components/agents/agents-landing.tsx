"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { AgentsHero } from "@/components/agents/agents-hero"
import { AgentsFeatures } from "@/components/agents/agents-features"
import { AgentsHowItWorks } from "@/components/agents/agents-how-it-works"
import { AgentsStats } from "@/components/agents/agents-stats"
import { AgentsTestimonials } from "@/components/agents/agents-testimonials"
import { AgentsCTA } from "@/components/agents/agents-cta"

export function AgentsLanding() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <AgentsHero />
        <AgentsFeatures />
        <AgentsHowItWorks />
        <AgentsStats />
        <AgentsTestimonials />
        <AgentsCTA />
      </main>
      <Footer />
    </div>
  )
}
