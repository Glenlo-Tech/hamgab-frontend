"use client"

import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion-wrapper"
import { useEffect, useState, useRef } from "react"

const stats = [
  { value: 1500, suffix: "+", label: "Active Agents" },
  { value: 45, prefix: "$", suffix: "K", label: "Avg. Monthly Earnings" },
  { value: 98, suffix: "%", label: "Agent Satisfaction" },
  { value: 10, suffix: "K+", label: "Properties Listed" },
]

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, isVisible])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

export function AgentsStats() {
  return (
    <section className="py-24 lg:py-32 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Join a growing community
          </h2>
          <p className="text-lg text-background/70 max-w-2xl mx-auto">
            Our agents are earning more and closing deals faster than ever before.
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-background/70 text-sm sm:text-base">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
