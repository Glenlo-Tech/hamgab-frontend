"use client"

import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion-wrapper"
import { DollarSign, Shield, BarChart3, Clock, Users, Smartphone, FileText, Headphones } from "lucide-react"

const features = [
  {
    icon: DollarSign,
    title: "Competitive Commission",
    description: "Earn up to 15% more than industry standard with our transparent commission structure.",
  },
  {
    icon: Shield,
    title: "Verified Listings Only",
    description: "Work with pre-verified properties and owners, reducing time wasted on fake listings.",
  },
  {
    icon: BarChart3,
    title: "Performance Dashboard",
    description: "Track your earnings, leads, and conversions in real-time with detailed analytics.",
  },
  {
    icon: Clock,
    title: "Quick Payouts",
    description: "Get paid within 48 hours of deal closure. No waiting for months on end.",
  },
  {
    icon: Users,
    title: "Lead Generation",
    description: "Access our pool of active buyers and renters looking for properties in your area.",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Manage listings, respond to inquiries, and close deals on the go.",
  },
  {
    icon: FileText,
    title: "Digital Contracts",
    description: "E-signatures and digital agreements to close deals faster without paperwork.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated agent success team to help you grow your business.",
  },
]

export function AgentsFeatures() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Why Choose HAMGAB</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the tools, support, and opportunities you need to build a thriving real estate career.
          </p>
        </FadeIn>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-all duration-300 h-full">
                <div className="h-12 w-12 rounded-xl bg-foreground text-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
