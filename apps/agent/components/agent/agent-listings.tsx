"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FadeIn } from "@/components/motion-wrapper"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { useKYCStatus } from "@/hooks/use-kyc-status"
import { useProperties } from "@/hooks/use-properties"
import { PropertyList } from "@/components/properties/property-list"
import { PaginationControls } from "@/components/properties/pagination-controls"
import { PropertyDetailsDialog } from "@/components/properties/property-details-dialog"
import { Property } from "@/lib/properties"

type StatusFilter = "all" | "GREEN" | "YELLOW" | "RED"

export function AgentListings() {
  const { kycStatus, kycApproved } = useKYCStatus()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const pageSize = 20

  // Fetch properties
  const { properties, isLoading, isError, error, meta, refresh } = useProperties(
    currentPage,
    pageSize
  )

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.verification_status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.locations?.[0]?.address?.toLowerCase().includes(query) ||
          p.locations?.[0]?.city?.toLowerCase().includes(query) ||
          p.locations?.[0]?.state?.toLowerCase().includes(query)
      )
    }

    // Sort properties
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "price-high":
          return (b.price || 0) - (a.price || 0)
        case "price-low":
          return (a.price || 0) - (b.price || 0)
        default:
          return 0
      }
    })

    return sorted
  }, [properties, statusFilter, searchQuery, sortBy])

  // Count properties by status
  const statusCounts = useMemo(() => {
    return {
      all: properties.length,
      GREEN: properties.filter((p) => p.verification_status === "GREEN").length,
      YELLOW: properties.filter((p) => p.verification_status === "YELLOW").length,
      RED: properties.filter((p) => p.verification_status === "RED").length,
    }
  }, [properties])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as StatusFilter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Handle property actions
  const handleViewProperty = (property: Property) => {
    setSelectedPropertyId(property.id)
    setIsDetailsOpen(true)
  }

  const handleEditProperty = (property: Property) => {
    // TODO: Navigate to edit property page
    console.log("Edit property:", property.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground mt-1">Manage and track all your property submissions</p>
          </div>
          {kycApproved ? (
            <Button asChild>
              <Link href="/submit">
                <Plus className="h-4 w-4 mr-2" />
                New Listing
              </Link>
            </Button>
          ) : (
            <Button
              disabled
              variant="outline"
              title={
                kycStatus?.status === "PENDING"
                  ? "KYC verification pending approval"
                  : "Please complete KYC verification to submit listings"
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          )}
        </div>
      </FadeIn>

      {/* Search and Sort */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings by title, description, or location..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      {/* Status Tabs */}
      <FadeIn delay={0.2}>
        <Tabs value={statusFilter} onValueChange={handleStatusFilterChange} className="w-full">
          <div className="px-1 sm:px-0">
            <TabsList
              className="flex flex-wrap gap-2 sm:gap-3 h-auto w-full sm:w-auto bg-muted/50 p-1.5 sm:p-1 rounded-lg border border-border/50"
            >
              <TabsTrigger
                value="all"
                className="flex-1 sm:flex-initial px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
              >
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger
                value="GREEN"
                className="flex-1 sm:flex-initial px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
              >
                Verified ({statusCounts.GREEN})
              </TabsTrigger>
              <TabsTrigger
                value="YELLOW"
                className="flex-1 sm:flex-initial px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
              >
                Pending ({statusCounts.YELLOW})
              </TabsTrigger>
              <TabsTrigger
                value="RED"
                className="flex-1 sm:flex-initial px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
              >
                Needs Attention ({statusCounts.RED})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Properties List */}
          <TabsContent value={statusFilter} className="mt-6">
            <PropertyList
              properties={filteredAndSortedProperties}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onView={handleViewProperty}
              onEdit={handleEditProperty}
            />

            {/* Pagination - Only show if not filtering/searching (using API pagination) */}
            {statusFilter === "all" && !searchQuery && meta && meta.total_pages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={meta.total_pages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </TabsContent>
        </Tabs>
      </FadeIn>

      {/* Property Details Dialog */}
      <PropertyDetailsDialog
        propertyId={selectedPropertyId}
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open)
          if (!open) {
            setSelectedPropertyId(null)
          }
        }}
      />
    </div>
  )
}
