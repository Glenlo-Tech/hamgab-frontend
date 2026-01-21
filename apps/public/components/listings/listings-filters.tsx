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
  listingType: string
  minPrice: number
  maxPrice: number
  bedrooms: string
  bathrooms: string
  status: string
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
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Property Type</label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) => onFiltersChange({ propertyType: value })}
        >
          <SelectTrigger>
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
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Listing Type</label>
        <Select
          value={filters.listingType}
          onValueChange={(value) => onFiltersChange({ listingType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select listing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Listings</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Bedrooms</label>
        <Select
          value={filters.bedrooms}
          onValueChange={(value) => onFiltersChange({ bedrooms: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Bathrooms</label>
        <Select
          value={filters.bathrooms}
          onValueChange={(value) => onFiltersChange({ bathrooms: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bathrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-4 block">
          Price Range: ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
        </label>
        <Slider
          defaultValue={[0, 5000000]}
          max={5000000}
          step={50000}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={handlePriceChange}
          className="mt-2"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="verified">Verified Only</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full">Apply Filters</Button>
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

      <div className="hidden lg:grid grid-cols-6 gap-4 mt-6 p-4 bg-muted/50 rounded-xl">
        <Select
          value={filters.propertyType}
          onValueChange={(value) => onFiltersChange({ propertyType: value })}
        >
          <SelectTrigger>
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
          value={filters.listingType}
          onValueChange={(value) => onFiltersChange({ listingType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Listing Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Listings</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rental">For Lease</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.bedrooms}
          onValueChange={(value) => onFiltersChange({ bedrooms: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Beds</SelectItem>
            <SelectItem value="1">1+ Bed</SelectItem>
            <SelectItem value="2">2+ Beds</SelectItem>
            <SelectItem value="3">3+ Beds</SelectItem>
            <SelectItem value="4">4+ Beds</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.bathrooms}
          onValueChange={(value) => onFiltersChange({ bathrooms: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Bathrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Baths</SelectItem>
            <SelectItem value="1">1+ Bath</SelectItem>
            <SelectItem value="2">2+ Baths</SelectItem>
            <SelectItem value="3">3+ Baths</SelectItem>
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
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Price</SelectItem>
            <SelectItem value="0-100000">$0 - $100K</SelectItem>
            <SelectItem value="100000-500000">$100K - $500K</SelectItem>
            <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
            <SelectItem value="1000000+">$1M+</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="available">Available</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FadeIn>
  )
}
