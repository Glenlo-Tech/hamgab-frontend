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
import { Building2, LayoutDashboard, Plus, List, Settings, LogOut, Menu, Bell, ChevronDown, BarChart3 } from "lucide-react"
import { useState } from "react"

interface AgentLayoutProps {
  children: React.ReactNode
}

const sidebarLinks = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/submit", label: "Submit Property", icon: Plus },
  { href: "/listings", label: "My Listings", icon: List },
  { href: "/settings", label: "Settings", icon: Settings },
]

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          <div>
            <span className="text-xl font-semibold tracking-tight block">HAMGAB</span>
            <span className="text-xs text-muted-foreground">Agent Portal</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
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
    </div>
  )
}

export function AgentLayout({ children }: AgentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:block w-64">
        <Sidebar />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b border-border flex items-center px-4 lg:px-8 gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex-1" />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">Sarah Johnson</span>
                <ChevronDown className="h-4 w-4" />
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

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
