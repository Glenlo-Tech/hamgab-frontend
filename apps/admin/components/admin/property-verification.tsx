"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import {
  Search,
  MapPin,
  User,
  Eye,
  CheckCircle,
  XCircle,
  ImageIcon,
  FileText,
  Download,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { useVerificationQueue } from "@/hooks/use-verification-queue"
import {
  VerificationQueueProperty,
  updatePropertyStatus,
  updatePropertyVisibility,
  type VerificationStatus,
} from "@/lib/admin-properties"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
 
type SortOption = "newest" | "oldest" | "price-high" | "price-low"
 
export function PropertyVerification() {
  const { toast } = useToast()
  const { properties, isLoading, error, refresh } = useVerificationQueue({
    page: 1,
    page_size: 20,
  })
 
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
 
  const [selectedProperty, setSelectedProperty] =
    useState<VerificationQueueProperty | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [approvalNotes, setApprovalNotes] = useState("")
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)
  const [isVisibilityUpdating, setIsVisibilityUpdating] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  // Generate Google Maps URL from latitude and longitude
  const getGoogleMapsUrl = (latitude: number | null, longitude: number | null): string | undefined => {
    if (latitude == null || longitude == null) return undefined
    return `https://www.google.com/maps?q=${latitude},${longitude}`
  }

  // Format location address string
  const formatLocationAddress = (
    location: VerificationQueueProperty["locations"][0] | undefined
  ): string => {
    if (!location) return "Location not specified"

    const parts: string[] = []
    if (location.address) parts.push(location.address.trim())
    if (location.city) parts.push(location.city.trim())
    if (location.state) parts.push(location.state.trim())
    if (location.country) parts.push(location.country.trim())

    return parts.length > 0 ? parts.join(", ") : "Location not specified"
  }

  // Track carousel slide changes
  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setCurrentImageIndex(carouselApi.selectedScrollSnap())
    }

    carouselApi.on("select", onSelect)
    onSelect() // Set initial index

    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  // Reset carousel index when property changes
  useEffect(() => {
    if (selectedProperty) {
      setCurrentImageIndex(0)
      carouselApi?.scrollTo(0)
    }
  }, [selectedProperty?.id, carouselApi])
 
  const filteredProperties = useMemo(() => {
    const withSearch = properties.filter((property) => {
      if (!search) return true
      const query = search.toLowerCase()
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
 
    return withSearch.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      const priceA = a.price ?? 0
      const priceB = b.price ?? 0
      if (sortBy === "price-high") {
        return priceB - priceA
      }
      if (sortBy === "price-low") {
        return priceA - priceB
      }
      return 0
    })
  }, [properties, search, sortBy])
  const handleApprove = async () => {
    if (!selectedProperty || isStatusUpdating) return
    setIsStatusUpdating(true)
    try {
      const updated = await updatePropertyStatus(
        selectedProperty.id,
        "GREEN",
        approvalNotes.trim() || "Approved"
      )
      toast({
        title: "Property approved",
        description: "The property has been marked as GREEN (certified).",
      })
      // Keep dialog open with updated data so admin can optionally toggle visibility
      setSelectedProperty(updated)
      setApprovalNotes("")
      await refresh()
    } catch (error) {
      toast({
        title: "Failed to approve property",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStatusUpdating(false)
    }
  }

  const handleMarkUnderReview = async () => {
    if (!selectedProperty || isStatusUpdating) return
    setIsStatusUpdating(true)
    try {
      const updated = await updatePropertyStatus(
        selectedProperty.id,
        "YELLOW",
        "Property moved to YELLOW (under review)."
      )
      toast({
        title: "Marked as under review",
        description: "The property is now in YELLOW status (under admin review).",
      })
      setSelectedProperty(updated)
      await refresh()
    } catch (error) {
      toast({
        title: "Failed to mark as under review",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStatusUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!selectedProperty || isStatusUpdating || !rejectionReason.trim()) return
    setIsStatusUpdating(true)
    try {
      await updatePropertyStatus(selectedProperty.id, "RED", rejectionReason.trim())
      toast({
        title: "Feedback sent",
        description:
          "The property remains RED and the agent will see your feedback for required changes.",
      })
      setShowRejectDialog(false)
      setSelectedProperty(null)
      setRejectionReason("")
      await refresh()
    } catch (error) {
      toast({
        title: "Failed to submit feedback",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStatusUpdating(false)
    }
  }

  const handleToggleVisibility = async () => {
    if (!selectedProperty || selectedProperty.verification_status !== "GREEN") return
    if (isVisibilityUpdating) return
    setIsVisibilityUpdating(true)
    try {
      const nextVisibility =
        selectedProperty.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC"
      const updated = await updatePropertyVisibility(
        selectedProperty.id,
        nextVisibility
      )
      setSelectedProperty(updated)
      toast({
        title: "Visibility updated",
        description:
          updated.visibility === "PUBLIC"
            ? "The property is now publicly visible."
            : "The property is now private.",
      })
      await refresh()
    } catch (error) {
      toast({
        title: "Failed to update visibility",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVisibilityUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Property Verification
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">Review and approve pending property listings</p>
          </div>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-400 border-2 border-amber-200/50 px-4 py-1.5 text-base font-semibold"
          >
            {filteredProperties.length} Pending
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Search by property, location, or agent email..."
              className="pl-10 h-11 border-2 focus:border-primary/50 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-11 border-2">
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

      {isLoading && (
        <div className="rounded-lg border bg-muted/40 p-6 text-sm text-muted-foreground">
          Loading verification queue…
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 flex items-center justify-between gap-4 text-sm">
          <span>Failed to load verification queue. Please try again.</span>
          <Button size="sm" variant="outline" onClick={() => void refresh()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !error && filteredProperties.length === 0 && (
        <FadeIn>
          <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200/50 shadow-lg">
            <CardContent className="p-12 text-center space-y-3">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-xl">No properties in the verification queue</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Once agents submit new listings for review, they will appear here.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {!isLoading && !error && filteredProperties.length > 0 && (
        <StaggerContainer className="grid gap-5">
          {filteredProperties.map((property) => (
          <StaggerItem key={property.id}>
            <Card className="overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-amber-50/20 dark:from-card dark:to-amber-950/10">
              <div className="flex flex-col lg:flex-row">
                <div className="relative h-56 lg:h-auto lg:w-80 flex-shrink-0 border-r-2 border-border/50">
                  <Image
                    src={property.media[0]?.file_path || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg font-semibold px-3 py-1">
                    Pending Review
                  </Badge>
                </div>
                <CardContent className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{formatLocationAddress(property.locations[0])}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 text-sm p-2 rounded-lg bg-muted/50">
                        <User className="h-4 w-4 text-purple-600" />
                        <span className="text-muted-foreground font-medium">{property.agent_email}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-medium">
                          <ImageIcon className="h-4 w-4" />
                          {property.media.length} photos
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 font-medium">
                          <FileText className="h-4 w-4" />
                          {property.documents.length} documents
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {property.price != null
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "XAF",
                                maximumFractionDigits: 0,
                              }).format(property.price)
                            : "Price on request"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.property_type} • {property.transaction_type}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted {new Date(property.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1 border-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors font-semibold"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Details
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                      onClick={() => {
                        setSelectedProperty(property)
                        setShowRejectDialog(true)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </StaggerItem>
        ))}
        </StaggerContainer>
      )}

      <Dialog
        open={!!selectedProperty && !showRejectDialog}
        onOpenChange={() => setSelectedProperty(null)}
      >
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

                    {/* Image Counter Overlay */}
                    {selectedProperty.media.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1.5 rounded-md backdrop-blur-sm z-10">
                        {currentImageIndex + 1} / {selectedProperty.media.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
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
                    <h4 className="font-semibold mb-1 text-foreground">Quick summary</h4>
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
                    <h4 className="font-semibold mb-1 text-foreground">Submitted</h4>
                    <p>{new Date(selectedProperty.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">
                  {selectedProperty.description || "No description provided."}
                </p>
              </div>

              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Agent Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {(() => {
                        const email = selectedProperty.agent_email
                        if (email && typeof email === "string") {
                          const localPart = email.split("@")[0] || ""
                          if (localPart) {
                            return localPart.slice(0, 2).toUpperCase()
                          }
                        }
                        return "AG"
                      })()}
                    </div>
                    <div>
                      <p className="font-medium">
                        {selectedProperty.agent_email || "Unknown agent"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Property ID: {selectedProperty.id}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <Badge
                      variant="outline"
                      className={getVerificationStatusBadgeClasses(
                        selectedProperty.verification_status
                      )}
                    >
                      Status: {selectedProperty.verification_status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border border-blue-500/60 text-blue-700"
                    >
                      Visibility: {selectedProperty.visibility}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

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

              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedProperty.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5" />
                          <span className="text-sm font-medium">{doc.file_name}</span>
                          <span className="text-xs text-muted-foreground uppercase">
                            {doc.document_type}
                          </span>
                        </div>
                        <a
                          href={doc.file_path}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs flex items-center justify-center gap-2 text-primary hover:underline"
                        >
                          Download
                          <Download width="12px" height="12px" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedProperty.verification_status === "GREEN" && (
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Public Visibility</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Toggle whether this certified property is visible on the public listings.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleVisibility}
                      disabled={isVisibilityUpdating}
                      className="cursor-pointer"
                    >
                      {isVisibilityUpdating && (
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      )}
                      {isVisibilityUpdating
                        ? "Updating..."
                        : selectedProperty.visibility === "PUBLIC"
                          ? "Set to Private"
                          : "Set to Public"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              <DialogFooter className="mt-6">
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Approval notes (optional, shared with the agent)
                    </p>
                    <Textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Add any helpful context for the agent about this approval…"
                      className="min-h-[72px] w-full"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    {(() => {
                      const allowedTransitions = getAllowedStatusTransitions(
                        selectedProperty.verification_status
                      )
                      const canApprove = allowedTransitions.includes("GREEN")
                      const canMarkYellow = allowedTransitions.includes("YELLOW")

                      if (selectedProperty.verification_status === "GREEN") {
                        return (
                          <div className="w-full">
                            <p className="text-sm text-muted-foreground mb-3">
                              This property is already GREEN (certified). Status cannot be downgraded. Only visibility can be changed.
                            </p>
                          </div>
                        )
                      }

                      return (
                        <>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            {canMarkYellow && (
                              <Button
                                variant="outline"
                                onClick={handleMarkUnderReview}
                                disabled={isStatusUpdating}
                                className="sm:w-auto bg-yellow-300 hover:bg-yellow-400 cursor-pointer"
                              >
                                {isStatusUpdating ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                {isStatusUpdating ? "Updating…" : "Mark as Under Review (YELLOW)"}
                              </Button>
                            )}
                          </div>
                          {canApprove && (
                            <div className="flex justify-end">
                              <Button
                                className="bg-green-600 hover:bg-green-700 min-w-[170px] cursor-pointer"
                                onClick={handleApprove}
                                disabled={isStatusUpdating}
                              >
                                {isStatusUpdating ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                {isStatusUpdating ? "Approving…" : "Approve Property (GREEN)"}
                              </Button>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this property listing.</DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedProperty.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProperty.locations[0]?.address ||
                    selectedProperty.locations[0]?.city ||
                    selectedProperty.locations[0]?.country ||
                    "Location not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Rejection Reason</label>
                <Select onValueChange={setRejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missing-docs">Missing Documents</SelectItem>
                    <SelectItem value="incorrect-info">Incorrect Information</SelectItem>
                    <SelectItem value="poor-quality">Poor Quality Images</SelectItem>
                    <SelectItem value="duplicate">Duplicate Listing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Additional Notes</label>
                <Textarea
                  placeholder="Provide additional details for the agent..."
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isStatusUpdating || !rejectionReason.trim()}
            >
              {isStatusUpdating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {isStatusUpdating ? "Submitting…" : "Reject Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
