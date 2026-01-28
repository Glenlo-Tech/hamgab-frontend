"use client"

import { FadeIn } from "@/components/motion-wrapper"
import { BarChart3 } from "lucide-react"

export default function Analytics() {
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center p-8">
      <FadeIn>
        <div className="flex flex-col items-center justify-center gap-8 max-w-2xl w-full">
          <div className="relative w-full max-w-md aspect-square">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
              style={{ pointerEvents: "none" }}
            >
              <source src="/Website Under Construction.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Analytics Page
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Coming Soon!
            </p>
            <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
              We're building powerful analytics tools to help you understand your platform better. Check back soon!
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}