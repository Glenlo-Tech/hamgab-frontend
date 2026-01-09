"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FadeIn, StaggerContainer, StaggerItem, PulseOnHover } from "@/components/motion-wrapper"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  FileText,
  Wrench,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Bell,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  Star,
  Activity,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

const stats = [
  { label: "My Properties", value: 3, icon: Building2, trend: "+1 this month", color: "bg-blue-500" },
  { label: "Active Agreements", value: 2, icon: FileText, trend: "All current", color: "bg-emerald-500" },
  { label: "Pending Requests", value: 1, icon: Wrench, trend: "1 in progress", color: "bg-amber-500" },
  { label: "Open Issues", value: 0, icon: AlertTriangle, trend: "All resolved", color: "bg-green-500" },
]

const properties = [
  {
    id: 1,
    title: "Downtown Apartment",
    address: "123 Main St, Apt 4B",
    status: "Active",
    verified: true,
    agent: { name: "Sarah Johnson", email: "sarah@hamgab.com", phone: "+1 (555) 123-4567" },
    image: "/apartment-interior-modern-downtown.jpg",
    rent: "$2,500",
    nextPayment: "Jan 15, 2026",
    paymentStatus: "upcoming",
  },
  {
    id: 2,
    title: "Suburban House",
    address: "456 Oak Lane",
    status: "Active",
    verified: true,
    agent: { name: "Mike Chen", email: "mike@hamgab.com", phone: "+1 (555) 234-5678" },
    image: "/suburban-house-exterior-lawn.jpg",
    rent: "$3,200",
    nextPayment: "Jan 1, 2026",
    paymentStatus: "paid",
  },
  {
    id: 3,
    title: "Beach Condo",
    address: "789 Ocean Blvd, Unit 12",
    status: "Pending",
    verified: false,
    agent: { name: "Emily Davis", email: "emily@hamgab.com", phone: "+1 (555) 345-6789" },
    image: "/beach-condo-balcony-view.jpg",
    rent: "$4,000",
    nextPayment: "Pending",
    paymentStatus: "pending",
  },
]

const agreements = [
  {
    id: 1,
    property: "Downtown Apartment",
    type: "Lease Agreement",
    status: "Active",
    expires: "Dec 31, 2026",
    progress: 25,
  },
  {
    id: 2,
    property: "Suburban House",
    type: "Purchase Agreement",
    status: "Completed",
    expires: "N/A",
    progress: 100,
  },
]

const maintenanceRequests = [
  {
    id: 1,
    property: "Downtown Apartment",
    issue: "HVAC Maintenance",
    status: "In Progress",
    date: "Jan 5, 2026",
    priority: "Medium",
    eta: "Jan 10, 2026",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "payment",
    message: "Rent payment received for Suburban House",
    time: "2 hours ago",
    icon: DollarSign,
  },
  {
    id: 2,
    type: "maintenance",
    message: "Maintenance request updated: HVAC Maintenance",
    time: "5 hours ago",
    icon: Wrench,
  },
  {
    id: 3,
    type: "agreement",
    message: "Lease agreement renewed for Downtown Apartment",
    time: "1 day ago",
    icon: FileText,
  },
  { id: 4, type: "property", message: "Beach Condo verification in progress", time: "2 days ago", icon: Building2 },
]

const notifications = [
  {
    id: 1,
    type: "payment",
    title: "Payment Due Soon",
    message: "Downtown Apartment rent due in 5 days",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    type: "maintenance",
    title: "Maintenance Update",
    message: "Technician scheduled for Jan 10",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Welcome to HAMGAB",
    message: "Complete your profile to get started",
    time: "3 days ago",
    read: true,
  },
]

export function DashboardOverview() {
  const [selectedProperty, setSelectedProperty] = useState<(typeof properties)[0] | null>(null)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedNotification, setExpandedNotification] = useState<number | null>(null)

  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <motion.h1
              className="text-2xl lg:text-3xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome back, John
            </motion.h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your properties and activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative bg-transparent"
              onClick={() => setExpandedNotification(expandedNotification ? null : 1)}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >
                  {unreadNotifications}
                </motion.span>
              )}
            </Button>
            <Button onClick={() => setShowMaintenanceDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </FadeIn>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StaggerItem key={stat.label}>
            <PulseOnHover>
              <Card className="relative overflow-hidden group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white", stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <motion.span
                      className="text-3xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.span>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium">{stat.label}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </p>
                  </div>
                </CardContent>
                <div
                  className={cn("absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity", stat.color)}
                />
              </Card>
            </PulseOnHover>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.1}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
              {unreadNotifications > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-red-100 text-red-800 h-5 min-w-5 flex items-center justify-center"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>My Properties</CardTitle>
                    <CardDescription>Properties linked to your account</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/properties">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {properties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedProperty(property)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-all cursor-pointer group"
                      >
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{property.title}</p>
                            {property.verified && <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.address}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium">{property.rent}/mo</span>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs",
                                property.paymentStatus === "paid" && "bg-emerald-100 text-emerald-800",
                                property.paymentStatus === "upcoming" && "bg-amber-100 text-amber-800",
                                property.paymentStatus === "pending" && "bg-muted text-muted-foreground",
                              )}
                            >
                              {property.paymentStatus === "paid" && "Paid"}
                              {property.paymentStatus === "upcoming" && `Due ${property.nextPayment}`}
                              {property.paymentStatus === "pending" && "Pending"}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Agreements</CardTitle>
                    <CardDescription>Your property agreements</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/agreements">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agreements.map((agreement, index) => (
                      <motion.div
                        key={agreement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">{agreement.type}</p>
                            <p className="text-sm text-muted-foreground">{agreement.property}</p>
                          </div>
                          <Badge variant={agreement.status === "Active" ? "default" : "secondary"}>
                            {agreement.status}
                          </Badge>
                        </div>
                        {agreement.status === "Active" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Contract Progress</span>
                              <span>{agreement.progress}%</span>
                            </div>
                            <Progress value={agreement.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires: {agreement.expires}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Maintenance Requests</CardTitle>
                  <CardDescription>Track your maintenance and repair requests</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/maintenance">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {maintenanceRequests.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Wrench className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium">{request.issue}</p>
                            <p className="text-sm text-muted-foreground">{request.property}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Submitted: {request.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                ETA: {request.eta}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                          <Badge className="bg-amber-500 text-white hover:bg-amber-500">{request.status}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {request.priority} Priority
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <CheckCircle className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
                    </motion.div>
                    <p className="font-medium text-lg">All caught up!</p>
                    <p className="text-muted-foreground">No pending maintenance requests</p>
                    <Button
                      variant="outline"
                      className="mt-4 bg-transparent"
                      onClick={() => setShowMaintenanceDialog(true)}
                    >
                      Submit Request
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest property-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 relative"
                      >
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center z-10 flex-shrink-0">
                          <activity.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Stay updated on your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "p-4 rounded-xl transition-colors cursor-pointer",
                          notification.read ? "bg-muted/50" : "bg-blue-50 border border-blue-100",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                              notification.type === "payment" && "bg-emerald-100",
                              notification.type === "maintenance" && "bg-amber-100",
                              notification.type === "info" && "bg-blue-100",
                            )}
                          >
                            {notification.type === "payment" && <DollarSign className="h-5 w-5 text-emerald-600" />}
                            {notification.type === "maintenance" && <Wrench className="h-5 w-5 text-amber-600" />}
                            {notification.type === "info" && <Bell className="h-5 w-5 text-blue-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium">{notification.title}</p>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>

      <FadeIn delay={0.4}>
        <Card className="bg-foreground text-background overflow-hidden relative">
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Need Help?
                </h3>
                <p className="text-background/70 text-sm mt-1">
                  Report an issue or request assistance with your property.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" asChild>
                  <Link href="/dashboard/issues">Report Issue</Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-background/20 text-background hover:bg-background/10"
                  onClick={() => setShowMaintenanceDialog(true)}
                >
                  Request Maintenance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProperty?.title}</DialogTitle>
            <DialogDescription>{selectedProperty?.address}</DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={selectedProperty.image || "/placeholder.svg"}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-sm text-muted-foreground">Monthly Rent</p>
                  <p className="text-2xl font-bold">{selectedProperty.rent}</p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-1">{selectedProperty.status}</Badge>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm font-medium mb-3">Property Agent</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                    <span className="font-semibold">
                      {selectedProperty.agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedProperty.agent.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProperty.agent.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setSelectedProperty(null)
                setShowContactDialog(true)
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Agent
            </Button>
            <Button className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Agent</DialogTitle>
            <DialogDescription>Send a message to your property agent</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea placeholder="Write your message here..." rows={4} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setShowContactDialog(false)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Maintenance Request</DialogTitle>
            <DialogDescription>Submit a maintenance or repair request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Property</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Issue Type</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="hvac">HVAC / Heating / Cooling</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="appliance">Appliance Repair</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="low">Low - Can wait</option>
                <option value="medium">Medium - Needs attention soon</option>
                <option value="high">High - Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea placeholder="Describe the issue in detail..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={() => setShowMaintenanceDialog(false)}>
              <Wrench className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
