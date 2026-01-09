"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Search, MapPin, User, Eye, CheckCircle, XCircle, Bed, Bath, Square, ImageIcon, FileText } from "lucide-react"
import Image from "next/image"

const pendingProperties = [
  {
    id: 1,
    title: "Luxury Penthouse",
    address: "100 Park Avenue, New York, NY 10017",
    agent: { name: "Sarah Johnson", email: "sarah@hamgab.com" },
    price: "$8,500/mo",
    type: "Apartment",
    beds: 3,
    baths: 3,
    sqft: 3200,
    submitted: "2 hours ago",
    images: ["/luxury-penthouse-city-skyline-view.jpg"],
    documents: ["ownership.pdf", "inspection.pdf"],
    description:
      "Stunning penthouse with panoramic city views, private terrace, and premium finishes throughout. Features floor-to-ceiling windows, chef's kitchen, and smart home technology.",
  },
  {
    id: 2,
    title: "Beach Villa",
    address: "456 Ocean Drive, Miami Beach, FL 33139",
    agent: { name: "Mike Chen", email: "mike@hamgab.com" },
    price: "$2,500,000",
    type: "Villa",
    beds: 5,
    baths: 4,
    sqft: 4500,
    submitted: "5 hours ago",
    images: ["/luxury-waterfront-villa-with-pool-miami-style.jpg"],
    documents: ["title.pdf", "survey.pdf"],
    description:
      "Magnificent waterfront villa with private pool, direct ocean access, and stunning sunset views. Features marble floors, gourmet kitchen, and outdoor entertainment area.",
  },
  {
    id: 3,
    title: "Downtown Condo",
    address: "200 Pike Street, Seattle, WA 98101",
    agent: { name: "Emily Davis", email: "emily@hamgab.com" },
    price: "$3,200/mo",
    type: "Condo",
    beds: 2,
    baths: 2,
    sqft: 1100,
    submitted: "1 day ago",
    images: ["/modern-condo-seattle-downtown-view.jpg"],
    documents: ["hoa.pdf"],
    description:
      "Modern condo in the heart of downtown with mountain and water views. Walking distance to Pike Place Market and all amenities.",
  },
]

export function PropertyVerification() {
  const [selectedProperty, setSelectedProperty] = useState<(typeof pendingProperties)[0] | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = () => {
    setSelectedProperty(null)
  }

  const handleReject = () => {
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
            {pendingProperties.length} Pending
          </Badge>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by property or agent..." className="pl-9" />
          </div>
          <Select defaultValue="newest">
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

      <StaggerContainer className="grid gap-4">
        {pendingProperties.map((property) => (
          <StaggerItem key={property.id}>
            <Card className="overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="relative h-48 lg:h-auto lg:w-72 flex-shrink-0">
                  <Image
                    src={property.images[0] || "/placeholder.svg"}
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
                          {property.address}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{property.agent.name}</span>
                        <span className="text-muted-foreground">{property.agent.email}</span>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          {property.beds} beds
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-4 w-4 text-muted-foreground" />
                          {property.baths} baths
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="h-4 w-4 text-muted-foreground" />
                          {property.sqft.toLocaleString()} sqft
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          {property.images.length} photos
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {property.documents.length} documents
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{property.price}</p>
                        <p className="text-xs text-muted-foreground">{property.type}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Submitted {property.submitted}</p>
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

      {pendingProperties.length === 0 && (
        <FadeIn>
          <Card className="bg-muted/50">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-semibold text-lg">All Caught Up!</h3>
              <p className="text-muted-foreground mt-1">There are no properties pending verification.</p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      <Dialog open={!!selectedProperty && !showRejectDialog} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProperty.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedProperty.address}
                </DialogDescription>
              </DialogHeader>

              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mt-4">
                <Image
                  src={selectedProperty.images[0] || "/placeholder.svg"}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Bed className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="font-semibold">{selectedProperty.beds}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Bath className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="font-semibold">{selectedProperty.baths}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Square className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Square Feet</p>
                  <p className="font-semibold">{selectedProperty.sqft.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold text-lg">{selectedProperty.price}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedProperty.description}</p>
              </div>

              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Agent Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {selectedProperty.agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium">{selectedProperty.agent.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedProperty.agent.email}</p>
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
                    {selectedProperty.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5" />
                          <span className="text-sm font-medium">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
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
                <p className="text-sm text-muted-foreground">{selectedProperty.address}</p>
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
