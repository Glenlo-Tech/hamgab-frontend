"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Search, MapPin, Eye, Edit, MoreVertical, Plus, Bed, Bath, Square } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"

const listings = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    address: "123 5th Avenue, New York, NY",
    price: "$4,500/mo",
    beds: 2,
    baths: 2,
    sqft: 1200,
    status: "Approved",
    views: 245,
    image: "/modern-downtown-loft-apartment-with-city-view.jpg",
    submittedAt: "Jan 5, 2026",
  },
  {
    id: 2,
    title: "Luxury Beach Villa",
    address: "456 Ocean Drive, Miami, FL",
    price: "$2,850,000",
    beds: 5,
    baths: 4,
    sqft: 4500,
    status: "Pending",
    views: 0,
    image: "/luxury-waterfront-villa-with-pool-miami-style.jpg",
    submittedAt: "Jan 7, 2026",
  },
  {
    id: 3,
    title: "Cozy Studio",
    address: "789 Bedford Ave, Brooklyn, NY",
    price: "$2,100/mo",
    beds: 1,
    baths: 1,
    sqft: 550,
    status: "Approved",
    views: 128,
    image: "/cozy-modern-studio-apartment-minimalist-design.jpg",
    submittedAt: "Jan 3, 2026",
  },
  {
    id: 4,
    title: "Family Suburban Home",
    address: "321 Oak Lane, Austin, TX",
    price: "$685,000",
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: "Rejected",
    views: 0,
    image: "/suburban-family-home-with-front-yard.jpg",
    submittedAt: "Dec 28, 2025",
    rejectionReason: "Missing property documents",
  },
  {
    id: 5,
    title: "Penthouse Suite",
    address: "100 Sunset Blvd, Los Angeles, CA",
    price: "$12,000/mo",
    beds: 3,
    baths: 3,
    sqft: 3200,
    status: "Approved",
    views: 89,
    image: "/luxury-penthouse-city-skyline-view.jpg",
    submittedAt: "Dec 20, 2025",
  },
]

export function AgentListings() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  const filteredByStatus = (status: string) => {
    if (status === "all") return listings
    return listings.filter((l) => l.status.toLowerCase() === status.toLowerCase())
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground mt-1">Manage and track all your property submissions</p>
          </div>
          <Button asChild>
            <Link href="/submit">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Link>
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search listings..." className="pl-9" />
          </div>
          <Select defaultValue="newest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Tabs defaultValue="all" className="w-full">
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <TabsList className="inline-flex h-auto w-full sm:w-auto bg-muted/50 p-1 rounded-lg border border-border/50">
              <TabsTrigger 
                value="all" 
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all whitespace-nowrap"
              >
                All ({listings.length})
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all whitespace-nowrap"
              >
                Approved ({filteredByStatus("approved").length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all whitespace-nowrap"
              >
                Pending ({filteredByStatus("pending").length})
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all whitespace-nowrap"
              >
                Rejected ({filteredByStatus("rejected").length})
              </TabsTrigger>
            </TabsList>
          </div>

          {["all", "approved", "pending", "rejected"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <StaggerContainer className="grid gap-4">
                {filteredByStatus(tab).map((listing) => (
                  <StaggerItem key={listing.id}>
                    <Card className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
                          <Image
                            src={listing.image || "/placeholder.svg"}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-semibold">{listing.title}</h3>
                                <Badge variant="secondary" className={getStatusColor(listing.status)}>
                                  {listing.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {listing.address}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {listing.status !== "Rejected" && (
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Listing
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Price</p>
                              <p className="font-semibold">{listing.price}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 text-sm">
                                <Bed className="h-4 w-4" />
                                {listing.beds}
                              </span>
                              <span className="flex items-center gap-1 text-sm">
                                <Bath className="h-4 w-4" />
                                {listing.baths}
                              </span>
                              <span className="flex items-center gap-1 text-sm">
                                <Square className="h-4 w-4" />
                                {listing.sqft.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Submitted</p>
                              <p className="text-sm font-medium">{listing.submittedAt}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Views</p>
                              <p className="text-sm font-medium flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {listing.views}
                              </p>
                            </div>
                          </div>

                          {listing.status === "Rejected" && listing.rejectionReason && (
                            <div className="mt-4 p-3 bg-red-50 rounded-lg">
                              <p className="text-sm text-red-800">
                                <span className="font-medium">Rejection Reason:</span> {listing.rejectionReason}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </TabsContent>
          ))}
        </Tabs>
      </FadeIn>
    </div>
  )
}
