"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Bed, Bath, Square, MapPin, CheckCircle, Heart, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { usePublicProperties } from "@/hooks/use-public-properties"
import { ListingsFilterState } from "./listings-filters"

interface ListingsGridProps {
  filters: ListingsFilterState
  page: number
  pageSize: number
  onPageChange: (page: number) => void
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
    <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <StaggerItem key={index}>
          <Card className="overflow-hidden h-full flex flex-col">
            <div className="relative aspect-[4/3] bg-muted animate-pulse" />
            <CardContent className="p-4 space-y-3">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="flex items-center gap-4 w-full">
                <div className="h-4 w-10 bg-muted animate-pulse rounded" />
                <div className="h-4 w-10 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </div>
            </CardFooter>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}

export function ListingsGrid({ filters, page, pageSize, onPageChange }: ListingsGridProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

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

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
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
      ) : properties.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <p className="text-lg font-semibold">No properties found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search in a different location.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden group h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow bg-card border"
              onClick={() => setSelectedPropertyId(property.id)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={property.media[0]?.file_path || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant={property.transaction_type === "RENT" ? "secondary" : "default"}>
                    {property.transaction_type === "RENT" ? "For Rent" : "For Sale"}
                  </Badge>
                  {property.verification_status === "GREEN" && (
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <button
                  onClick={(e) => toggleFavorite(property.id, e)}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(property.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>
              </div>
              <CardContent className="p-4 flex-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {formatLocation(property.locations[0]?.city, property.locations[0]?.country)}
                </div>
                <h3 className="font-semibold mb-2 line-clamp-1">{property.title}</h3>
                <p className="text-xl font-bold">
                  {formatPrice(property.price, property.transaction_type)}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t border-border mt-auto">
                <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    —
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    —
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    —
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: meta.total_pages }).map((_, index) => {
            const pageNumber = index + 1
            return (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            )
          })}
          <Button
            variant="outline"
            size="icon"
            disabled={page >= meta.total_pages}
            onClick={() => onPageChange(Math.min(meta.total_pages, page + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Property Details Dialog */}
      <Dialog open={!!selectedPropertyId} onOpenChange={() => setSelectedPropertyId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {(() => {
            if (!selectedPropertyId) return null
            const property = properties.find((p) => p.id === selectedPropertyId)
            if (!property) return null

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
                  <Image
                    src={property.media[0]?.file_path || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
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
