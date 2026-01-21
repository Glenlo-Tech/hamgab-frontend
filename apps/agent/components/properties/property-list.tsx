/**
 * Property List Component
 * Displays a list of properties with loading and empty states
 */

"use client"

import { Property } from "@/lib/properties"
import { PropertyCard } from "./property-card"
import { PropertyCardSkeletonList } from "./property-card-skeleton"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Building2, AlertCircle } from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Button } from "@/components/ui/button"

interface PropertyListProps {
  properties: Property[]
  isLoading: boolean
  isError: boolean
  error?: Error
  onView?: (property: Property) => void
  onEdit?: (property: Property) => void
  filterStatus?: "all" | "GREEN" | "YELLOW" | "RED"
  onRetry?: () => void
}

export function PropertyList({
  properties,
  isLoading,
  isError,
  error,
  onView,
  onEdit,
  filterStatus = "all",
  onRetry,
}: PropertyListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <PropertyCardSkeletonList count={6} />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <Empty>
        <EmptyContent>
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <EmptyHeader>
            <EmptyTitle>Failed to load properties</EmptyTitle>
            <EmptyDescription>
              {error?.message || "An error occurred while fetching your properties. Please try again."}
            </EmptyDescription>
          </EmptyHeader>
          {typeof onRetry === "function" && (
            <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
              Retry loading properties
            </Button>
          )}
        </EmptyContent>
      </Empty>
    )
  }

  // Empty state
  if (properties.length === 0) {
    // Context-aware empty state messages based on filter
    const getEmptyStateContent = () => {
      if (filterStatus === "all") {
        return {
          title: "No properties found",
          description: "You haven't submitted any properties yet. Start by creating your first listing.",
        }
      }
      
      if (filterStatus === "GREEN") {
        return {
          title: "No verified & public properties yet",
          description:
            "You don't have any verified, publicly visible properties yet. Once a listing is certified, it will appear here.",
        }
      }
      
      if (filterStatus === "YELLOW") {
        return {
          title: "No properties under review",
          description:
            "You don't have any properties currently under admin review. Check back later or submit a new listing for review.",
        }
      }
      
      if (filterStatus === "RED") {
        return {
          title: "No properties need attention",
          description:
            "Nice work! None of your properties currently require attention. New, unverified listings will show up here.",
        }
      }
      
      return {
        title: "No properties found",
        description: "No properties match your current filter. Try selecting a different status.",
      }
    }
    
    const emptyContent = getEmptyStateContent()
    
    return (
      <Empty>
        <EmptyContent>
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <EmptyHeader>
            <EmptyTitle>{emptyContent.title}</EmptyTitle>
            <EmptyDescription>
              {emptyContent.description}
            </EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    )
  }

  // Properties list
  return (
    <StaggerContainer className="space-y-4">
      {properties.map((property) => (
        <StaggerItem key={property.id}>
          <PropertyCard property={property} onView={onView} onEdit={onEdit} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}

