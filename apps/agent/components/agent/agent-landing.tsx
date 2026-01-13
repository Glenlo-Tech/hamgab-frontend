"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Plus, List, BarChart3, CheckCircle, TrendingUp, Users, FileText } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper"

const quickActions = [
  {
    title: "Submit Property",
    description: "Add a new property listing",
    href: "/submit",
    icon: Plus,
    color: "bg-blue-500",
  },
  {
    title: "My Listings",
    description: "View and manage your properties",
    href: "/listings",
    icon: List,
    color: "bg-green-500",
  },
  {
    title: "Dashboard",
    description: "View analytics and insights",
    href: "/dashboard",
    icon: BarChart3,
    color: "bg-purple-500",
  },
]

const stats = [
  { label: "Active Listings", value: "12", icon: Building2 },
  { label: "Pending Approval", value: "3", icon: FileText },
  { label: "Total Views", value: "1,234", icon: TrendingUp },
  { label: "Verified Properties", value: "9", icon: CheckCircle },
]

export function AgentLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              <div>
                <span className="text-xl font-semibold tracking-tight block">HAMGAB</span>
                <span className="text-xs text-muted-foreground">Agent Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Property
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Welcome to Your
              <span className="text-primary block mt-2">Agent Portal</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your property listings, track performance, and grow your business with HAMGAB's powerful agent tools.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <BarChart3 className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Property
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn delay={0.2}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Quick Actions</h2>
            <p className="text-muted-foreground">Get started with these common tasks</p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <StaggerItem key={index}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <Link href={action.href}>
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-start group-hover:bg-primary group-hover:text-primary-foreground">
                      Get Started →
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-muted/50 rounded-3xl my-16">
        <FadeIn delay={0.3}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Everything You Need</h2>
            <p className="text-muted-foreground">Powerful tools to manage your property business</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Property Management</CardTitle>
              <CardDescription>
                Submit, edit, and manage all your property listings in one place.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track views, engagement, and performance metrics for your listings.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Verification System</CardTitle>
              <CardDescription>
                Get your properties verified quickly with our streamlined process.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Connect with property owners and manage your relationships.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Easily upload and manage property documents and certificates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>
                Understand what's working and optimize your listings for better results.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn delay={0.4}>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 text-primary-foreground/80">
                Start submitting properties or explore your dashboard to see your performance.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Property
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  )
}

