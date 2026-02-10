"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Bed, Bath, Square, MapPin, CheckCircle, Heart, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { usePublicProperties } from "@/hooks/use-public-properties"
import { ListingsFilterState } from "./listings-filters"
import { PropertyImageCarousel } from "./property-image-carousel"
import { cn } from "@/lib/utils"
import { PublicProperty } from "@/lib/public-properties"

interface ListingsGridProps {
  filters: ListingsFilterState
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  category?: "homes" | "lands" | "services"
  sectionTitle?: string
  onTotalCountChange?: (total: number) => void
}

function formatPrice(value: number | null, transactionType: string): string {
  if (value == null) return "Price on request"
  const formatted = new Intl.NumberFormat("en-US").format(value)
  const currency = "XAF"
  if (transactionType === "RENT") {
    return `${currency} ${formatted}/month`
  }
  return `${currency} ${formatted}`
}

function formatLocation(city?: string | null, country?: string | null): string {
  const parts = [city, country].filter(Boolean)
  return parts.join(", ") || "Location not specified"
}

function ListingsGridSkeleton() {
  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <StaggerItem key={index}>
          <div className="overflow-hidden h-full flex flex-col rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow max-w-full">
            <div className="relative aspect-[4/3] bg-muted animate-pulse rounded-t-2xl" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-32 bg-muted animate-pulse rounded-lg" />
              <div className="h-5 w-40 bg-muted animate-pulse rounded-lg" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}

export function ListingsGrid({
  filters,
  page,
  pageSize,
  onPageChange,
  category,
  sectionTitle = "Properties",
  onTotalCountChange,
}: ListingsGridProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollRafRef = useRef<number | null>(null)

  const noPriceFilter = filters.minPrice === 0 && filters.maxPrice === 5_000_000

  const { properties, meta, isLoading, isError, error, refresh } = usePublicProperties({
    page,
    page_size: pageSize,
    property_type: filters.propertyType === "all" ? null : filters.propertyType.toUpperCase(),
    min_price: noPriceFilter ? null : filters.minPrice,
    max_price: noPriceFilter ? null : filters.maxPrice,
    city: filters.city || null,
    country: filters.country || null,
  })

  // Restrict visible properties based on high-level category.
  const visibleProperties = useMemo(() => {
    if (!properties || properties.length === 0) return []

    const type = (value: string | undefined) => value?.toUpperCase() ?? ""

    if (category === "homes") {
      const homeTypes = new Set(["APARTMENT", "CONDO", "VILLA", "COMMERCIAL"])
      return properties.filter((p) => homeTypes.has(type((p as PublicProperty).property_type)))
    }

    if (category === "lands") {
      return properties.filter((p) => type((p as PublicProperty).property_type) === "LAND")
    }

    if (category === "services") {
      return properties.filter((p) => type((p as PublicProperty).property_type) === "COMMERCIAL")
    }

    return properties
  }, [properties, category])

  useEffect(() => {
    onTotalCountChange?.(meta?.total ?? visibleProperties.length)
  }, [meta, visibleProperties.length, onTotalCountChange])

  const toggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }, [])

  // Check scroll position and update button states
  const checkScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const { scrollLeft, scrollWidth, clientWidth } = container
    
    // Check if we can scroll left (not at the start)
    setCanScrollLeft(scrollLeft > 1) // Use > 1 instead of > 0 to account for rounding
    
    // Check if we can scroll right (not at the end)
    // Use a small threshold to account for rounding errors
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1
    setCanScrollRight(!isAtEnd)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const runScrollCheck = () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
      }
      scrollRafRef.current = requestAnimationFrame(() => {
        checkScrollPosition()
      })
    }

    checkScrollPosition()
    const timeoutId = setTimeout(checkScrollPosition, 100)
    container.addEventListener("scroll", runScrollCheck, { passive: true })
    window.addEventListener("resize", runScrollCheck, { passive: true })

    return () => {
      clearTimeout(timeoutId)
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
      }
      container.removeEventListener("scroll", runScrollCheck)
      window.removeEventListener("resize", runScrollCheck)
    }
  }, [checkScrollPosition, properties])

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = 320 // Approximate card width including gap
    const scrollAmount = cardWidth * 2 // Scroll 2 cards at a time

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
    
    // Update scroll position multiple times to account for smooth scrolling animation
    // Check immediately, then after animation starts, and after it should complete
    checkScrollPosition()
    setTimeout(checkScrollPosition, 50)
    setTimeout(checkScrollPosition, 300) // Smooth scroll typically takes ~300ms
  }

  return (
    <>
      {isLoading ? (
        <ListingsGridSkeleton />
      ) : isError ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-destructive font-medium">
            {error?.message || "Failed to load properties. Please try again."}
          </p>
          <Button variant="outline" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      ) : visibleProperties.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <p className="text-lg font-semibold">No properties found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search in a different location.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Section Header with Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            {/* Section Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">{sectionTitle}</h2>
              {meta && (
                <p className="text-sm text-muted-foreground mt-1">
                  {visibleProperties.length}{" "}
                  {visibleProperties.length === 1 ? "property" : "properties"} available
                </p>
              )}
            </div>

            {/* Carousel Navigation Controls */}
            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={cn(
                  "h-10 w-10 rounded-full border border-border bg-background shadow-md",
                  "flex items-center justify-center",
                  "hover:scale-110 transition-all duration-200",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={cn(
                  "h-10 w-10 rounded-full border border-border bg-background shadow-md",
                  "flex items-center justify-center",
                  "hover:scale-110 transition-all duration-200",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-4 scrollbar-hide sm:gap-4 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:pb-0 xl:grid-cols-5 2xl:grid-cols-6"
            >
              {visibleProperties.map((property) => {
              // Extract all image URLs from media array
              const images = property.media
                ?.filter((m) => m.file_type === "image")
                .map((m) => m.file_path) || []
              
                return (
                  <div
                    key={property.id}
                    className="group cursor-pointer flex-shrink-0 text-left w-[220px] sm:w-[240px] md:w-[260px] lg:w-auto lg:flex-shrink lg:min-w-0"
                    onClick={() => setSelectedPropertyId(property.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedPropertyId(property.id)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${property.title}`}
                  >
                <div className="overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] h-full flex flex-col w-full">
                  {/* Image Carousel Container */}
                  <div className="relative aspect-square overflow-hidden bg-muted rounded-t-2xl">
                    <PropertyImageCarousel
                      images={images}
                      propertyTitle={property.title}
                      className="w-full h-full"
                      disableLightbox={true}
                    />
                    
                    {/* Favorite Button - Top Right */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(property.id, e)}
                      className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/95 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-background hover:shadow-lg"
                      aria-label="Save to favorites"
                    >
                      <Heart
                        className={`h-4 w-4 transition-all ${
                          favorites.includes(property.id)
                            ? "fill-red-500 text-red-500"
                            : "text-foreground"
                        }`}
                      />
                    </button>

                    {/* Transaction Type Badge - Top Left */}
                    <div className="absolute top-3 left-3 z-20">
                      <Badge 
                        variant={property.transaction_type === "RENT" ? "secondary" : "default"}
                        className="border-0 bg-background/95 px-2 py-1 text-[11px] font-medium text-foreground shadow-md backdrop-blur-sm"
                      >
                        {property.transaction_type === "RENT" ? "For Rent" : "For Sale"}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content - Airbnb Style */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col min-w-0">
                    {/* Location/Title - Primary (Airbnb style) */}
                    <h3 className="font-semibold text-sm mb-1.5 line-clamp-1 text-foreground group-hover:underline transition-all">
                      {formatLocation(property.locations[0]?.city, property.locations[0]?.country)}
                    </h3>

                    {/* Property Type/Title - Secondary */}
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {property.title}
                    </p>

                    {/* Price and Rating Row */}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {formatPrice(property.price, property.transaction_type)}
                        </p>
                        {property.transaction_type === "RENT" && property.price && (
                          <p className="text-xs text-muted-foreground mt-0.5">per month</p>
                        )}
                      </div>                    
                  
                    </div>
                  </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pagination - Airbnb style */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 mb-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="rounded-full border-2 hover:border-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(meta.total_pages, 7) }).map((_, index) => {
              let pageNumber: number
              if (meta.total_pages <= 7) {
                pageNumber = index + 1
              } else if (page <= 4) {
                pageNumber = index + 1
              } else if (page >= meta.total_pages - 3) {
                pageNumber = meta.total_pages - 6 + index
              } else {
                pageNumber = page - 3 + index
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className={`rounded-full border-2 ${
                    pageNumber === page
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:border-primary transition-colors"
                  }`}
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.total_pages}
            onClick={() => onPageChange(Math.min(meta.total_pages, page + 1))}
            className="rounded-full border-2 hover:border-primary transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Property Details Dialog */}
      <Dialog open={!!selectedPropertyId} onOpenChange={() => setSelectedPropertyId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {(() => {
            if (!selectedPropertyId) return null
            const property = visibleProperties.find((p) => p.id === selectedPropertyId)
            if (!property) return null

            // Extract all image URLs from media array for the detail dialog
            const detailImages = property.media
              ?.filter((m) => m.file_type === "image")
              .map((m) => m.file_path) || []

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{property.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {formatLocation(property.locations[0]?.city, property.locations[0]?.country)}
                  </DialogDescription>
                </DialogHeader>

                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mt-4">
                  <PropertyImageCarousel
                    images={detailImages}
                    propertyTitle={property.title}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <Badge variant={property.transaction_type === "RENT" ? "secondary" : "default"}>
                    {property.transaction_type === "RENT" ? "For Rent" : "For Sale"}
                  </Badge>
                  {property.verification_status === "GREEN" && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Listing
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  {/* Public API currently does not expose beds/baths/sqft; placeholders for future */}
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold">—</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Bath className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">—</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Square className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Square Feet</p>
                    <p className="font-semibold">—</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-3">Contact Agent</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">HAMGAB Agent</p>
                      <p className="text-sm text-muted-foreground">Verified partner</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Agent
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Agent
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(property.price, property.transaction_type)}
                    </p>
                  </div>
                  <Button size="lg">Schedule Viewing</Button>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </>
  )
}
