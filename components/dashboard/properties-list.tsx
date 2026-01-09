"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Search, CheckCircle, MapPin, User, MoreVertical, Trash2, AlertTriangle, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useState } from "react"

const properties = [
  {
    id: 1,
    title: "Downtown Apartment",
    address: "123 Main St, Apt 4B, New York, NY 10001",
    type: "Apartment",
    status: "Active",
    verified: true,
    agent: { name: "Sarah Johnson", email: "sarah@hamgab.com", phone: "+1 (555) 123-4567" },
    image: "/apartment-interior-modern-downtown.jpg",
    rent: "$2,500/mo",
    beds: 2,
    baths: 1,
  },
  {
    id: 2,
    title: "Suburban House",
    address: "456 Oak Lane, Austin, TX 78701",
    type: "House",
    status: "Active",
    verified: true,
    agent: { name: "Mike Chen", email: "mike@hamgab.com", phone: "+1 (555) 234-5678" },
    image: "/suburban-house-exterior-lawn.jpg",
    rent: "$3,200/mo",
    beds: 4,
    baths: 3,
  },
  {
    id: 3,
    title: "Beach Condo",
    address: "789 Ocean Blvd, Unit 12, Miami, FL 33139",
    type: "Condo",
    status: "Pending Verification",
    verified: false,
    agent: { name: "Emily Davis", email: "emily@hamgab.com", phone: "+1 (555) 345-6789" },
    image: "/beach-condo-balcony-view.jpg",
    rent: "$4,000/mo",
    beds: 2,
    baths: 2,
  },
]

export function PropertiesList() {
  const [selectedProperty, setSelectedProperty] = useState<(typeof properties)[0] | null>(null)
  const [showRemovalDialog, setShowRemovalDialog] = useState(false)
  const [showIssueDialog, setShowIssueDialog] = useState(false)

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">My Properties</h1>
            <p className="text-muted-foreground mt-1">Properties linked to your account</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      <StaggerContainer className="grid gap-4">
        {properties.map((property) => (
          <StaggerItem key={property.id}>
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{property.title}</h3>
                        {property.verified && <CheckCircle className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {property.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={property.status === "Active" ? "default" : "secondary"}
                        className={property.status !== "Active" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : ""}
                      >
                        {property.verified ? "Verified" : "Pending Verification"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedProperty(property)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedProperty(property)
                              setShowIssueDialog(true)
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Report Issue
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedProperty(property)
                              setShowRemovalDialog(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Request Removal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{property.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rent</p>
                      <p className="font-medium">{property.rent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Beds</p>
                      <p className="font-medium">{property.beds}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Baths</p>
                      <p className="font-medium">{property.baths}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{property.agent.name}</p>
                        <p className="text-xs text-muted-foreground">{property.agent.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <Dialog open={showRemovalDialog} onOpenChange={setShowRemovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Property Removal</DialogTitle>
            <DialogDescription>
              Submit a request to remove this property from your account. Please provide a reason for the removal.
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedProperty.title}</p>
                <p className="text-sm text-muted-foreground">{selectedProperty.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Reason for Removal</label>
                <Textarea placeholder="Please explain why you want to remove this property..." rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemovalDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setShowRemovalDialog(false)}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>Report a problem with this property listing or your experience.</DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedProperty.title}</p>
                <p className="text-sm text-muted-foreground">{selectedProperty.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Issue Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incorrect-info">Incorrect Information</SelectItem>
                    <SelectItem value="agent-issue">Agent Issue</SelectItem>
                    <SelectItem value="billing">Billing Problem</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea placeholder="Describe the issue in detail..." rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIssueDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setShowIssueDialog(false)}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
