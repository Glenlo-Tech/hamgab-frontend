"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
import { Building2, LayoutDashboard, Plus, List, Settings, LogOut, Menu, Bell, ChevronDown, BarChart3, Home } from "lucide-react"
import { useState } from "react"

interface AgentLayoutProps {
  children: React.ReactNode
}

const navigationLinks = [
  { href: "/", label: "Home", icon: Home, mobileLabel: "Home" },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3, mobileLabel: "Dashboard" },
  { href: "/submit", label: "Submit", icon: Plus, mobileLabel: "Submit" },
  { href: "/listings", label: "Listings", icon: List, mobileLabel: "Listings" },
  { href: "/settings", label: "Settings", icon: Settings, mobileLabel: "Settings" },
]

// Desktop Sidebar Component
function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8" />
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
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Sarah Johnson</p>
            <p className="text-xs text-muted-foreground truncate">Licensed Agent</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Mobile Bottom Navigation Component
function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-inset-bottom mobile-nav">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {navigationLinks.map((link) => {
          const isActive = pathname === link.href || (link.href === "/" && pathname === "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 flex-1 h-full min-w-0 px-2 transition-all duration-200 active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <link.icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center leading-tight">
                {link.mobileLabel}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-t-full" />
              )}
            </Link>
          )
        })}
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
              <Building2 className="h-8 w-8" />
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
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground truncate">Licensed Agent</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function AgentLayout({ children }: AgentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-9 px-2 lg:px-3">
                <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                  <AvatarFallback className="text-xs">SJ</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">Sarah</span>
                <ChevronDown className="h-4 w-4 hidden sm:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content with bottom padding for mobile nav */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8 pb-20 lg:pb-8 overflow-x-hidden">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
