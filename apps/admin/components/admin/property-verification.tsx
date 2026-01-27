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
import { VerificationQueueProperty } from "@/lib/admin-properties"
import { useToast } from "@/hooks/use-toast"
 
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
 
  const handleApprove = () => {
    // Placeholder – approval endpoint not provided yet
    toast({
      title: "Coming soon",
      description: "Property approval will be wired once the endpoint is available.",
    })
    setSelectedProperty(null)
  }
 
  const handleReject = () => {
    // Placeholder – rejection endpoint not provided yet
    toast({
      title: "Coming soon",
      description: "Property rejection will be wired once the endpoint is available.",
    })
    setShowRejectDialog(false)
    setSelectedProperty(null)
    setRejectionReason("")
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
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Details
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => setSelectedProperty(property)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
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

      <Dialog open={!!selectedProperty && !showRejectDialog} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mt-4">
                <Image
                  src={selectedProperty.media[0]?.file_path || "/placeholder.svg"}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
              </div>

              {selectedProperty.media.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {selectedProperty.media.slice(1).map((media) => (
                    <div
                      key={media.id}
                      className="relative h-20 w-28 rounded-md overflow-hidden border flex-shrink-0 bg-muted"
                    >
                      <Image
                        src={media.file_path}
                        alt={selectedProperty.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

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

              <DialogFooter className="mt-6">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowRejectDialog(true)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Property
                </Button>
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
                <Textarea placeholder="Provide additional details for the agent..." rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
