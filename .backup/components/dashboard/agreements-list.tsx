"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { FileText, Download, Eye, Calendar, Building2 } from "lucide-react"

const agreements = [
  {
    id: 1,
    title: "Lease Agreement",
    property: "Downtown Apartment",
    address: "123 Main St, Apt 4B",
    status: "Active",
    startDate: "Jan 1, 2026",
    endDate: "Dec 31, 2026",
    type: "Residential Lease",
  },
  {
    id: 2,
    title: "Purchase Agreement",
    property: "Suburban House",
    address: "456 Oak Lane",
    status: "Completed",
    startDate: "Nov 15, 2025",
    endDate: "N/A",
    type: "Property Purchase",
  },
  {
    id: 3,
    title: "Rental Agreement",
    property: "Beach Condo",
    address: "789 Ocean Blvd, Unit 12",
    status: "Pending",
    startDate: "Feb 1, 2026",
    endDate: "Jan 31, 2027",
    type: "Vacation Rental",
  },
]

export function AgreementsList() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Agreements</h1>
          <p className="text-muted-foreground mt-1">View and manage your property agreements</p>
        </div>
      </FadeIn>

      <StaggerContainer className="grid gap-4">
        {agreements.map((agreement) => (
          <StaggerItem key={agreement.id}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{agreement.title}</h3>
                        <Badge
                          variant={
                            agreement.status === "Active"
                              ? "default"
                              : agreement.status === "Completed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {agreement.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {agreement.property} - {agreement.address}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Start: {agreement.startDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          End: {agreement.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 lg:flex-shrink-0">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold">Agreement Information</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Agreements shown here are for informational purposes. For any modifications or questions, please contact
              your assigned agent.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
