"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { ArrowRight, BadgeCheck, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const highlights = [
  { icon: TrendingUp, text: "Earn 15% more commission" },
  { icon: BadgeCheck, text: "Verified agent badge" },
  { icon: Users, text: "Access to 10K+ owners" },
]

export function AgentsHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-muted/60 via-background to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-background"></span>
                </span>
                Now accepting new agents
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-balance">
                Grow your real estate
                <br />
                <span className="text-muted-foreground">business with us</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Join thousands of successful agents on HAMGAB. Get access to verified property owners, powerful
                listing tools, and a commission structure that rewards your hard work.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="h-12 px-6 text-base">
                  <Link href="/agent/dashboard">
                    Join as Agent
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6 text-base bg-transparent">
                  Learn More
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {highlights.map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} direction="left" className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <Image
                src="/professional-real-estate-agent-showing-property-to.jpg"
                alt="Professional real estate agent"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center">
                  <span className="text-background font-bold text-lg">$45K</span>
                </div>
                <div>
                  <p className="font-semibold">Avg. Monthly Earnings</p>
                  <p className="text-sm text-muted-foreground">Top performers</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    "/professional-headshot-person.png",
                    "/professional-woman-headshot.png",
                    "/professional-asian-man-headshot-portrait.jpg",
                    "/professional-latina-woman-headshot-friendly.jpg",
                  ].map((src, i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-muted border-2 border-card overflow-hidden">
                      <Image
                        src={src}
                        alt=""
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-sm">1,500+</p>
                  <p className="text-xs text-muted-foreground">Active agents</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
