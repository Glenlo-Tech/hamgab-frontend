"use client"

import { useState } from "react"
import { ListingsFilters, ListingsFilterState } from "@/components/listings/listings-filters"
import { ListingsGrid } from "@/components/listings/listings-grid"

interface ListingsPageClientProps {
  initialPage?: number
  pageSize?: number
}

export function ListingsPageClient({ initialPage = 1, pageSize = 20 }: ListingsPageClientProps) {
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

  return (
    <>
      <ListingsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <ListingsGrid
        filters={filters}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </>
  )
}


