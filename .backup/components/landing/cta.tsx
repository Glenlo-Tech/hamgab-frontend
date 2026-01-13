"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted-foreground/20 via-transparent to-transparent" />

            <div className="relative max-w-2xl mx-auto text-center">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                Ready to find your perfect property?
              </h2>
              <p className="text-lg text-background/70 mb-8">
                Join thousands of satisfied clients. Start your property journey today with HAMGAB's verified listings
                and trusted agents.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="h-12 px-8 text-base">
                  <Link href="/signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 px-8 text-base bg-transparent border-background/30 text-background hover:bg-background/10"
                >
                  <Link href="/listings">Browse Properties</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
