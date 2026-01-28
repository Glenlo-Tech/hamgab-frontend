"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Shield,
  Building2,
} from "lucide-react"
import { useEffect, useState, useMemo, memo } from "react"
import { clearAdminToken } from "@/lib/admin-auth"
import Image from "next/image"
import { useVerificationQueue } from "@/hooks/use-verification-queue"

interface AdminLayoutProps {
  children: React.ReactNode
}

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/users", label: "Users & Agents", icon: Users },
  { href: "/verification", label: "Verification", icon: CheckSquare, badgeKey: "verification" },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

function SidebarComponent({ className }: { className?: string }) {
  const pathname = usePathname()
  // Use empty object with useMemo to prevent re-fetching on every render
  const emptyFilters = useMemo(() => ({}), [])
  const { meta: verificationMeta, isLoading: isLoadingVerification } = useVerificationQueue(emptyFilters)
  
  const getBadgeCount = useMemo(() => {
    return (badgeKey?: string): number | undefined => {
      if (badgeKey === "verification") {
        if (isLoadingVerification) return undefined
        return verificationMeta?.total ?? 0
      }
      return undefined
    }
  }, [isLoadingVerification, verificationMeta?.total])

  return (
    <div className={cn("flex flex-col h-full bg-foreground text-background", className)}>
      <div className="p-6 border-b border-background/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/favicon_io/android-chrome-512x512.png" alt="HAMGAB" width={100} height={100} />
          <div>
            <span className="text-lg font-semibold tracking-tight block">HAMGAB</span>
            <span className="text-xs text-background/60">Admin Portal</span>
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
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground"
                  : "text-background/70 hover:bg-background/10 hover:text-background",
              )}
            >
              <span className="flex items-center gap-3">
                <link.icon className="h-5 w-5" />
                {link.label}
              </span>
              {link.badgeKey && (() => {
                const badgeCount = getBadgeCount(link.badgeKey)
                if (badgeCount === undefined) return null
                if (badgeCount === 0) return null
                return (
                  <Badge variant="secondary" className="bg-background/20 text-background hover:bg-background/20">
                    {badgeCount}
                  </Badge>
                )
              })()}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-background/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-9 w-9 bg-background/20">
            <AvatarFallback className="text-background">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-background/60 truncate">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Sidebar = memo(SidebarComponent)

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Simple client-side guard based on stored admin token
  // Only run once on mount, not on every navigation
  useEffect(() => {
    if (typeof window === "undefined") return

    const token = localStorage.getItem("admin_auth_token")
    if (!token) {
      setIsAuthenticated(false)
      setIsCheckingAuth(false)
      router.replace("/")
      return
    }

    setIsAuthenticated(true)
    setIsCheckingAuth(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run on mount

  const handleSignOut = () => {
    clearAdminToken()
    router.push("/")
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <div className="h-8 w-8 border-2 border-muted-foreground/40 border-t-transparent rounded-full animate-spin" />
          <span>Checking admin session…</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:block w-64">
        <Sidebar />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-foreground border-none">
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
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">5</Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleSignOut}
              >
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
