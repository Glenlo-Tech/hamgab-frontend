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

interface PropertyListProps {
  properties: Property[]
  isLoading: boolean
  isError: boolean
  error?: Error
  onView?: (property: Property) => void
  onEdit?: (property: Property) => void
}

export function PropertyList({
  properties,
  isLoading,
  isError,
  error,
  onView,
  onEdit,
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
        </EmptyContent>
      </Empty>
    )
  }

  // Empty state
  if (properties.length === 0) {
    return (
      <Empty>
        <EmptyContent>
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <EmptyHeader>
            <EmptyTitle>No properties found</EmptyTitle>
            <EmptyDescription>
              You haven't submitted any properties yet. Start by creating your first listing.
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

