"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { Home, ArrowLeft, Construction } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/30 via-background to-background" />
      
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <FadeIn>
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium mb-8">
            <Construction className="h-4 w-4" />
            <span>Coming Soon</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
              404
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
              Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
              The page you're looking for doesn't exist or is still under construction. 
              We're working hard to bring you amazing features!
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="h-12 px-6 text-base">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-6 text-base bg-transparent"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? <Link href="/" className="text-foreground hover:underline font-medium">Contact Support</Link>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

