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

interface ListingsFiltersProps {
  filters: ListingsFilterState
  onFiltersChange: (next: Partial<ListingsFilterState>) => void
  totalCount?: number
}

export function ListingsFilters({ filters, onFiltersChange, totalCount }: ListingsFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)


  const handleApplyFilters = () => {
    // Close the modal smoothly
    setShowMobileFilters(false)
  }

  const FilterContent = () => (
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
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="other">Other</SelectItem>
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
          <span className="text-sm text-muted-foreground shrink-0">to</span>
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
        onClick={handleApplyFilters}
        className="w-full h-11 rounded-lg mt-2"
      >
        Apply Filters
      </Button>
    </div>
  )

  return (
    <FadeIn className="mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by city or country..."
              className="pl-10 h-12"
              value={filters.city}
              onChange={(e) => onFiltersChange({ city: e.target.value })}
            />
          </div>
          <Button size="lg" className="h-12 px-6 hidden sm:flex">
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
          <Button size="lg" className="h-12 sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {typeof totalCount === "number" ? totalCount : "—"}
            </span>{" "}
            properties
          </p>

          <div className="flex items-center gap-2">
            <Select
              value={filters.sortBy}
              onValueChange={(value: ListingsFilterState["sortBy"]) =>
                onFiltersChange({ sortBy: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-4 mt-6 p-4 bg-muted/50 rounded-xl">
        <Select
          value={filters.propertyType}
          onValueChange={(value) => onFiltersChange({ propertyType: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="other">Other</SelectItem>
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
    </FadeIn>
  )
}
