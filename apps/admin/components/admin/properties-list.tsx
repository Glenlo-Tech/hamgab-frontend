"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FadeIn } from "@/components/motion-wrapper"
import {
  Search,
  MapPin,
  Eye,
  Building2,
  Calendar,
  Filter,
  X,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { useAdminProperties } from "@/hooks/use-admin-properties"
import {
  VerificationQueueProperty,
  type VerificationStatus,
  type Visibility,
  AllPropertiesFilters,
  updatePropertyStatus,
  updatePropertyVisibility,
} from "@/lib/admin-properties"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useEffect } from "react"

export function PropertiesList() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<AllPropertiesFilters>({
    page: 1,
    page_size: 20,
  })
  const [updatingPropertyId, setUpdatingPropertyId] = useState<string | null>(null)

  const [verificationStatusFilter, setVerificationStatusFilter] =
    useState<VerificationStatus | "all">("all")
  const [visibilityFilter, setVisibilityFilter] = useState<Visibility | "all">("all")
  const [cityFilter, setCityFilter] = useState("")
  const [countryFilter, setCountryFilter] = useState("")
  const [dateFromFilter, setDateFromFilter] = useState("")
  const [dateToFilter, setDateToFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const [selectedProperty, setSelectedProperty] =
    useState<VerificationQueueProperty | null>(null)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { properties, meta, isLoading, error, refresh } = useAdminProperties({
    ...filters,
    page,
    page_size: 20,
  })

  // Update filters when filter states change
  useEffect(() => {
    const newFilters: AllPropertiesFilters = {
      page,
      page_size: 20,
    }

    if (verificationStatusFilter !== "all") {
      newFilters.verification_status = verificationStatusFilter
    }
    if (visibilityFilter !== "all") {
      newFilters.visibility = visibilityFilter
    }
    if (cityFilter.trim()) {
      newFilters.city = cityFilter.trim()
    }
    if (countryFilter.trim()) {
      newFilters.country = countryFilter.trim()
    }
    if (dateFromFilter) {
      newFilters.date_from = dateFromFilter
    }
    if (dateToFilter) {
      newFilters.date_to = dateToFilter
    }

    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }, [
    verificationStatusFilter,
    visibilityFilter,
    cityFilter,
    countryFilter,
    dateFromFilter,
    dateToFilter,
  ])

  // Track carousel slide changes
  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setCurrentImageIndex(carouselApi.selectedScrollSnap())
    }

    carouselApi.on("select", onSelect)
    onSelect()

    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  useEffect(() => {
    if (selectedProperty) {
      setCurrentImageIndex(0)
      carouselApi?.scrollTo(0)
    }
  }, [selectedProperty?.id, carouselApi])

  const filteredProperties = useMemo(() => {
    if (!search) return properties

    const query = search.toLowerCase()
    return properties.filter((property) => {
      const location = property.locations[0]
      const city = location?.city || ""
      const country = location?.country || ""

      return (
        property.title.toLowerCase().includes(query) ||
        (property.description || "").toLowerCase().includes(query) ||
        property.agent_email.toLowerCase().includes(query) ||
        city.toLowerCase().includes(query) ||
        country.toLowerCase().includes(query)
      )
    })
  }, [properties, search])

  const getVerificationStatusBadgeClasses = (status: VerificationStatus) => {
    switch (status) {
      case "GREEN":
        return "border-green-500/60 text-green-700 bg-green-50"
      case "YELLOW":
        return "border-amber-500/60 text-amber-700 bg-amber-50"
      case "RED":
      default:
        return "border-red-500/60 text-red-700 bg-red-50"
    }
  }

  // Generate Google Maps URL from latitude and longitude
  const getGoogleMapsUrl = (latitude: number | null, longitude: number | null): string | undefined => {
    if (latitude == null || longitude == null) return undefined
    return `https://www.google.com/maps?q=${latitude},${longitude}`
  }

  // Format location address string
  const formatLocationAddress = (location: VerificationQueueProperty["locations"][0] | undefined): string => {
    if (!location) return "Location not specified"
    
    const parts: string[] = []
    if (location.address) parts.push(location.address.trim())
    if (location.city) parts.push(location.city.trim())
    if (location.state) parts.push(location.state.trim())
    if (location.country) parts.push(location.country.trim())
    
    return parts.length > 0 ? parts.join(", ") : "Location not specified"
  }

  // Get allowed status transitions (only upward: RED → YELLOW → GREEN)
  const getAllowedStatusTransitions = (currentStatus: VerificationStatus): VerificationStatus[] => {
    switch (currentStatus) {
      case "RED":
        return ["YELLOW", "GREEN"] // RED can move to YELLOW or GREEN
      case "YELLOW":
        return ["GREEN"] // YELLOW can only move to GREEN
      case "GREEN":
        return [] // GREEN cannot be downgraded
      default:
        return []
    }
  }

  const hasActiveFilters =
    verificationStatusFilter !== "all" ||
    visibilityFilter !== "all" ||
    cityFilter.trim() !== "" ||
    countryFilter.trim() !== "" ||
    dateFromFilter !== "" ||
    dateToFilter !== ""

  const clearFilters = () => {
    setVerificationStatusFilter("all")
    setVisibilityFilter("all")
    setCityFilter("")
    setCountryFilter("")
    setDateFromFilter("")
    setDateToFilter("")
  }

  const handleUpdateStatus = async (
    propertyId: string,
    status: VerificationStatus,
    propertyTitle: string
  ) => {
    if (updatingPropertyId) return
    setUpdatingPropertyId(propertyId)
    try {
      const updated = await updatePropertyStatus(propertyId, status)
      toast({
        title: "Status updated",
        description: `${propertyTitle} status has been updated to ${status}.`,
      })
      await refresh()
      // Update selected property if it's the one being updated
      if (selectedProperty?.id === propertyId) {
        setSelectedProperty(updated)
      }
    } catch (error) {
      toast({
        title: "Failed to update status",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingPropertyId(null)
    }
  }

  const handleUpdateVisibility = async (
    propertyId: string,
    visibility: Visibility,
    propertyTitle: string
  ) => {
    if (updatingPropertyId) return
    setUpdatingPropertyId(propertyId)
    try {
      const updated = await updatePropertyVisibility(propertyId, visibility)
      toast({
        title: "Visibility updated",
        description: `${propertyTitle} visibility has been set to ${visibility}.`,
      })
      await refresh()
      // Update selected property if it's the one being updated
      if (selectedProperty?.id === propertyId) {
        setSelectedProperty(updated)
      }
    } catch (error) {
      toast({
        title: "Failed to update visibility",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingPropertyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              All Properties
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              View and manage all properties on the platform
            </p>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400 border-2 border-blue-200/50 px-4 py-1.5 text-base font-semibold">
            {meta?.total || 0} Total
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search by title, description, agent email, or location..."
                className="pl-10 h-11 border-2 focus:border-primary/50 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto h-11 border-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-purple-500 text-white border-0">
                  {[
                    verificationStatusFilter !== "all",
                    visibilityFilter !== "all",
                    cityFilter.trim() !== "",
                    countryFilter.trim() !== "",
                    dateFromFilter !== "",
                    dateToFilter !== "",
                  ].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <Card className="p-5 border-2 shadow-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Verification Status</label>
                  <Select
                    value={verificationStatusFilter}
                    onValueChange={(value: VerificationStatus | "all") =>
                      setVerificationStatusFilter(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="GREEN">Green (Certified)</SelectItem>
                      <SelectItem value="YELLOW">Yellow (Under Review)</SelectItem>
                      <SelectItem value="RED">Red (Rejected)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <Select
                    value={visibilityFilter}
                    onValueChange={(value: Visibility | "all") => setVisibilityFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Visibility</SelectItem>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Input
                    placeholder="Filter by city"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Country</label>
                  <Input
                    placeholder="Filter by country"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date From</label>
                  <Input
                    type="date"
                    value={dateFromFilter}
                    onChange={(e) => setDateFromFilter(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date To</label>
                  <Input
                    type="date"
                    value={dateToFilter}
                    onChange={(e) => setDateToFilter(e.target.value)}
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </FadeIn>

      {isLoading && (
        <div className="rounded-lg border bg-muted/40 p-6 text-sm text-muted-foreground">
          Loading properties…
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 flex items-center justify-between gap-4 text-sm">
          <span>Failed to load properties. Please try again.</span>
          <Button size="sm" variant="outline" onClick={() => void refresh()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !error && filteredProperties.length === 0 && (
        <FadeIn>
          <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-2 shadow-lg">
            <CardContent className="p-12 text-center space-y-3">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-xl">No properties found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {hasActiveFilters || search
                  ? "Try adjusting your filters or search query."
                  : "No properties have been submitted yet."}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {!isLoading && !error && filteredProperties.length > 0 && (
        <>
          <Card className="border-2 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Property</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Visibility</TableHead>
                      <TableHead className="font-semibold">Agent</TableHead>
                      <TableHead className="font-semibold">Location</TableHead>
                      <TableHead className="font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      <TableHead className="w-[100px] font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => {
                      const statusBadge = getVerificationStatusBadgeClasses(
                        property.verification_status
                      )
                      const location = property.locations[0]

                      return (
                        <TableRow
                          key={property.id}
                          className="hover:bg-muted/30 transition-colors border-b border-border/50"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border-2 border-border shadow-sm">
                                <Image
                                  src={property.media[0]?.file_path || "/placeholder.svg"}
                                  alt={property.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold truncate text-base">{property.title}</p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {property.property_type} • {property.transaction_type}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${statusBadge} font-semibold px-2.5 py-1 border-2`}
                            >
                              {property.verification_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`font-semibold px-2.5 py-1 border-2 ${
                                property.visibility === "PUBLIC"
                                  ? "border-blue-500/60 text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400"
                                  : "border-gray-500/60 text-gray-700 bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              {property.visibility}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p
                              className="text-sm font-medium truncate max-w-[150px]"
                              title={property.agent_email}
                            >
                              {property.agent_email}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 flex-shrink-0 text-blue-600" />
                                <span
                                  className="truncate max-w-[120px] font-medium"
                                  title={formatLocationAddress(location)}
                                >
                                  {location?.city || location?.country || "—"}
                                </span>
                              </div>
                              {location?.latitude != null && location?.longitude != null && (
                                <a
                                  href={getGoogleMapsUrl(location.latitude, location.longitude) ?? "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  View on Map
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-bold text-foreground">
                              {property.price != null
                                ? new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "XAF",
                                    maximumFractionDigits: 0,
                                  }).format(property.price)
                                : "—"}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(property.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProperty(property)}
                                className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={updatingPropertyId === property.id}
                                    className="hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/30"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuItem
                                    onClick={() => setSelectedProperty(property)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    Update Status
                                  </div>
                                  {(() => {
                                    const allowedTransitions = getAllowedStatusTransitions(
                                      property.verification_status
                                    )
                                    if (allowedTransitions.length === 0) {
                                      return (
                                        <DropdownMenuItem disabled className="text-muted-foreground">
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Status cannot be changed (GREEN is final)
                                        </DropdownMenuItem>
                                      )
                                    }
                                    return (
                                      <>
                                        {allowedTransitions.includes("GREEN") && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleUpdateStatus(
                                                property.id,
                                                "GREEN",
                                                property.title
                                              )
                                            }
                                            disabled={updatingPropertyId === property.id}
                                            className="text-green-600"
                                          >
                                            {updatingPropertyId === property.id ? (
                                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                            )}
                                            {updatingPropertyId === property.id
                                              ? "Updating..."
                                              : "Mark as GREEN (Certified)"}
                                          </DropdownMenuItem>
                                        )}
                                        {allowedTransitions.includes("YELLOW") && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleUpdateStatus(
                                                property.id,
                                                "YELLOW",
                                                property.title
                                              )
                                            }
                                            disabled={updatingPropertyId === property.id}
                                            className="text-amber-600"
                                          >
                                            {updatingPropertyId === property.id ? (
                                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                              <AlertCircle className="h-4 w-4 mr-2" />
                                            )}
                                            {updatingPropertyId === property.id
                                              ? "Updating..."
                                              : "Mark as YELLOW (Under Review)"}
                                          </DropdownMenuItem>
                                        )}
                                        {allowedTransitions.includes("RED") && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleUpdateStatus(
                                                property.id,
                                                "RED",
                                                property.title
                                              )
                                            }
                                            disabled={updatingPropertyId === property.id}
                                            className="text-red-600"
                                          >
                                            {updatingPropertyId === property.id ? (
                                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                              <AlertCircle className="h-4 w-4 mr-2" />
                                            )}
                                            {updatingPropertyId === property.id
                                              ? "Updating..."
                                              : "Mark as RED (Rejected)"}
                                          </DropdownMenuItem>
                                        )}
                                      </>
                                    )
                                  })()}
                                  <DropdownMenuSeparator />
                                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    Update Visibility
                                  </div>
                                  {property.verification_status === "GREEN" && (
                                    <>
                                      {property.visibility !== "PUBLIC" && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateVisibility(
                                              property.id,
                                              "PUBLIC",
                                              property.title
                                            )
                                          }
                                          disabled={updatingPropertyId === property.id}
                                          className="text-blue-600"
                                        >
                                          {updatingPropertyId === property.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          ) : (
                                            <Globe className="h-4 w-4 mr-2" />
                                          )}
                                          {updatingPropertyId === property.id
                                            ? "Updating..."
                                            : "Set to Public"}
                                        </DropdownMenuItem>
                                      )}
                                      {property.visibility !== "PRIVATE" && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateVisibility(
                                              property.id,
                                              "PRIVATE",
                                              property.title
                                            )
                                          }
                                          disabled={updatingPropertyId === property.id}
                                          className="text-gray-600"
                                        >
                                          {updatingPropertyId === property.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          ) : (
                                            <Lock className="h-4 w-4 mr-2" />
                                          )}
                                          {updatingPropertyId === property.id
                                            ? "Updating..."
                                            : "Set to Private"}
                                        </DropdownMenuItem>
                                      )}
                                    </>
                                  )}
                                  {property.verification_status !== "GREEN" && (
                                    <DropdownMenuItem disabled className="text-muted-foreground">
                                      <Lock className="h-4 w-4 mr-2" />
                                      Only GREEN properties can change visibility
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * (meta.page_size || 20)) + 1} to{" "}
                {Math.min(page * (meta.page_size || 20), meta.total)} of {meta.total} properties
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
                  disabled={page >= meta.total_pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Property Details Dialog */}
      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProperty.title}</DialogTitle>
                <DialogDescription>
                  {formatLocationAddress(selectedProperty.locations[0])}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="space-y-3">
                  <div className="relative">
                    <Carousel className="w-full" setApi={setCarouselApi}>
                      <CarouselContent>
                        {selectedProperty.media.length > 0 ? (
                          selectedProperty.media.map((media) => (
                            <CarouselItem key={media.id}>
                              <div className="relative rounded-lg overflow-hidden bg-muted h-56 sm:h-64 lg:h-72">
                                <Image
                                  src={media.file_path}
                                  alt={selectedProperty.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </CarouselItem>
                          ))
                        ) : (
                          <CarouselItem>
                            <div className="relative rounded-lg overflow-hidden bg-muted h-56 sm:h-64 lg:h-72">
                              <Image
                                src="/placeholder.svg"
                                alt={selectedProperty.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </CarouselItem>
                        )}
                      </CarouselContent>
                      {selectedProperty.media.length > 1 && (
                        <>
                          <CarouselPrevious className="left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white border-none shadow-lg cursor-pointer z-10" />
                          <CarouselNext className="right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white border-none shadow-lg cursor-pointer z-10" />
                        </>
                      )}
                    </Carousel>

                    {selectedProperty.media.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1.5 rounded-md backdrop-blur-sm z-10">
                        {currentImageIndex + 1} / {selectedProperty.media.length}
                      </div>
                    )}
                  </div>

                  {selectedProperty.media.length > 1 && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {selectedProperty.media.map((media, index) => (
                          <button
                            key={media.id}
                            onClick={() => carouselApi?.scrollTo(index)}
                            className={cn(
                              "relative flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                              "h-16 w-16 sm:h-20 sm:w-20",
                              index === currentImageIndex
                                ? "border-primary scale-105 shadow-md ring-2 ring-primary/20"
                                : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
                            )}
                            aria-label={`Go to image ${index + 1}`}
                          >
                            <Image
                              src={media.file_path}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                            {index === currentImageIndex && (
                              <div className="absolute inset-0 bg-primary/10" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Quick Summary</h4>
                    <p>
                      Type: <span className="font-medium text-foreground">{selectedProperty.property_type}</span>
                    </p>
                    <p>
                      Transaction:{" "}
                      <span className="font-medium text-foreground">
                        {selectedProperty.transaction_type}
                      </span>
                    </p>
                    <p>
                      Price:{" "}
                      <span className="font-medium text-foreground">
                        {selectedProperty.price != null
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "XAF",
                              maximumFractionDigits: 0,
                            }).format(selectedProperty.price)
                          : "Price on request"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Status & Visibility</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className={getVerificationStatusBadgeClasses(
                          selectedProperty.verification_status
                        )}
                      >
                        {selectedProperty.verification_status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          selectedProperty.visibility === "PUBLIC"
                            ? "border-blue-500/60 text-blue-700 bg-blue-50"
                            : "border-gray-500/60 text-gray-700 bg-gray-50"
                        }
                      >
                        {selectedProperty.visibility}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const allowedTransitions = getAllowedStatusTransitions(
                          selectedProperty.verification_status
                        )
                        if (allowedTransitions.length === 0) {
                          return (
                            <p className="text-xs text-muted-foreground">
                              Status is GREEN (certified) and cannot be downgraded. Only visibility can be changed.
                            </p>
                          )
                        }
                        return (
                          <div className="flex flex-wrap gap-2">
                            {allowedTransitions.includes("GREEN") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(
                                    selectedProperty.id,
                                    "GREEN",
                                    selectedProperty.title
                                  )
                                }
                                disabled={updatingPropertyId === selectedProperty.id}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                Mark GREEN
                              </Button>
                            )}
                            {allowedTransitions.includes("YELLOW") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(
                                    selectedProperty.id,
                                    "YELLOW",
                                    selectedProperty.title
                                  )
                                }
                                disabled={updatingPropertyId === selectedProperty.id}
                                className="text-amber-600 border-amber-200 hover:bg-amber-50"
                              >
                                <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                                Mark YELLOW
                              </Button>
                            )}
                            {allowedTransitions.includes("RED") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(
                                    selectedProperty.id,
                                    "RED",
                                    selectedProperty.title
                                  )
                                }
                                disabled={updatingPropertyId === selectedProperty.id}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                                Mark RED
                              </Button>
                            )}
                          </div>
                        )
                      })()}
                      {selectedProperty.verification_status === "GREEN" && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          {selectedProperty.visibility !== "PUBLIC" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateVisibility(
                                  selectedProperty.id,
                                  "PUBLIC",
                                  selectedProperty.title
                                )
                              }
                              disabled={updatingPropertyId === selectedProperty.id}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                            >
                              {updatingPropertyId === selectedProperty.id ? (
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Globe className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              {updatingPropertyId === selectedProperty.id
                                ? "Updating..."
                                : "Set Public"}
                            </Button>
                          )}
                          {selectedProperty.visibility !== "PRIVATE" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateVisibility(
                                  selectedProperty.id,
                                  "PRIVATE",
                                  selectedProperty.title
                                )
                              }
                              disabled={updatingPropertyId === selectedProperty.id}
                              className="text-gray-600 border-gray-200 hover:bg-gray-50 cursor-pointer"
                            >
                              {updatingPropertyId === selectedProperty.id ? (
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              {updatingPropertyId === selectedProperty.id
                                ? "Updating..."
                                : "Set Private"}
                            </Button>
                          )}
                        </div>
                      )}
                      {selectedProperty.verification_status !== "GREEN" && (
                        <p className="text-xs text-muted-foreground pt-2 border-t">
                          Only GREEN (certified) properties can change visibility.
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Agent</h4>
                    <p>{selectedProperty.agent_email || "Unknown"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-foreground">Created</h4>
                    <p>{new Date(selectedProperty.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {selectedProperty.description && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedProperty.description}</p>
                </div>
              )}

              {/* Location Details Card */}
              {selectedProperty.locations[0] && (
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {selectedProperty.locations[0].address && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Address</p>
                          <p className="text-foreground">{selectedProperty.locations[0].address}</p>
                        </div>
                      )}
                      {selectedProperty.locations[0].city && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">City</p>
                          <p className="text-foreground">{selectedProperty.locations[0].city}</p>
                        </div>
                      )}
                      {selectedProperty.locations[0].state && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">State</p>
                          <p className="text-foreground">{selectedProperty.locations[0].state}</p>
                        </div>
                      )}
                      {selectedProperty.locations[0].country && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Country</p>
                          <p className="text-foreground">{selectedProperty.locations[0].country}</p>
                        </div>
                      )}
                      {selectedProperty.locations[0].postal_code && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Postal Code</p>
                          <p className="text-foreground">{selectedProperty.locations[0].postal_code}</p>
                        </div>
                      )}
                      {(selectedProperty.locations[0].latitude != null ||
                        selectedProperty.locations[0].longitude != null) && (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Coordinates</p>
                          <p className="text-foreground font-mono text-xs">
                            {selectedProperty.locations[0].latitude != null &&
                            selectedProperty.locations[0].longitude != null
                              ? `${selectedProperty.locations[0].latitude}, ${selectedProperty.locations[0].longitude}`
                              : selectedProperty.locations[0].latitude != null
                                ? `Lat: ${selectedProperty.locations[0].latitude}`
                                : selectedProperty.locations[0].longitude != null
                                  ? `Lng: ${selectedProperty.locations[0].longitude}`
                                  : "—"}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedProperty.locations[0].latitude != null &&
                      selectedProperty.locations[0].longitude != null && (
                        <div className="pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full sm:w-auto"
                          >
                            <a
                              href={
                                getGoogleMapsUrl(
                                  selectedProperty.locations[0].latitude,
                                  selectedProperty.locations[0].longitude
                                ) || "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Google Maps
                            </a>
                          </Button>
                        </div>
                      )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
