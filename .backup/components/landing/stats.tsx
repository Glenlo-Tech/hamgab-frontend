"use client"

import { StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { motion, animate } from "framer-motion"
import { useEffect, useState } from "react"

const stats = [
  { value: 5000, suffix: "+", label: "Properties Listed" },
  { value: 2500, suffix: "+", label: "Happy Clients" },
  { value: 150, suffix: "+", label: "Expert Agents" },
  { value: 50, suffix: "+", label: "Cities Covered" },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })
    return controls.stop
  }, [value])

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-16 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2"
              >
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <p className="text-sm text-background/70">{stat.label}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
