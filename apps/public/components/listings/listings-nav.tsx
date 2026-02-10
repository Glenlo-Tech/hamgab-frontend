"use client"

import type React from "react"

import Image from "next/image"
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

export function ListingsNav({ activeCategory, onCategoryChange }: ListingsNavProps) {
  return (
    <nav className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 py-6 border-border bg-background/80 backdrop-blur">
      {categories.map((category) => {
        const isActive = activeCategory === category.id

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "group cursor-pointer flex flex-col items-center gap-1.5 transition-all duration-200",
              "hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-lg px-2 py-1",
              isActive && "opacity-100"
            )}
            aria-label={`View ${category.label}`}
          >
            {/* Icon */}
            <div
              className={cn(
                "relative  transition-all duration-300 ease-out will-change-transform",
                isActive
                  ? "scale-110 translate-y-0"
                  : "scale-100 translate-y-[1px]",
                "group-hover:scale-110 group-hover:translate-y-0"
              )}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                <Image
                  src={category.imageSrc}
                  alt={category.label}
                  width={64}
                  height={64}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain transition-transform duration-300 ease-out"
                  priority={category.id === "homes"}
                />
              </div>
            </div>

            {/* Label */}
            <span
              className={cn(
                "text-sm sm:text-base font-medium transition-colors duration-200 whitespace-nowrap",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {category.label}
            </span>

            {/* Active Indicator - centered under icon + text */}
            <div
              className={cn(
                "mt-1 h-1 w-10 sm:w-14 origin-center",
                "transition-transform transition-colors duration-900 ease-in-out",
                isActive ? "bg-foreground scale-x-100" : "bg-transparent scale-x-0"
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
