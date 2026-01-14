"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = ["Verified Properties", "Trusted Agents", "Secure Transactions"]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground"></span>
                </span>
                Now serving 50+ cities nationwide
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-balance">
                Find your perfect
                <br />
                <span className="text-muted-foreground">property today</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                The complete platform for property owners, tenants, and agents. Discover verified listings, connect with
                trusted professionals, and manage your properties with ease.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="h-12 px-6 text-base">
                  <Link href="/listings">
                    Browse Properties
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {/* <Button size="lg" variant="outline" className="h-12 px-6 text-base bg-transparent">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button> */}
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap gap-4 pt-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                    {feature}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} direction="left" className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <Image
                src="/luxury-apartment-interior.png"
                alt="Modern luxury apartment"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">5K+</span>
                </div>
                <div>
                  <p className="font-semibold">Active Listings</p>
                  <p className="text-sm text-muted-foreground">Updated daily</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-muted border-2 border-card" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-sm">2,000+</p>
                  <p className="text-xs text-muted-foreground">Happy clients</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
