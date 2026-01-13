"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Bed, Bath, Square, MapPin, CheckCircle, Heart, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const properties = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    location: "Manhattan, NY",
    address: "123 5th Avenue, New York, NY 10001",
    price: "$4,500/mo",
    beds: 2,
    baths: 2,
    sqft: 1200,
    status: "For Rent",
    verified: true,
    agent: { name: "John Smith", phone: "+1 (555) 123-4567", email: "john@hamgab.com" },
    images: ["/modern-loft-interior-living-room.jpg"],
    description: "Beautiful modern loft in the heart of Manhattan with stunning city views.",
  },
  {
    id: 2,
    title: "Luxury Waterfront Villa",
    location: "Miami Beach, FL",
    address: "456 Ocean Drive, Miami Beach, FL 33139",
    price: "$2,850,000",
    beds: 5,
    baths: 4,
    sqft: 4500,
    status: "For Sale",
    verified: true,
    agent: { name: "Sarah Johnson", phone: "+1 (555) 234-5678", email: "sarah@hamgab.com" },
    images: ["/luxury-villa-with-pool-ocean-view.jpg"],
    description: "Stunning waterfront villa with private pool and direct ocean access.",
  },
  {
    id: 3,
    title: "Cozy Studio Apartment",
    location: "Brooklyn, NY",
    address: "789 Bedford Ave, Brooklyn, NY 11205",
    price: "$2,100/mo",
    beds: 1,
    baths: 1,
    sqft: 550,
    status: "For Rent",
    verified: true,
    agent: { name: "Mike Chen", phone: "+1 (555) 345-6789", email: "mike@hamgab.com" },
    images: ["/cozy-studio-apartment-minimalist.jpg"],
    description: "Charming studio in trendy Brooklyn neighborhood with modern finishes.",
  },
  {
    id: 4,
    title: "Family Suburban Home",
    location: "Austin, TX",
    address: "321 Oak Lane, Austin, TX 78701",
    price: "$685,000",
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: "For Sale",
    verified: false,
    agent: { name: "Emily Davis", phone: "+1 (555) 456-7890", email: "emily@hamgab.com" },
    images: ["/suburban-family-home-front-yard.jpg"],
    description: "Spacious family home in quiet suburb with large backyard.",
  },
  {
    id: 5,
    title: "Penthouse Suite",
    location: "Los Angeles, CA",
    address: "100 Sunset Blvd, Los Angeles, CA 90028",
    price: "$12,000/mo",
    beds: 3,
    baths: 3,
    sqft: 3200,
    status: "For Rent",
    verified: true,
    agent: { name: "David Lee", phone: "+1 (555) 567-8901", email: "david@hamgab.com" },
    images: ["/luxury-penthouse-city-skyline-view.jpg"],
    description: "Exclusive penthouse with panoramic city views and private terrace.",
  },
  {
    id: 6,
    title: "Historic Brownstone",
    location: "Boston, MA",
    address: "55 Beacon Street, Boston, MA 02108",
    price: "$1,250,000",
    beds: 4,
    baths: 2,
    sqft: 2400,
    status: "For Sale",
    verified: true,
    agent: { name: "Lisa Brown", phone: "+1 (555) 678-9012", email: "lisa@hamgab.com" },
    images: ["/historic-brownstone-interior-elegant.jpg"],
    description: "Beautifully restored brownstone with original architectural details.",
  },
  {
    id: 7,
    title: "Modern Condo",
    location: "Seattle, WA",
    address: "200 Pike Street, Seattle, WA 98101",
    price: "$3,200/mo",
    beds: 2,
    baths: 2,
    sqft: 1100,
    status: "For Rent",
    verified: true,
    agent: { name: "Tom Wilson", phone: "+1 (555) 789-0123", email: "tom@hamgab.com" },
    images: ["/modern-condo-seattle-downtown-view.jpg"],
    description: "Contemporary condo with mountain and water views in downtown Seattle.",
  },
  {
    id: 8,
    title: "Beach House",
    location: "San Diego, CA",
    address: "888 Coastal Way, San Diego, CA 92109",
    price: "$1,950,000",
    beds: 3,
    baths: 2,
    sqft: 1800,
    status: "For Sale",
    verified: false,
    agent: { name: "Amy Garcia", phone: "+1 (555) 890-1234", email: "amy@hamgab.com" },
    images: ["/beach-house-coastal-living-room.jpg"],
    description: "Charming beach house steps from the sand with ocean breezes.",
  },
]

export function ListingsGrid() {
  const [selectedProperty, setSelectedProperty] = useState<(typeof properties)[0] | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  return (
    <>
      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <StaggerItem key={property.id}>
            <Card
              className="overflow-hidden group h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedProperty(property)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant={property.status === "For Rent" ? "secondary" : "default"}>{property.status}</Badge>
                  {property.verified && (
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <button
                  onClick={(e) => toggleFavorite(property.id, e)}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(property.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>
              <CardContent className="p-4 flex-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {property.location}
                </div>
                <h3 className="font-semibold mb-2 line-clamp-1">{property.title}</h3>
                <p className="text-xl font-bold">{property.price}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 border-t border-border mt-auto">
                <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {property.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {property.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {property.sqft.toLocaleString()} sqft
                  </span>
                </div>
              </CardFooter>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="flex items-center justify-center gap-2 mt-12">
        <Button variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {[1, 2, 3, 4, 5].map((page) => (
          <Button key={page} variant={page === 1 ? "default" : "outline"} size="icon">
            {page}
          </Button>
        ))}
        <Button variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProperty.title}</DialogTitle>
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

              <div className="flex items-center gap-4 mt-4">
                <Badge variant={selectedProperty.status === "For Rent" ? "secondary" : "default"}>
                  {selectedProperty.status}
                </Badge>
                {selectedProperty.verified && (
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Listing
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
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
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedProperty.description}</p>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">Contact Agent</h4>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {selectedProperty.agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedProperty.agent.name}</p>
                    <p className="text-sm text-muted-foreground">Licensed Agent</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold">{selectedProperty.price}</p>
                </div>
                <Button size="lg">Schedule Viewing</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
