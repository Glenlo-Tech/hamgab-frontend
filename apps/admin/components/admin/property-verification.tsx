"use client"

import { useMemo, useState } from "react"
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
} from "lucide-react"
import { useVerificationQueue } from "@/hooks/use-verification-queue"
import {
  VerificationQueueProperty,
  updatePropertyStatus,
  updatePropertyVisibility,
} from "@/lib/admin-properties"
import { useToast } from "@/hooks/use-toast"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Property Verification</h1>
            <p className="text-muted-foreground mt-1">Review and approve pending property listings</p>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            {filteredProperties.length} Pending
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by property, location, or agent email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
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
          <Card className="bg-muted/50">
            <CardContent className="p-10 text-center space-y-2">
              <CheckCircle className="h-10 w-10 mx-auto text-green-600 mb-2" />
              <h3 className="font-semibold text-lg">No properties in the verification queue</h3>
              <p className="text-muted-foreground text-sm">
                Once agents submit new listings for review, they will appear here.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {!isLoading && !error && filteredProperties.length > 0 && (
        <StaggerContainer className="grid gap-4">
          {filteredProperties.map((property) => (
          <StaggerItem key={property.id}>
            <Card className="overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="relative h-48 lg:h-auto lg:w-72 flex-shrink-0">
                  <Image
                    src={property.media[0]?.file_path || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Pending Review
                  </Badge>
                </div>
                <CardContent className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {property.locations[0]?.address ||
                            property.locations[0]?.city ||
                            property.locations[0]?.country ||
                            "Location not specified"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{property.agent_email}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          {property.media.length} photos
                        </span>
                        <span className="flex items-center gap-1">
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

                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent cursor-pointer"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Details
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 cursor-pointer"
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
                <DialogDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedProperty.locations[0]?.address ||
                    selectedProperty.locations[0]?.city ||
                    selectedProperty.locations[0]?.country ||
                    "Location not specified"}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="space-y-3">
                  <Carousel className="w-full">
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
                        <CarouselPrevious className="left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white border-none shadow-lg" />
                        <CarouselNext className="right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white border-none shadow-lg" />
                      </>
                    )}
                  </Carousel>
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
                      {selectedProperty.agent_email
                        .split("@")[0]
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{selectedProperty.agent_email}</p>
                      <p className="text-sm text-muted-foreground">
                        Property ID: {selectedProperty.id}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <Badge
                      variant="outline"
                      className="border border-red-500/60 text-red-700"
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
                          className="text-xs text-primary hover:underline"
                        >
                          View
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
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {selectedProperty.verification_status === "RED" && (
                        <Button
                          variant="outline"
                          onClick={handleMarkUnderReview}
                          disabled={isStatusUpdating}
                          className="sm:w-auto bg-yellow-300 hover:bg-yellow-400 cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isStatusUpdating ? "Updating…" : "Mark as Under Review (YELLOW)"}
                        </Button>
                      )}
                      {/* <Button
                        variant="destructive"
                        onClick={() => {
                          setShowRejectDialog(true)
                        }}
                        className="sm:w-auto"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button> */}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700 min-w-[170px] cursor-pointer"
                        onClick={handleApprove}
                        disabled={isStatusUpdating}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isStatusUpdating ? "Approving…" : "Approve Property (GREEN)"}
                      </Button>
                    </div>
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
              {isStatusUpdating ? "Submitting…" : "Reject Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
