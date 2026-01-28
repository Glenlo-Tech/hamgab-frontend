"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserPlus,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useVerificationQueue } from "@/hooks/use-verification-queue"
import { useRecentActivity } from "@/hooks/use-recent-activity"
import type { VerificationQueueProperty } from "@/lib/admin-properties"
import type { ActivityItem } from "@/lib/admin-dashboard"
import { useEffect, useState } from "react"

function formatTrend(value: number | null | undefined, asPercent: boolean = true): {
  text: string
  isUp: boolean
} {
  if (value == null || Number.isNaN(value)) {
    return {
      text: "—",
      isUp: true,
    }
  }

  const isUp = value >= 0
  const abs = Math.abs(value)
  const suffix = asPercent ? "%" : ""

  return {
    text: `${isUp ? "+" : "-"}${abs}${suffix}`,
    isUp,
  }
}

function formatTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  }
  const days = Math.floor(diffInSeconds / 86400)
  return `${days} ${days === 1 ? "day" : "days"} ago`
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) {
    return "Good Morning"
  } else if (hour < 17) {
    return "Good Afternoon"
  } else {
    return "Good Evening"
  }
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")
  
  // Get timezone abbreviation (e.g., GMT, EST, PST)
  const timeZone = Intl.DateTimeFormat("en", {
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value || ""
  
  return `${hours}:${minutes}:${seconds} ${timeZone}`
}

function formatLocationAddress(location: VerificationQueueProperty["locations"][0] | undefined): string {
  if (!location) return "Location not specified"
  
  const parts: string[] = []
  if (location.city) parts.push(location.city.trim())
  if (location.country) parts.push(location.country.trim())
  
  return parts.length > 0 ? parts.join(", ") : "Location not specified"
}

function formatPrice(property: VerificationQueueProperty): string {
  if (property.price == null) return "Price on request"
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(property.price)
}

const submissionsData = [
  { name: "Mon", submissions: 12 },
  { name: "Tue", submissions: 19 },
  { name: "Wed", submissions: 15 },
  { name: "Thu", submissions: 22 },
  { name: "Fri", submissions: 28 },
  { name: "Sat", submissions: 18 },
  { name: "Sun", submissions: 14 },
]

const revenueData = [
  { name: "Jan", revenue: 85000 },
  { name: "Feb", revenue: 92000 },
  { name: "Mar", revenue: 78000 },
  { name: "Apr", revenue: 110000 },
  { name: "May", revenue: 125000 },
  { name: "Jun", revenue: 142580 },
]

const statusData = [
  { name: "Approved", value: 68, color: "#22c55e" },
  { name: "Pending", value: 22, color: "#f59e0b" },
  { name: "Rejected", value: 10, color: "#ef4444" },
]


const pendingVerifications = [
  {
    id: 1,
    title: "Luxury Penthouse",
    agent: "Sarah Johnson",
    location: "New York, NY",
    submitted: "2 hours ago",
    price: "$8,500/mo",
  },
  {
    id: 2,
    title: "Beach Villa",
    agent: "Mike Chen",
    location: "Miami, FL",
    submitted: "5 hours ago",
    price: "$2.5M",
  },
  {
    id: 3,
    title: "Downtown Condo",
    agent: "Emily Davis",
    location: "Seattle, WA",
    submitted: "1 day ago",
    price: "$3,200/mo",
  },
]

export function AdminDashboard() {
  const { stats, isLoading, error } = useDashboardStats()
  const verificationQueue = useVerificationQueue({
    page: 1,
    page_size: 3, // Only show first 3 for dashboard preview
  })
  const verificationProperties = verificationQueue.properties
  const isLoadingVerification = verificationQueue.isLoading
  
  const { activities: recentActivity, isLoading: isLoadingActivity } = useRecentActivity(5)
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState(getGreeting())

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      // Update greeting if hour changed
      setGreeting(getGreeting())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const cards = [
    {
      key: "total_properties",
      label: "Total Properties",
      value: stats ? stats.total_properties.toLocaleString() : isLoading ? "…" : "—",
      icon: Building2,
      trendInfo: formatTrend(stats?.total_properties_trend),
      gradient: "from-blue-500/10 to-indigo-500/10",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200/50",
    },
    {
      key: "active_users",
      label: "Active Users",
      value: stats ? stats.active_users.toLocaleString() : isLoading ? "…" : "—",
      icon: Users,
      trendInfo: formatTrend(stats?.active_users_trend),
      gradient: "from-green-500/10 to-emerald-500/10",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      borderColor: "border-green-200/50",
    },
    {
      key: "monthly_revenue",
      label: "Monthly Revenue",
      value: stats
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "XAF",
            maximumFractionDigits: 0,
          }).format(stats.monthly_revenue)
        : isLoading
          ? "…"
          : "—",
      icon: DollarSign,
      trendInfo: formatTrend(stats?.monthly_revenue_trend),
      gradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200/50",
    },
    {
      key: "pending_approvals",
      label: "Pending Approvals",
      value: stats ? stats.pending_approvals.toLocaleString() : isLoading ? "…" : "—",
      icon: Clock,
      trendInfo: formatTrend(stats?.pending_approvals_trend, false),
      gradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200/50",
    },
  ] as const

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {greeting} Admin
              </h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 dark:border-blue-800/50">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-base font-mono font-semibold text-blue-700 dark:text-blue-300">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Platform overview and management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <Link href="/users">
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all">
              <Link href="/verification">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Review Properties
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      {error && !isLoading && (
        <p className="text-sm text-red-600">
          Failed to load dashboard statistics: {error.message}
        </p>
      )}

      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((stat) => (
          <StaggerItem key={stat.key}>
            <Card className={`h-full border-2 ${stat.borderColor} bg-gradient-to-br ${stat.gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
              <CardContent className="p-2 sm:px-6 flex flex-col justify-between gap-4 sm:gap-5 min-w-0">
                <div className="flex items-start justify-between gap-2 sm:gap-3 min-w-0">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <stat.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${stat.iconColor}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                      stat.trendInfo.isUp
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {stat.trendInfo.isUp && <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                    {stat.trendInfo.text}
                  </div>
                </div>
                <div className="space-y-1 min-w-0">
                  <span className={`block font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text break-words ${
                    stat.key === "monthly_revenue"
                      ? "text-xl sm:text-2xl lg:text-3xl"
                      : "text-2xl sm:text-3xl lg:text-4xl"
                  }`}>
                    {stat.value}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid lg:grid-cols-3 gap-6">
        <FadeIn delay={0.1} className="lg:col-span-2">
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-xl">Revenue Overview</CardTitle>
              <CardDescription className="text-sm">Monthly revenue for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "2px solid hsl(var(--border))",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-xl">Property Status</CardTitle>
              <CardDescription className="text-sm">Distribution of property statuses</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "2px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <FadeIn delay={0.3}>
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-xl">Weekly Submissions</CardTitle>
              <CardDescription className="text-sm">Property submissions per day</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={submissionsData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "2px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="submissions"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4 border-b">
              <div>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription className="text-sm">Latest platform actions</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingActivity ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <div className="h-8 w-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  Loading recent activity...
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="font-semibold text-base mb-1">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Activity will appear here as actions occur</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity: ActivityItem) => (
                    <div
                      key={activity.id}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                    >
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                          activity.type === "approval"
                            ? "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
                            : activity.type === "rejection"
                              ? "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30"
                              : activity.type === "user"
                                ? "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30"
                                : "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
                        }`}
                      >
                        {activity.type === "approval" && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                        {activity.type === "rejection" && (
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        {activity.type === "user" && (
                          <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                        {activity.type === "submission" && (
                          <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.5}>
        <Card className="border-2 border-amber-200/50 shadow-lg bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Pending Verifications
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                {isLoadingVerification
                  ? "Loading..."
                  : `${verificationProperties.length} ${verificationProperties.length === 1 ? "property" : "properties"} awaiting admin approval`}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="border-2 hover:bg-amber-50 hover:border-amber-300">
              <Link href="/verification">
                View All
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingVerification ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <div className="h-8 w-8 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
                Loading pending verifications...
              </div>
            ) : verificationProperties.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
                <p className="font-semibold text-base mb-1">No pending verifications</p>
                <p className="text-sm text-muted-foreground">All properties have been reviewed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {verificationProperties.map((property: VerificationQueueProperty) => {
                  const location = formatLocationAddress(property.locations[0])
                  const price = formatPrice(property)
                  const timeAgo = formatTimeAgo(property.created_at)
                  
                  return (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-amber-100 dark:border-amber-900/30 bg-white dark:bg-card hover:border-amber-200 dark:hover:border-amber-800/50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                          <Building2 className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-base">{property.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {location} • {property.agent_email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-lg text-foreground">{price}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all"
                        asChild
                      >
                        <Link href="/verification">
                          Review
                        </Link>
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
