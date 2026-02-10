"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { ArrowRight, Bed, Bath, Square, MapPin, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const properties = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    location: "Manhattan, NY",
    price: "XAF 4,500/mo",
    beds: 2,
    baths: 2,
    sqft: 1200,
    status: "For Rent",
    verified: true,
    image: "/modern-downtown-loft-apartment-with-city-view.jpg",
  },
  {
    id: 2,
    title: "Luxury Waterfront Villa",
    location: "Miami Beach, FL",
    price: "XAF 2,850,000",
    beds: 5,
    baths: 4,
    sqft: 4500,
    status: "For Sale",
    verified: true,
    image: "/luxury-waterfront-villa-with-pool-miami-style.jpg",
  },
  {
    id: 3,
    title: "Cozy Studio Apartment",
    location: "Brooklyn, NY",
    price: "XAF 2,100/mo",
    beds: 1,
    baths: 1,
    sqft: 550,
    status: "For Rent",
    verified: true,
    image: "/cozy-modern-studio-apartment-minimalist-design.jpg",
  },
  {
    id: 4,
    title: "Family Suburban Home",
    location: "Austin, TX",
    price: "XAF 685,000",
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: "For Sale",
    verified: false,
    image: "/suburban-family-home-with-front-yard.jpg",
  },
]

export function FeaturedProperties() {
  return (
    <section id="properties" className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12">
          <FadeIn>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Featured Listings</p>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Discover your next home</h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Button variant="outline" asChild>
              <Link href="/listings">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>

        {/* Mobile: horizontal carousel-style row */}
        {/* Desktop: 4-column grid */}
        <StaggerContainer className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
          {properties.map((property) => (
            <StaggerItem key={property.id}>
              <Card className="overflow-hidden group h-full flex flex-col w-[220px] sm:w-[260px] lg:w-auto">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                  <Image
                    src={property.image || "/placeholder.svg"}
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
                </div>
                <CardContent className="p-3.5 sm:p-4 flex-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.location}
                  </div>
                  <h3 className="font-semibold mb-1.5 line-clamp-1 text-sm sm:text-base">
                    {property.title}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold">{property.price}</p>
                </CardContent>
                <CardFooter className="p-3.5 sm:p-4 pt-0 border-t border-border mt-auto">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground w-full">
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
      </div>
    </section>
  )
}
