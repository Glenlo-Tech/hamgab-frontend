"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
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

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ minPrice: value[0], maxPrice: value[1] })
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
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Price Range</label>
          <span className="text-xs font-medium text-muted-foreground">
            XAF {filters.minPrice.toLocaleString()} – XAF {filters.maxPrice.toLocaleString()}
          </span>
        </div>
        <Slider
          defaultValue={[0, 5000000]}
          max={5000000}
          step={50000}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={handlePriceChange}
          className="mt-3"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>XAF 0</span>
          <span>XAF 5,000,000</span>
        </div>
      </div>

      <Button className="w-full h-11 rounded-lg mt-2">Apply Filters</Button>
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
