/**
 * Property Card Component
 * Displays a single property listing card
 */

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin, Eye, Edit, MoreVertical, Calendar } from "lucide-react"
import { Property } from "@/lib/properties"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { PropertyImageCarousel } from "./property-image-carousel"

interface PropertyCardProps {
  property: Property
  onView?: (property: Property) => void
  onEdit?: (property: Property) => void
}

/**
 * Format price with period
 */
function formatPrice(property: Property): string {
  if (!property.price) return "Price on request"

  const formattedPrice = new Intl.NumberFormat("en-US").format(property.price)
  const currency = "XAF"

  if (property.transaction_type === "SALE") {
    return `${currency} ${formattedPrice}`
  }

  // For RENT or LEASE
  if (property.price_period) {
    const periodMap: Record<string, string> = {
      DAY: "day",
      WEEK: "week",
      MONTH: "month",
      YEAR: "year",
    }
    const period = periodMap[property.price_period] || property.price_period.toLowerCase()
    return `${currency} ${formattedPrice}/${period}`
  }

  return `${currency} ${formattedPrice}`
}

/**
 * Get verification status badge styling
 * Checks both verification_status and visibility
 */
function getVerificationStatusBadge(
  verificationStatus: Property["verification_status"],
  visibility: Property["visibility"]
) {
  // GREEN status can be either PUBLIC or PRIVATE
  if (verificationStatus === "GREEN") {
    if (visibility === "PUBLIC") {
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
    } else {
      // Verified but Private - use blue/indigo to distinguish
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }
  
  switch (verificationStatus) {
    case "YELLOW":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "RED":
      return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

/**
 * Get verification status label
 * Checks both verification_status and visibility
 */
function getVerificationStatusLabel(
  verificationStatus: Property["verification_status"],
  visibility: Property["visibility"]
): string {
  // GREEN status can be either PUBLIC or PRIVATE
  if (verificationStatus === "GREEN") {
    if (visibility === "PUBLIC") {
      return "Verified & Public"
    } else {
      return "Verified (Private)"
    }
  }
  
  switch (verificationStatus) {
    case "YELLOW":
      return "Under Review"
    case "RED":
      return "Needs Attention"
    default:
      return "Unknown"
  }
}

/**
 * Format date relative to now
 */
function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return "Recently"
  }
}

export function PropertyCard({ property, onView, onEdit }: PropertyCardProps) {
  const images = property.media
    ?.filter((m) => m.file_type === "image")
    .map((m) => m.file_path) || []
  
  const location = property.locations?.[0]
  const address = location
    ? [location.address, location.city, location.state]
        .filter(Boolean)
        .join(", ")
    : "Location not specified"

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Property Image Carousel */}
        <div className="relative">
          <PropertyImageCarousel
            images={images}
            propertyTitle={property.title}
            className="h-48 md:h-auto md:w-64"
          />
          {/* Verification Status Badge Overlay */}
          <div className="absolute top-2 left-2 z-20">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-medium",
                getVerificationStatusBadge(property.verification_status, property.visibility)
              )}
            >
              {getVerificationStatusLabel(property.verification_status, property.visibility)}
            </Badge>
          </div>
        </div>

        {/* Property Details */}
        <CardContent className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">{property.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 min-w-0">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{address}</span>
              </p>
              {property.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {property.description}
                </p>
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(property)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {property.verification_status !== "RED" && (
                  <DropdownMenuItem onClick={() => onEdit?.(property)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Listing
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Price</p>
              <p className="font-semibold text-sm">{formatPrice(property)}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="text-sm font-medium capitalize">
                {property.property_type.toLowerCase()}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Transaction</p>
              <p className="text-sm font-medium capitalize">
                {property.transaction_type.toLowerCase()}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Submitted</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatRelativeDate(property.created_at)}
              </p>
            </div>
          </div>

          {/* Admin Feedback (if rejected) */}
          {property.verification_status === "RED" && property.admin_feedback && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
              <p className="text-xs text-red-800 dark:text-red-200">
                <span className="font-medium">Feedback:</span> {property.admin_feedback}
              </p>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}

