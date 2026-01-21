"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Eye, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProperty } from "@/hooks/use-property"
import { Property } from "@/lib/properties"
import { PropertyImageCarousel } from "./property-image-carousel"

interface PropertyDetailsDialogProps {
  propertyId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getVerificationStatusBadge(
  verificationStatus: Property["verification_status"],
  visibility: Property["visibility"]
) {
  // GREEN status can be either PUBLIC or PRIVATE
  if (verificationStatus === "GREEN") {
    if (visibility === "PUBLIC") {
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    } else {
      // Verified but Private - use blue/indigo to distinguish
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }
  
  switch (verificationStatus) {
    case "YELLOW":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "RED":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getVerificationStatusLabel(
  verificationStatus: Property["verification_status"],
  visibility: Property["visibility"]
): string {
  // GREEN status can be either PUBLIC or PRIVATE
  if (verificationStatus === "GREEN") {
    if (visibility === "PUBLIC") {
      return "✓ Verified & Public"
    } else {
      return "✓ Verified (Private)"
    }
  }
  
  switch (verificationStatus) {
    case "YELLOW":
      return "⏳ Under Review"
    case "RED":
      return "⚠ Needs Attention"
    default:
      return "Unknown"
  }
}

function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "today"
    if (diffInDays === 1) return "yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  } catch {
    return "recently"
  }
}

function formatPrice(property: Property): string {
  if (!property.price) return "Price on request"

  const formattedPrice = new Intl.NumberFormat("en-US").format(property.price)
  const currency = "XAF"

  if (property.transaction_type === "SALE") {
    return `${currency} ${formattedPrice}`
  }

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

export function PropertyDetailsDialog({
  propertyId,
  open,
  onOpenChange,
}: PropertyDetailsDialogProps) {
  const { property, isLoading, isError, error } = useProperty(open ? propertyId : undefined)

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
  }

  const images =
    property?.media?.filter((m) => m.file_type === "image").map((m) => m.file_path) || []

  const location = property?.locations?.[0]
  const address = location
    ? [location.address, location.city, location.state, location.country]
        .filter(Boolean)
        .join(", ")
    : "Location not specified"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-4xl xl:max-w-6xl 2xl:max-w-7xl max-h-[95vh] overflow-y-auto p-0 gap-0" 
        showCloseButton={false}
      >
        {/* Professional Close Button */}
        <DialogClose asChild>
          <button
            className={cn(
              "absolute top-3 right-3 z-50",
              "h-8 w-8 sm:h-9 sm:w-9",
              "rounded-full",
              "bg-white/95 dark:bg-gray-900/95",
              "backdrop-blur-sm",
              "flex items-center justify-center",
              "border border-gray-200 dark:border-gray-700",
              "shadow-lg",
              "transition-all duration-200 ease-in-out",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "hover:border-gray-300 dark:hover:border-gray-600",
              "hover:shadow-xl hover:scale-110",
              "active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2",
              "cursor-pointer"
            )}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </DialogClose>

        {/* Header Section */}
        <DialogHeader className="px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4 lg:pb-6 space-y-2 border-b">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 lg:gap-4 pr-10">
            <span className="flex items-start gap-2 text-base sm:text-lg lg:text-xl font-semibold">
              <Eye className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{property?.title || "Property details"}</span>
            </span>
            {property && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium self-start whitespace-nowrap",
                  getVerificationStatusBadge(property.verification_status, property.visibility)
                )}
              >
                {getVerificationStatusLabel(property.verification_status, property.visibility)}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm lg:text-base">
            Complete property information including media, location, and verification status.
          </DialogDescription>
        </DialogHeader>

        {/* Content Section */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8">
          {isLoading && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-muted animate-pulse rounded" />
                <div className="h-16 bg-muted animate-pulse rounded" />
              </div>
            </div>
          )}

          {isError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                {error?.message || "Failed to load property details. Please try again."}
              </p>
            </div>
          )}

          {!isLoading && !isError && property && (
            <div className="grid gap-5 sm:gap-6 lg:gap-8 xl:gap-10 md:grid-cols-[1fr_0.8fr] lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.3fr_1fr]">
              {/* Left Column - Images & Description */}
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Image Carousel */}
                <div className="rounded-lg border overflow-hidden bg-muted/30 shadow-sm">
                  <PropertyImageCarousel
                    images={images}
                    propertyTitle={property.title}
                    className="w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96"
                  />
                </div>

                {/* Description */}
                {property.description && (
                  <div className="space-y-2 lg:space-y-3">
                    <h3 className="text-sm lg:text-base font-semibold text-foreground">Description</h3>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Key Details Card */}
                <div className="space-y-3 lg:space-y-4 p-4 lg:p-5 xl:p-6 bg-muted/30 rounded-lg border">
                  <h3 className="text-sm lg:text-base font-semibold text-foreground">Key Details</h3>
                  <div className="grid grid-cols-2 gap-4 lg:gap-5 xl:gap-6">
                    <div className="space-y-1 lg:space-y-2">
                      <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wide font-medium">
                        Price
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground">
                        {formatPrice(property)}
                      </p>
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                      <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wide font-medium">
                        Type
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground capitalize">
                        {property.property_type.toLowerCase()}
                      </p>
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                      <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wide font-medium">
                        Transaction
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground capitalize">
                        {property.transaction_type.toLowerCase()}
                      </p>
                    </div>
                    {property.security_deposit !== null && (
                      <div className="space-y-1 lg:space-y-2">
                        <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-wide font-medium">
                          Deposit
                        </p>
                        <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "XAF",
                            maximumFractionDigits: 0,
                          }).format(property.security_deposit)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Card */}
                <div className="space-y-2 lg:space-y-3 p-4 lg:p-5 xl:p-6 bg-muted/30 rounded-lg border">
                  <h3 className="text-sm lg:text-base font-semibold text-foreground">Location</h3>
                  <div className="flex items-start gap-2.5 lg:gap-3">
                    <MapPin className="h-4 w-4 lg:h-5 lg:w-5 mt-0.5 flex-shrink-0 text-primary" />
                    <p className="text-sm lg:text-base text-foreground leading-relaxed">{address}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2 lg:space-y-3 pt-2 lg:pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 lg:h-4 lg:w-4 flex-shrink-0" />
                    <span>Submitted {formatRelativeDate(property.created_at)}</span>
                  </div>
                </div>

                {/* Admin Feedback */}
                {property.verification_status === "RED" && property.admin_feedback && (
                  <div className="p-4 lg:p-5 xl:p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2 lg:gap-3">
                      <div className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center mt-0.5">
                        <span className="text-red-700 dark:text-red-300 text-xs lg:text-sm font-bold">!</span>
                      </div>
                      <div className="space-y-1 lg:space-y-2 flex-1">
                        <p className="text-xs lg:text-sm font-semibold text-red-900 dark:text-red-100">
                          Admin Feedback
                        </p>
                        <p className="text-xs sm:text-sm lg:text-base text-red-800 dark:text-red-200 leading-relaxed">
                          {property.admin_feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}