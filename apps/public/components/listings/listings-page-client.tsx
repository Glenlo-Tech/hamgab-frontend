"use client"

import { useState } from "react"
import { ListingsFilters, ListingsFilterState } from "@/components/listings/listings-filters"
import { ListingsGrid } from "@/components/listings/listings-grid"
import { ListingsNav } from "@/components/listings/listings-nav"

type ListingCategory = "homes" | "lands" | "services"

interface ListingsPageClientProps {
  initialPage?: number
  pageSize?: number
}

export function ListingsPageClient({ initialPage = 1, pageSize = 20 }: ListingsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<ListingCategory>("homes")
  const [filters, setFilters] = useState<ListingsFilterState>({
    propertyType: "all",
    minPrice: 0,
    maxPrice: 5_000_000,
    city: "",
    country: "",
    sortBy: "newest",
  })

  const [page, setPage] = useState(initialPage)

  const handleFiltersChange = (next: Partial<ListingsFilterState>) => {
    setPage(1) // reset to first page when filters change
    setFilters((prev) => ({ ...prev, ...next }))
  }

  const handleCategoryChange = (category: ListingCategory) => {
    setActiveCategory(category)
    setPage(1) // reset to first page when category changes
    
    // Map category to property type filter.
    // For now:
    // - Homes: leave as \"all\" and let the grid restrict to Apartment/Condo/Villa/Commercial.
    // - Lands: filter by \"land\".
    // - Services: filter by \"commercial\" (service-like listings).
    setFilters((prev) => ({
      ...prev,
      propertyType:
        category === "lands"
          ? "land"
          : category === "services"
          ? "commercial"
          : "all",
    }))
  }

  return (
    <>
      <ListingsNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      <ListingsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <ListingsGrid
        filters={filters}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        category={activeCategory}
        sectionTitle={
          activeCategory === "homes"
            ? "Homes"
            : activeCategory === "lands"
            ? "Lands"
            : "Services"
        }
      />
    </>
  )
}


