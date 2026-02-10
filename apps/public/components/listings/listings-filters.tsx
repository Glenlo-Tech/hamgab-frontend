"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FadeIn } from "@/components/motion-wrapper"
import { Search, SlidersHorizontal, MapPin } from "lucide-react"

export type ListingsFilterState = {
  propertyType: string
  minPrice: number
  maxPrice: number
  city: string
  country: string
  sortBy: "newest" | "oldest" | "price-low" | "price-high"
}

type ListingCategory = "homes" | "lands" | "services"

interface ListingsFiltersProps {
  filters: ListingsFilterState
  onFiltersChange: (next: Partial<ListingsFilterState>) => void
  totalCount?: number
  category: ListingCategory
}

interface FilterContentProps {
  filters: ListingsFilterState
  onFiltersChange: (next: Partial<ListingsFilterState>) => void
  onApplyFilters: () => void
  category: ListingCategory
}

function FilterContent({ filters, onFiltersChange, onApplyFilters, category }: FilterContentProps) {
  const propertyTypeOptions =
    category === "homes"
      ? [
          { value: "all", label: "Homes" },
          { value: "apartment", label: "Apartment" },
          { value: "condo", label: "Condo" },
          { value: "villa", label: "Villa" },
          { value: "commercial", label: "Commercial" },
        ]
      : category === "lands"
        ? [{ value: "land", label: "Land" }]
        : [{ value: "services", label: "Services" }]

  return (
    <div className="space-y-5 px-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Property Type</label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) => onFiltersChange({ propertyType: value })}
        >
          <SelectTrigger className="h-11 rounded-lg">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Price Range</label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Min (XAF)"
              value={filters.minPrice === 0 ? "" : filters.minPrice}
              onChange={(e) => {
                const value = e.target.value === "" ? 0 : Number(e.target.value)
                onFiltersChange({ minPrice: value })
              }}
              className="h-11 rounded-lg"
            />
          </div>
          <span className="shrink-0 text-sm text-muted-foreground">to</span>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Max (XAF)"
              value={filters.maxPrice === 5000000 ? "" : filters.maxPrice}
              onChange={(e) => {
                const value = e.target.value === "" ? 5000000 : Number(e.target.value)
                onFiltersChange({ maxPrice: value })
              }}
              className="h-11 rounded-lg"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={onApplyFilters}
        className="mt-2 h-11 w-full rounded-lg"
      >
        Apply Filters
      </Button>
    </div>
  )
}

export function ListingsFilters({ filters, onFiltersChange, totalCount, category }: ListingsFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const desktopPropertyTypeOptions =
    category === "homes"
      ? [
          { value: "all", label: "Homes" },
          { value: "apartment", label: "Apartment" },
          { value: "condo", label: "Condo" },
          { value: "villa", label: "Villa" },
          { value: "commercial", label: "Commercial" },
        ]
      : category === "lands"
        ? [{ value: "land", label: "Land" }]
        : [{ value: "commercial", label: "Services" }]

  const handleApplyFilters = () => {
    setShowMobileFilters(false)
  }

  return (
    <div className="mb-8">
      <div className="sticky top-20 z-30 flex w-full items-center justify-center bg-background/80 backdrop-blur-sm">
        <form
          className="group flex w-full max-w-3xl items-center gap-2 rounded-full bg-background px-3 py-1.5 shadow-[0_6px_24px_rgba(15,23,42,0.08)] transition-shadow duration-200 focus-within:shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:px-5 sm:py-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleApplyFilters()
          }}
          aria-label="Listings search"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-0.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <p className="text-[11px] sm:text-xs font-bold text-muted-foreground leading-tight">Where</p>
            </div>
            <Input
              placeholder="Search by city"
              className="h-7 min-w-0 !border-0 bg-transparent px-0 text-xs sm:h-8 sm:text-sm placeholder:text-muted-foreground/70 !shadow-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
              value={filters.city}
              onChange={(e) => onFiltersChange({ city: e.target.value })}
            />
          </div>

          <div className="hidden h-8 w-px bg-border/70 sm:block" />

          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0 cursor-pointer rounded-full bg-primary text-primary-foreground shadow-md transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-primary/90 hover:shadow-lg active:translate-y-0 active:shadow-md sm:h-10 sm:w-10"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <FadeIn className="mt-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {typeof totalCount === "number" ? totalCount : "—"}
              </span>{" "}
              properties
            </p>

            <div className="flex items-center gap-2">
             

              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden bg-transparent"
                    aria-label="Open filters"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent
                      filters={filters}
                      onFiltersChange={onFiltersChange}
                      onApplyFilters={handleApplyFilters}
                      category={category}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 mt-2 p-4 bg-muted/50 rounded-xl">
            <Select
              value={filters.propertyType}
              onValueChange={(value) => onFiltersChange({ propertyType: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                {desktopPropertyTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                filters.minPrice === 0 && filters.maxPrice === 5_000_000
                  ? "any"
                  : `${filters.minPrice}-${filters.maxPrice}`
              }
              onValueChange={(value) => {
                if (value === "any") {
                  onFiltersChange({ minPrice: 0, maxPrice: 5_000_000 })
                } else {
                  const [min, max] = value.split("-").map(Number)
                  onFiltersChange({ minPrice: min, maxPrice: max })
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="0-100000">XAF 0 - XAF 100K</SelectItem>
                <SelectItem value="100000-500000">XAF 100K - XAF 500K</SelectItem>
                <SelectItem value="500000-1000000">XAF 500K - XAF 1M</SelectItem>
                <SelectItem value="1000000-5000000">XAF 1M - XAF 5M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
