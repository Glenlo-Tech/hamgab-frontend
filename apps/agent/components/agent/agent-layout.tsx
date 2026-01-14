"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { isAuthenticated, getAgentData, logoutAgent } from "@/lib/auth"
import { useKYCStatus } from "@/hooks/use-kyc-status"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, LayoutDashboard, Plus, List, Settings, LogOut, Menu, Bell, ChevronDown, BarChart3, Home, User, Grid3x3, PlusCircle, UserCircle, Settings2 } from "lucide-react"
import Image from "next/image"

interface AgentLayoutProps {
  children: React.ReactNode
}

const navigationLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, mobileLabel: "Dashboard" },
  { href: "/listings", label: "Listings", icon: Grid3x3, mobileLabel: "Listings" },
  { href: "/submit", label: "Submit", icon: PlusCircle, mobileLabel: "Submit" },
  { href: "/profile", label: "Profile", icon: UserCircle, mobileLabel: "Profile" },
  { href: "/settings", label: "Settings", icon: Settings2, mobileLabel: "Settings" },
]

// Desktop Sidebar Component
function DesktopSidebar() {
  const pathname = usePathname()
  const agent = getAgentData()

  const getInitials = () => {
    if (agent?.fullName) {
      return agent.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (agent?.email) {
      return agent.email[0].toUpperCase()
    }
    return "A"
  }

  const getDisplayName = () => {
    if (agent?.fullName) {
      return agent.fullName
    }
    if (agent?.email) {
      return agent.email.split("@")[0]
    }
    return "Agent"
  }

  const getRoleDisplay = () => {
    if (agent?.status) {
      return agent.status.charAt(0) + agent.status.slice(1).toLowerCase()
    }
    if (agent?.role) {
      return agent.role.charAt(0) + agent.role.slice(1).toLowerCase()
    }
    return "Agent"
  }

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">        
        <Image
             src="/favicon_io/favicon-32x32.png" 
             alt="hamgab logo"
             width="50"
             height="50"
        />
          <div>
            <span className="text-xl font-semibold tracking-tight block">HAMGAB</span>
            <span className="text-xs text-muted-foreground">Agent Portal</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationLinks.map((link) => {
          const isActive = pathname === link.href || (link.href === "/" && pathname === "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{getDisplayName()}</p>
            <p className="text-xs text-muted-foreground truncate">{getRoleDisplay()}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Mobile Bottom Navigation Component
function MobileBottomNav() {
  const pathname = usePathname()
  const { kycStatus, kycApproved } = useKYCStatus()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom mobile-nav">
      {/* Shadow overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Main navigation bar */}
      <div className="relative bg-background/98 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-end justify-around h-20 px-1 pb-safe pt-2">
          {navigationLinks.map((link, index) => {
            const isActive = pathname === link.href || (link.href === "/" && pathname === "/")
            const isSubmit = link.href === "/submit"
            
            // Special styling for the Submit button (middle button)
            if (isSubmit) {
              if (!kycApproved) {
                return (
                  <div
                    key={link.href}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-1.5 min-w-[64px] mb-1 transition-all duration-300",
                      "opacity-50 cursor-not-allowed"
                    )}
                    title={kycStatus?.status === "PENDING" ? "KYC verification pending approval" : "Please complete KYC verification to submit listings"}
                  >
                    {/* Disabled button container */}
                    <div className={cn(
                      "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                      "shadow-lg",
                      "bg-gradient-to-br from-muted to-muted/80",
                      "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-30"
                    )}>
                      {/* Icon with disabled effect */}
                      <link.icon className={cn(
                        "h-6 w-6 text-muted-foreground relative z-10",
                        "drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
                        "stroke-[2]"
                      )} />
                    </div>
                    
                    {/* Label */}
                    <span className={cn(
                      "text-[10px] sm:text-xs font-semibold text-center leading-tight",
                      "text-muted-foreground",
                      "transition-colors duration-300"
                    )}>
                      {link.mobileLabel}
                    </span>
                  </div>
                )
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1.5 min-w-[64px] mb-1 transition-all duration-300 active:scale-95",
                    "group"
                  )}
                >
                  {/* Elevated button container */}
                  <div className={cn(
                    "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                    "shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30",
                    "bg-gradient-to-br from-blue-600 to-blue-700",
                    "hover:from-blue-700 hover:to-blue-800",
                    "active:scale-95",
                    "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-50"
                  )}>
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Icon with 3D effect */}
                    <link.icon className={cn(
                      "h-6 w-6 text-white relative z-10",
                      "drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]",
                      "transition-transform duration-300",
                      "group-hover:scale-110 group-active:scale-95",
                      "fill-white/20 stroke-[2.5]"
                    )} />
                    
                    {/* Pulsing ring effect when active */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-blue-400/30 animate-ping" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-[10px] sm:text-xs font-semibold text-center leading-tight",
                    "text-blue-600 dark:text-blue-400",
                    "transition-colors duration-300"
                  )}>
                    {link.mobileLabel}
                  </span>
                </Link>
              )
            }
            
            // Regular navigation items
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1.5 flex-1 h-full min-w-0 px-1.5 transition-all duration-300 active:scale-95",
                  "group"
                )}
              >
                {/* Icon container with 3D effect */}
                <div className={cn(
                  "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  "shadow-md",
                  isActive
                    ? "bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 shadow-primary/20"
                    : "bg-muted/50 hover:bg-muted shadow-black/5 dark:shadow-black/20",
                  "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/30 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300"
                )}>
                  {/* Icon with shadow and stroke width for active state */}
                  <link.icon className={cn(
                    "h-5 w-5 relative z-10 transition-all duration-300",
                    isActive
                      ? "text-primary drop-shadow-[0_2px_4px_rgba(var(--primary),0.3)] scale-110 fill-primary/20 stroke-[2.5]"
                      : "text-muted-foreground group-hover:text-foreground group-hover:scale-110 stroke-[1.5]",
                    "drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                  )} />
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_4px_rgba(var(--primary),0.6)] animate-pulse" />
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-[10px] sm:text-xs font-medium truncate w-full text-center leading-tight transition-colors duration-300",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {link.mobileLabel}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

// Mobile Sidebar Sheet (for additional options)
function MobileSidebarSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-72">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2" onClick={() => onOpenChange(false)}>
            <Image
             src="/favicon_io/favicon-32x32.png" 
             alt="hamgab logo"
             width="50"
             height="50"
        />
              <div>
                <span className="text-xl font-semibold tracking-tight block">HAMGAB</span>
                <span className="text-xs text-muted-foreground">Agent Portal</span>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === "/" && pathname === "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {getAgentData()?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getAgentData()?.fullName || "Agent"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {(() => {
                    const agent = getAgentData()
                    if (agent?.status) {
                      const status = agent.status.charAt(0) + agent.status.slice(1).toLowerCase()
                      return `${status} Agent`
                    }
                    if (agent?.role) {
                      const role = agent.role.charAt(0) + agent.role.slice(1).toLowerCase()
                      return `${role} Agent`
                    }
                    return "Agent"
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function AgentLayout({ children }: AgentLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const agent = getAgentData()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    logoutAgent()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Sidebar Sheet */}
      <MobileSidebarSheet open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-14 lg:h-16 bg-background/80 backdrop-blur-lg border-b border-border flex items-center px-3 sm:px-4 lg:px-8 gap-3 lg:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Logo for mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span className="text-lg font-semibold">HAMGAB</span>
          </Link>

          <div className="flex-1" />

          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">3</Badge>
          </Button>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-9 px-2 lg:px-3">
                <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                  <AvatarFallback className="text-xs">
                    {agent?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">
                  {agent?.fullName?.split(" ")[0] || "Agent"}
                </span>
                <ChevronDown className="h-4 w-4 hidden sm:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </header>

        {/* Main Content with bottom padding for mobile nav */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8 pb-20 lg:pb-8 overflow-x-hidden">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
