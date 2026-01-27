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

const stats = [
  { label: "Total Properties", value: "5,234", icon: Building2, trend: "+12%", trendUp: true },
  { label: "Active Users", value: "2,847", icon: Users, trend: "+8%", trendUp: true },
  { label: "Monthly Revenue", value: "$142,580", icon: DollarSign, trend: "+23%", trendUp: true },
  { label: "Pending Approvals", value: "12", icon: Clock, trend: "-5", trendUp: false },
]

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

const recentActivity = [
  { id: 1, type: "approval", message: "Property #4521 approved by Admin", time: "2 min ago", user: "John Doe" },
  { id: 2, type: "user", message: "New agent registered: Sarah Johnson", time: "15 min ago", user: "System" },
  { id: 3, type: "submission", message: "New property submitted in Miami", time: "32 min ago", user: "Mike Chen" },
  { id: 4, type: "rejection", message: "Property #4518 rejected - Missing docs", time: "1 hour ago", user: "Admin" },
  { id: 5, type: "approval", message: "Property #4520 approved by Admin", time: "2 hours ago", user: "Jane Smith" },
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
  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Platform overview and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/users">
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button asChild>
              <Link href="/verification">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Review Properties
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {stat.trendUp && <TrendingUp className="h-3 w-3" />}
                    {stat.trend}
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{stat.value}</span>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid lg:grid-cols-3 gap-6">
        <FadeIn delay={0.1} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
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
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--foreground))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--foreground))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Property Status</CardTitle>
              <CardDescription>Distribution of property statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Submissions</CardTitle>
              <CardDescription>Property submissions per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={submissionsData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Bar dataKey="submissions" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform actions</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "approval"
                          ? "bg-green-100"
                          : activity.type === "rejection"
                            ? "bg-red-100"
                            : activity.type === "user"
                              ? "bg-blue-100"
                              : "bg-muted"
                      }`}
                    >
                      {activity.type === "approval" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                      {activity.type === "rejection" && <AlertCircle className="h-4 w-4 text-red-600" />}
                      {activity.type === "user" && <UserPlus className="h-4 w-4 text-blue-600" />}
                      {activity.type === "submission" && <Building2 className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.5}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>Properties awaiting admin approval</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/verification">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {property.location} • {property.agent}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{property.price}</p>
                    <p className="text-xs text-muted-foreground">{property.submitted}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
