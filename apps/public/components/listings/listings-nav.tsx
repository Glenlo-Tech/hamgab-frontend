"use client"

import type React from "react"

import { Home, MapPin, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ListingCategory = "homes" | "lands" | "services"

interface ListingsNavProps {
  activeCategory: ListingCategory
  onCategoryChange: (category: ListingCategory) => void
}

const categories: Array<{
  id: ListingCategory
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  {
    id: "homes",
    label: "Homes",
    icon: Home,
  },
  {
    id: "lands",
    label: "Lands",
    icon: MapPin,
  },
  {
    id: "services",
    label: "Services",
    icon: Building2,
  },
]

export function ListingsNav({ activeCategory, onCategoryChange }: ListingsNavProps) {
  return (
    <nav className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 py-6 border-b border-border">
      {categories.map((category) => {
        const Icon = category.icon
        const isActive = activeCategory === category.id

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex flex-col items-center gap-2 transition-all duration-200",
              "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1",
              isActive && "opacity-100"
            )}
            aria-label={`View ${category.label}`}
          >
            {/* Icon Container */}
            <div
              className={cn(
                "relative transition-all duration-200",
                isActive && "scale-110"
              )}
            >
              {/* Placeholder for illustration - will be replaced with images */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                <Icon
                  className={cn(
                    "w-full h-full transition-colors duration-200",
                    isActive
                      ? "text-primary fill-primary/10"
                      : "text-muted-foreground"
                  )}
                />
              </div>
              
              {/* You can replace the Icon above with an Image component later:
              <Image
                src={`/icons/${category.id}.svg`}
                alt={category.label}
                width={64}
                height={64}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
              />
              */}
            </div>

            {/* Label */}
            <span
              className={cn(
                "text-sm sm:text-base font-medium transition-colors duration-200",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {category.label}
            </span>

            {/* Active Indicator - Underline */}
            <div
              className={cn(
                "h-0.5 w-full transition-all duration-200",
                isActive
                  ? "bg-foreground scale-x-100"
                  : "bg-transparent scale-x-0"
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
