"use client"

import { useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, Shield, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface OnboardingCarouselProps {
  onComplete: () => void
}

const onboardingSteps = [
  {
    icon: Building2,
    title: "Welcome to HAMGAB",
    description: "Join thousands of agents earning more by connecting property owners with verified buyers and renters.",
    color: "text-primary",
    bgGradient: "from-primary/10 to-primary/5",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Access premium listings, track your performance with real-time analytics, and maximize your earnings.",
    color: "text-blue-600",
    bgGradient: "from-blue-600/10 to-blue-600/5",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security. Focus on what matters - closing deals.",
    color: "text-green-600",
    bgGradient: "from-green-600/10 to-green-600/5",
  },
]

const SWIPE_THRESHOLD = 50

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)

  const x = useMotionValue(0)
  const opacity = useTransform(x, [-300, 0, 300], [0, 1, 0])

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (index: number) => {
    setDirection(index > currentStep ? 1 : -1)
    setCurrentStep(index)
  }

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 0) {
        prevStep()
      } else {
        nextStep()
      }
    }
    x.set(0)
  }

  const currentData = onboardingSteps[currentStep]
  const Icon = currentData.icon

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Skip button */}
      {currentStep < onboardingSteps.length - 1 && (
        <div className="absolute top-8 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onComplete}
            className="text-muted-foreground"
          >
            Skip
          </Button>
        </div>
      )}

      {/* Main content area - swipable */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x, opacity }}
          className="w-full h-full flex items-center justify-center"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center text-center max-w-md w-full"
            >
              {/* Icon with gradient background */}
              <div
                className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center mb-8 bg-gradient-to-br",
                  currentData.bgGradient
                )}
              >
                {/* <Icon className={cn("w-16 h-16", currentData.color)} /> */}
                <Image
                  src="/favicon_io/android-chrome-512x512.png" 
                  alt="hamgab logo"
                  width="512"
                  height="512"
                />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold mb-4">{currentData.title}</h1>

              {/* Description */}
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {currentData.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom section with dots and buttons */}
      <div className="pb-safe-bottom px-6 pb-8 space-y-6">
        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={cn(
                "rounded-full transition-[width,background-color] duration-300 ease-in-out",
                "h-1 sm:h-2",
                index === currentStep
                  ? "w-5 sm:w-8 bg-primary"
                  : "w-1 sm:w-2 bg-muted-foreground/30"
              )}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          <Button
            onClick={nextStep}
            className={cn("flex-1", currentStep === 0 && "ml-auto")}
          >
            {currentStep === onboardingSteps.length - 1 ? (
              "Get Started"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

