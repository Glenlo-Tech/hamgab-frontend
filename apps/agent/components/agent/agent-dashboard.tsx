"use client"

import { useState, useEffect } from "react"
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
import { FadeIn, StaggerContainer, StaggerItem, PulseOnHover } from "@/components/motion-wrapper"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  Clock,
  DollarSign,
  CheckCircle2,
  Plus,
  ArrowRight,
  AlertCircle,
  Eye,
  Target,
  Award,
  MessageSquare,
  Bell,
  BarChart3,
  Users,
  FileCheck,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  XCircle,
  Shield,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { getAgentData, getKYCStatus, isKYCApproved, KYCSubmissionResponse } from "@/lib/auth"
const stats = [
  { label: "Total Listings", value: 24, icon: Building2, trend: "+3", trendUp: true, color: "bg-blue-500" },
  { label: "Pending Approval", value: 5, icon: Clock, trend: "2 under review", trendUp: false, color: "bg-amber-500" },
  { label: "This Month", value: "XAF 12,450", icon: DollarSign, trend: "+18%", trendUp: true, color: "bg-emerald-500" },
  { label: "Approval Rate", value: "79%", icon: CheckCircle2, trend: "+5%", trendUp: true, color: "bg-purple-500" },
]

const earningsData = [
  { month: "Aug", earnings: 8500 },
  { month: "Sep", earnings: 9200 },
  { month: "Oct", earnings: 10100 },
  { month: "Nov", earnings: 11300 },
  { month: "Dec", earnings: 10800 },
  { month: "Jan", earnings: 12450 },
]

const listingsData = [
  { month: "Aug", approved: 5, pending: 2, rejected: 1 },
  { month: "Sep", approved: 4, pending: 3, rejected: 0 },
  { month: "Oct", approved: 6, pending: 1, rejected: 1 },
  { month: "Nov", approved: 5, pending: 2, rejected: 0 },
  { month: "Dec", approved: 4, pending: 3, rejected: 1 },
  { month: "Jan", approved: 7, pending: 2, rejected: 0 },
]

const recentListings = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    address: "123 5th Avenue, NY",
    status: "Approved",
    views: 245,
    inquiries: 12,
    image: "/modern-downtown-loft-apartment-with-city-view.jpg",
    submittedAt: "Jan 5, 2026",
    price: "XAF4,500/mo",
  },
  {
    id: 2,
    title: "Luxury Beach Villa",
    address: "456 Ocean Drive, Miami",
    status: "Pending",
    views: 0,
    inquiries: 0,
    image: "/luxury-waterfront-villa-with-pool-miami-style.jpg",
    submittedAt: "Jan 7, 2026",
    price: "XAF 2,850,000",
  },
  {
    id: 3,
    title: "Cozy Studio",
    address: "789 Bedford Ave, Brooklyn",
    status: "Approved",
    views: 128,
    inquiries: 8,
    image: "/cozy-modern-studio-apartment-minimalist-design.jpg",
    submittedAt: "Jan 3, 2026",
    price: "XAF 2,100/mo",
  },
]

const notifications = [
  {
    id: 1,
    type: "approval",
    message: 'Your property "Modern Downtown Loft" has been approved.',
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "review",
    message: "Admin requested additional photos for Beach Villa listing.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "inquiry",
    message: "New inquiry received for Cozy Studio apartment.",
    time: "8 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "info",
    message: "New commission structure effective from February 1st.",
    time: "1 day ago",
    read: true,
  },
]

const goals = [
  { label: "Monthly Target", current: 12450, target: 15000, unit: "XAF" },
  { label: "New Listings", current: 7, target: 10, unit: "" },
  { label: "Client Meetings", current: 12, target: 15, unit: "" },
]

const topPerformers = [
  { id: 1, title: "Modern Downtown Loft", views: 245, inquiries: 12, conversion: "4.9%" },
  { id: 2, title: "Cozy Studio", views: 128, inquiries: 8, conversion: "6.3%" },
  { id: 3, title: "Penthouse Suite", views: 89, inquiries: 5, conversion: "5.6%" },
]

export function AgentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedListing, setSelectedListing] = useState<(typeof recentListings)[0] | null>(null)
  const [kycStatus, setKycStatus] = useState<KYCSubmissionResponse | null>(null)
  const [isLoadingKYC, setIsLoadingKYC] = useState(true)
  const unreadNotifications = notifications.filter((n) => !n.read).length
  const agent = getAgentData()

  // Fetch KYC status on mount
  useEffect(() => {
    const fetchKYCStatus = async () => {
      setIsLoadingKYC(true)
      try {
        const status = await getKYCStatus()
        setKycStatus(status)
      } catch (error) {
        // Handle error silently - KYC might not be submitted yet
        setKycStatus(null)
      } finally {
        setIsLoadingKYC(false)
      }
    }

    fetchKYCStatus()
  }, [])

  const kycApproved = isKYCApproved(kycStatus)

  const getWelcomeName = () => {
    if (agent?.fullName) {
      return agent.fullName.split(" ")[0]
    }
    if (agent?.email) {
      return agent.email.split("@")[0]
    }
    return "Agent"
  }

  const getStatusBadge = () => {
    if (!agent?.status) return null
    
    const status = agent.status.toUpperCase()
    const statusConfig = {
      PENDING: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: Clock },
      ACTIVE: { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
      APPROVED: { label: "Approved", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: CheckCircle2 },
      REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
      SUSPENDED: { label: "Suspended", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", icon: AlertCircle },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon
    
    return (
      <Badge className={cn("flex items-center gap-1.5 px-2.5 py-1", config.color)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <FadeIn>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <motion.h1
              className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome back, {getWelcomeName()}
            </motion.h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Here's your property management overview.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {kycApproved ? (
              <Button asChild size="sm" className="h-9 sm:h-10">
                <Link href="/submit">
                  <Plus className="h-4 w-4 mr-1.5 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Submit Property</span>
                </Link>
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="h-9 sm:h-10" 
                disabled
                variant="outline"
                title={kycStatus?.status === "PENDING" ? "KYC verification pending approval" : "Please complete KYC verification to submit listings"}
              >
                <Plus className="h-4 w-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">Submit Property</span>
              </Button>
            )}
            {getStatusBadge()}
          </div>
        </div>
      </FadeIn>

      {/* KYC Status Card */}
      {!isLoadingKYC && (
        <FadeIn delay={0.05}>
          <Card className={cn(
            "border-2 transition-all",
            kycApproved 
              ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800" 
              : kycStatus?.status === "PENDING"
              ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
              : kycStatus?.status === "REJECTED"
              ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
              : "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
          )}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  kycApproved
                    ? "bg-green-100 dark:bg-green-900/30"
                    : kycStatus?.status === "PENDING"
                    ? "bg-amber-100 dark:bg-amber-900/30"
                    : kycStatus?.status === "REJECTED"
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-blue-100 dark:bg-blue-900/30"
                )}>
                  {kycApproved ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : kycStatus?.status === "PENDING" ? (
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  ) : kycStatus?.status === "REJECTED" ? (
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  ) : (
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-base sm:text-lg">
                      {kycApproved 
                        ? "KYC Verification Approved" 
                        : kycStatus?.status === "PENDING"
                        ? "KYC Verification Pending"
                        : kycStatus?.status === "REJECTED"
                        ? "KYC Verification Rejected"
                        : "KYC Verification Required"}
                    </h3>
                    {kycStatus && (
                      <Badge className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 text-xs",
                        kycApproved
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : kycStatus.status === "PENDING"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : kycStatus.status === "REJECTED"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      )}>
                        {kycStatus.status === "PENDING" && <Clock className="h-3 w-3" />}
                        {kycStatus.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                        {kycApproved && <CheckCircle2 className="h-3 w-3" />}
                        {kycStatus.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {kycApproved 
                      ? "Your KYC verification has been approved. You can now submit property listings."
                      : kycStatus?.status === "PENDING"
                      ? "Your KYC documents are under review. We'll notify you via email once the review is complete."
                      : kycStatus?.status === "REJECTED"
                      ? kycStatus.review_notes 
                        ? `Rejection reason: ${kycStatus.review_notes}`
                        : "Your KYC verification was rejected. Please update your documents and resubmit."
                      : "Complete your KYC verification to start submitting property listings."}
                  </p>
                  {!kycApproved && (
                    <Button asChild variant={kycStatus?.status === "REJECTED" ? "default" : "outline"} size="sm">
                      <Link href="/profile">
                        {kycStatus?.status === "REJECTED" ? "Update KYC Documents" : "Complete KYC Verification"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                  {kycStatus?.submitted_at && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Submitted: {new Date(kycStatus.submitted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {stats.map((stat, index) => (
          <StaggerItem key={stat.label}>
            <PulseOnHover>
              <Card className="relative overflow-hidden group cursor-pointer">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className={cn("h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white", stat.color)}>
                      <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full",
                        stat.trendUp ? "text-emerald-700 bg-emerald-100" : "text-muted-foreground bg-muted",
                      )}
                    >
                      {stat.trendUp ? <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <ArrowDownRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                      <span className="hidden sm:inline">{stat.trend}</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 lg:mt-4">
                    <motion.span
                      className="text-xl sm:text-2xl lg:text-3xl font-bold block"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.span>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">{stat.label}</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              Analytics
            </TabsTrigger>
            {/* <TabsTrigger value="goals" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              Goals
            </TabsTrigger> */}
            <TabsTrigger value="notifications" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
              <span className="flex items-center gap-1 sm:gap-2">
                Alerts
                {unreadNotifications > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 h-4 w-4 sm:h-5 sm:w-5 sm:min-w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-2 overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-3 sm:pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl">Recent Listings</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Your recently submitted properties</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="self-start sm:self-auto">
                    <Link href="/listings" className="text-xs sm:text-sm">
                      View All
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-2 sm:space-y-3">
                    {recentListings.map((listing, index) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedListing(listing)}
                        className="flex items-center gap-2 sm:gap-3 lg:gap-4 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-muted transition-all cursor-pointer group"
                      >
                        <div className="relative h-14 w-16 sm:h-16 sm:w-20 rounded-md sm:rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={listing.image || "/placeholder.svg"}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="font-medium text-sm sm:text-base truncate">{listing.title}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{listing.address}</p>
                          <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1 flex-wrap">
                            <span className="text-[10px] sm:text-xs font-medium">{listing.price}</span>
                            {listing.views > 0 && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-0.5 sm:gap-1">
                                <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                {listing.views}
                              </span>
                            )}
                            {listing.inquiries > 0 && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-0.5 sm:gap-1">
                                <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                {listing.inquiries}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "flex-shrink-0 text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1",
                            listing.status === "Approved" && "bg-emerald-100 text-emerald-800",
                            listing.status === "Pending" && "bg-amber-100 text-amber-800",
                          )}
                        >
                          {listing.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                    Top Performers
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your best performing listings</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-3 sm:space-y-4">
                    {topPerformers.map((listing, index) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-muted/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={cn(
                              "h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white flex-shrink-0",
                              index === 0 && "bg-amber-500",
                              index === 1 && "bg-zinc-400",
                              index === 2 && "bg-amber-700",
                            )}
                          >
                            {index + 1}
                          </span>
                          <p className="font-medium text-xs sm:text-sm truncate min-w-0">{listing.title}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                          <div>
                            <p className="text-base sm:text-lg font-bold">{listing.views}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Views</p>
                          </div>
                          <div>
                            <p className="text-base sm:text-lg font-bold">{listing.inquiries}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Inquiries</p>
                          </div>
                          <div>
                            <p className="text-base sm:text-lg font-bold text-emerald-600">{listing.conversion}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Conv.</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Earnings Overview
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your commission earnings over time</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="h-[180px] sm:h-[200px] lg:h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earningsData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-[10px] sm:text-xs" 
                        tick={{ fontSize: 10 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        className="text-[10px] sm:text-xs" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `XAF ${value / 1000}k`} 
                        width={40}
                      />
                      <Tooltip
                        formatter={(value: number) => [`XAF ${value.toLocaleString()}`, "Earnings"]}
                        contentStyle={{ 
                          background: "hsl(var(--background))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                          fontSize: "12px",
                          padding: "8px"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="#10b981"
                        fill="url(#colorEarnings)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Trend</CardTitle>
                  <CardDescription>Monthly commission breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={earningsData}>
                        <defs>
                          <linearGradient id="colorEarningsFull" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(value) => `XAF ${value / 1000}k`} />
                        <Tooltip
                          formatter={(value: number) => [`XAF ${value.toLocaleString()}`, "Earnings"]}
                          contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="earnings"
                          stroke="#10b981"
                          fill="url(#colorEarningsFull)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Listing Status</CardTitle>
                  <CardDescription>Monthly submission breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={listingsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                          }}
                        />
                        <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="text-sm">Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm">Rejected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Avg. Time to Approval", value: "2.3 days", icon: Clock, trend: "-0.5 days" },
                    { label: "Total Views", value: "1,247", icon: Eye, trend: "+18%" },
                    { label: "Total Inquiries", value: "45", icon: MessageSquare, trend: "+12%" },
                    { label: "Active Clients", value: "28", icon: Users, trend: "+3" },
                  ].map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                          <metric.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-emerald-600 font-medium">{metric.trend}</span>
                      </div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="goals" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Monthly Goals
                </CardTitle>
                <CardDescription>Track your progress towards your targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal, index) => {
                    const progress = (goal.current / goal.target) * 100
                    return (
                      <motion.div
                        key={goal.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{goal.label}</span>
                          <span className="text-sm">
                            <span className="font-bold text-lg">
                              {goal.unit}
                              {goal.current.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              / {goal.unit}
                              {goal.target.toLocaleString()}
                            </span>
                          </span>
                        </div>
                        <div className="relative">
                          <Progress value={progress} className="h-3" />
                          {progress >= 100 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -right-1 -top-1"
                            >
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {progress >= 100
                            ? "Goal achieved!"
                            : `${Math.round(progress)}% complete - ${goal.unit}${(goal.target - goal.current).toLocaleString()} to go`}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-foreground text-background">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Keep up the great work!
                    </h3>
                    <p className="text-background/70 text-sm mt-1">
                      You're on track to hit your monthly targets. Submit more properties to boost your earnings.
                    </p>
                  </div>
                  <Button variant="secondary" asChild>
                    <Link href="/submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Property
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Recent updates and messages</CardDescription>
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
                          "flex gap-4 p-4 rounded-xl transition-colors cursor-pointer",
                          notification.read ? "bg-muted/50" : "bg-blue-50 border border-blue-100",
                        )}
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                            notification.type === "approval" && "bg-emerald-100",
                            notification.type === "review" && "bg-amber-100",
                            notification.type === "inquiry" && "bg-blue-100",
                            notification.type === "info" && "bg-muted",
                          )}
                        >
                          {notification.type === "approval" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                          {notification.type === "review" && <AlertCircle className="h-5 w-5 text-amber-600" />}
                          {notification.type === "inquiry" && <MessageSquare className="h-5 w-5 text-blue-600" />}
                          {notification.type === "info" && <Bell className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">{notification.message}</p>
                            {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
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

      {/* <FadeIn delay={0.3}>
        <Card className="bg-foreground text-background overflow-hidden relative">
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Ready to list a new property?</h3>
                <p className="text-background/70 text-sm mt-1">
                  Submit your property details and get it listed within 24-48 hours.
                </p>
              </div>
              <Button variant="secondary" asChild>
                <Link href="/submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Property
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn> */}

      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedListing?.title}</DialogTitle>
            <DialogDescription>{selectedListing?.address}</DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={selectedListing.image || "/placeholder.svg"}
                  alt={selectedListing.title}
                  fill
                  className="object-cover"
                />
                <Badge
                  className={cn(
                    "absolute top-3 right-3",
                    selectedListing.status === "Approved" && "bg-emerald-500",
                    selectedListing.status === "Pending" && "bg-amber-500",
                  )}
                >
                  {selectedListing.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted rounded-xl min-w-0">
                  <p className="text-xl sm:text-2xl font-bold truncate">{selectedListing.views}</p>
                  <p className="text-sm text-muted-foreground">Views</p>
                </div>
                <div className="p-4 bg-muted rounded-xl min-w-0">
                  <p className="text-xl sm:text-2xl font-bold truncate">{selectedListing.inquiries}</p>
                  <p className="text-sm text-muted-foreground">Inquiries</p>
                </div>
                <div className="p-4 bg-muted rounded-xl min-w-0 overflow-hidden">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold break-words hyphens-auto leading-tight line-clamp-2">
                    {selectedListing.price}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Price</p>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">{selectedListing.submittedAt}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedListing(null)} className="bg-transparent">
              Close
            </Button>
            <Button asChild>
              <Link href={`/listings`}>
                <FileCheck className="h-4 w-4 mr-2" />
                Manage Listing
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
