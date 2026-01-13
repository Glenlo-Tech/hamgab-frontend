"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import { Plus, Wrench, Calendar, Building2, Clock } from "lucide-react"
import { useState } from "react"

const requests = [
  {
    id: 1,
    title: "HVAC Maintenance",
    property: "Downtown Apartment",
    description: "Air conditioning not cooling properly. Makes unusual noise when running.",
    status: "In Progress",
    priority: "High",
    createdAt: "Jan 5, 2026",
    updatedAt: "Jan 7, 2026",
  },
  {
    id: 2,
    title: "Plumbing Repair",
    property: "Suburban House",
    description: "Kitchen sink is draining slowly.",
    status: "Completed",
    priority: "Medium",
    createdAt: "Dec 28, 2025",
    updatedAt: "Dec 30, 2025",
  },
  {
    id: 3,
    title: "Electrical Issue",
    property: "Beach Condo",
    description: "Bathroom outlet not working.",
    status: "Pending",
    priority: "Low",
    createdAt: "Jan 8, 2026",
    updatedAt: "Jan 8, 2026",
  },
]

const properties = [
  { id: 1, name: "Downtown Apartment" },
  { id: 2, name: "Suburban House" },
  { id: 3, name: "Beach Condo" },
]

export function MaintenanceRequests() {
  const [showNewRequest, setShowNewRequest] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "In Progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      default:
        return "bg-muted text-muted-foreground hover:bg-muted"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      default:
        return "bg-muted text-muted-foreground hover:bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Maintenance Requests</h1>
            <p className="text-muted-foreground mt-1">Submit and track maintenance requests for your properties</p>
          </div>
          <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>New Maintenance Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Property</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id.toString()}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Issue Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="appliance">Appliance</SelectItem>
                      <SelectItem value="structural">Structural</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input placeholder="Brief description of the issue" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea placeholder="Provide detailed information about the issue..." rows={4} />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowNewRequest(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button onClick={() => setShowNewRequest(false)}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      <StaggerContainer className="grid gap-4">
        {requests.map((request) => (
          <StaggerItem key={request.id}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{request.title}</h3>
                        <Badge variant="secondary" className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <Badge variant="secondary" className={getPriorityColor(request.priority)}>
                          {request.priority} Priority
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {request.property}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created: {request.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Updated: {request.updatedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="lg:flex-shrink-0 bg-transparent">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {requests.length === 0 && (
        <FadeIn>
          <Card className="bg-muted/50">
            <CardContent className="p-12 text-center">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No Maintenance Requests</h3>
              <p className="text-muted-foreground mt-1">You haven't submitted any maintenance requests yet.</p>
              <Button className="mt-4" onClick={() => setShowNewRequest(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  )
}
