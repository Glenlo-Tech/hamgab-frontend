"use client"

import type React from "react"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type ListingCategory = "homes" | "lands" | "services"

interface ListingsNavProps {
  activeCategory: ListingCategory
  onCategoryChange: (category: ListingCategory) => void
}

const categories: Array<{
  id: ListingCategory
  label: string
  imageSrc: string
}> = [
  {
    id: "homes",
    label: "Homes",
    imageSrc: "/icons/house.png",
  },
  {
    id: "lands",
    label: "Lands",
    imageSrc: "/icons/land-ground.png",
  },
  {
    id: "services",
    label: "Services",
    imageSrc: "/icons/bell.png",
  },
]

// Container animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Item animation
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as const, // Custom easing for smooth feel
    },
  },
}

export function ListingsNav({ activeCategory, onCategoryChange }: ListingsNavProps) {
  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-2 flex items-center justify-center gap-6 overflow-x-auto py-6 sm:gap-10 md:gap-14 border-border bg-background/80 backdrop-blur scrollbar-hide"
      aria-label="Listings categories"
    >
      {categories.map((category, index) => {
        const isActive = activeCategory === category.id

        return (
          <motion.button
            key={category.id}
            variants={itemVariants}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "group relative cursor-pointer flex flex-col items-center gap-2 transition-all duration-300",
              "hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-xl px-3 py-2",
              "isolate",
              isActive ? "opacity-100" : "opacity-80"
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`View ${category.label}`}
            aria-current={isActive ? "page" : undefined}
          >
            {/* Hover background effect */}
            <div
              className={cn(
                "absolute inset-0 rounded-xl transition-all duration-300 -z-10",
                isActive
                  ? "bg-muted/60 opacity-100"
                  : "bg-muted/0 opacity-0 group-hover:bg-muted/40 group-hover:opacity-100"
              )}
            />

            {/* Icon */}
            <motion.div
              className="relative"
              animate={{
                scale: isActive ? 1.08 : 1,
              }}
              transition={{
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1], // Subtle bounce
              }}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={category.imageSrc}
                    alt={category.label}
                    width={56}
                    height={56}
                    className={cn(
                      "object-contain transition-all duration-300",
                      "h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12",
                      isActive && "drop-shadow-md"
                    )}
                    priority={category.id === "homes"}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Label */}
            <span
              className={cn(
                "text-xs sm:text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {category.label}
            </span>

            {/* Active Indicator - smooth animated underline */}
            <motion.div
              className="absolute -bottom-0 left-1/2 h-0.5 bg-foreground rounded-full"
              initial={false}
              animate={{
                width: isActive ? "60%" : "0%",
                x: "-50%",
                opacity: isActive ? 1 : 0,
              }}
              transition={{
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          </motion.button>
        )
      })}
    </motion.nav>
  )
}
