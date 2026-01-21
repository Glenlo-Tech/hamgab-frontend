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
import { formatDistanceToNow } from "date-fns"
import { useProperty } from "@/hooks/use-property"
import { Property } from "@/lib/properties"
import { PropertyImageCarousel } from "./property-image-carousel"

interface PropertyDetailsDialogProps {
  propertyId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getVerificationStatusBadge(status: Property["verification_status"]) {
  switch (status) {
    case "GREEN":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "YELLOW":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "RED":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return "Recently"
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
    if (!nextOpen) {
      onOpenChange(false)
    } else {
      onOpenChange(true)
    }
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
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto m-2 sm:m-4" showCloseButton={false}>
        {/* Custom Close Button */}
        <DialogClose asChild>
          <button
            className={cn(
              "absolute top-15 sm:top-13 right-3 z-50",
              "h-3 w-3 sm:h-9 sm:w-9",
              "rounded-full bg-background/90 backdrop-blur-sm",
              "flex items-center justify-center",
              "border border-border/50",
              "transition-all duration-200",
              "hover:bg-red-500 hover:border-red-500 hover:text-white",
              "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
              "shadow-lg hover:shadow-xl cursor-pointer"
            )}
            aria-label="Close dialog"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>{property?.title || "Property details"}</span>
            </span>
            {property && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  getVerificationStatusBadge(property.verification_status)
                )}
              >
                {property.verification_status === "GREEN"
                  ? "Verified"
                  : property.verification_status === "YELLOW"
                    ? "Pending Review"
                    : property.verification_status === "RED"
                      ? "Needs Attention"
                      : "Unknown"}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            View full details, status, media and location for this property.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            <div className="h-56 w-full bg-muted animate-pulse rounded-lg" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            {error?.message || "Failed to load property details. Please try again."}
          </p>
        )}

        {!isLoading && !isError && property && (
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <PropertyImageCarousel
                  images={images}
                  propertyTitle={property.title}
                  className="h-56 md:h-72"
                />
              </div>

              {property.description && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Key details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-medium">{formatPrice(property)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">
                      {property.property_type.toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transaction</p>
                    <p className="font-medium capitalize">
                      {property.transaction_type.toLowerCase()}
                    </p>
                  </div>
                  {property.security_deposit !== null && (
                    <div>
                      <p className="text-xs text-muted-foreground">Security Deposit</p>
                      <p className="font-medium">
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

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Location</h3>
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Submitted {formatRelativeDate(property.created_at)}</span>
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  ID: <span className="font-mono text-[11px] break-all">{property.id}</span>
                </p> */}
              </div>

              {property.verification_status === "RED" && property.admin_feedback && (
                <div className="mt-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
                  <p className="text-xs text-red-800 dark:text-red-200">
                    <span className="font-medium">Admin feedback:</span> {property.admin_feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


