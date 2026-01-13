"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const benefits = [
  "No monthly fees or hidden charges",
  "Keep 100% of your commission",
  "Cancel anytime, no contracts",
  "Free training and certification",
]

export function AgentsCTA() {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative rounded-3xl bg-foreground text-background p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-background blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-background blur-3xl" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-balance">
                  Ready to start your journey?
                </h2>
                <p className="text-lg text-background/80 mb-8 max-w-lg">
                  Join HAMGAB today and take your real estate career to the next level. No fees, no contracts, just
                  opportunities.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" variant="secondary" asChild className="h-12 px-8 text-base">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base bg-transparent border-background/30 text-background hover:bg-background/10 hover:text-background"
                  >
                    Schedule a Call
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-background/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-background/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
