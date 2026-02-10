"use client"

import { useMemo, useState, MouseEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu, User, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type HeaderLink = {
  href: string
  label: string
}

type HeaderUser = {
  name?: string
  avatarUrl?: string
}

interface SiteHeaderProps {
  navLinks: HeaderLink[]
  user?: HeaderUser | null
}

export function SiteHeader({ navLinks, user }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuId = "site-mobile-navigation"

  const { user: authUser, isAuthenticated, openAuthModal } = useAuth()

  const agentPortalUrl = process.env.NEXT_PUBLIC_AGENT_PORTAL_URL
  const hasAgentPortal = typeof agentPortalUrl === "string" && agentPortalUrl.length > 0

  const effectiveUser = user || (authUser ? { name: authUser.full_name || authUser.email } : null)

  const profileInitials = useMemo(() => {
    if (!effectiveUser?.name) return null
    const parts = effectiveUser.name.trim().split(/\s+/)
    if (parts.length === 0) return null
    const initials = parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
    return initials || null
  }, [effectiveUser?.name])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/favicon_io/android-chrome-192x192.png"
              alt="HAMGAB logo"
              width={50}
              height={50}
            />
            <span className="text-xl font-semibold tracking-tight">HAMGAB</span>
          </Link>

          {/* Center navigation (desktop) */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right cluster: Become an agent + profile + menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {hasAgentPortal && (
              <a
                href={agentPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden text-sm font-medium text-foreground/90 hover:text-foreground sm:inline-block"
              >
                Become an agent
              </a>
            )}

            {/* Profile icon / initials */}
            <Link
              href="/profile"
              aria-label={isAuthenticated ? "Open profile" : "Open profile (sign in required)"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground shadow-sm transition hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                if (!isAuthenticated) {
                  event.preventDefault()
                  openAuthModal("login")
                }
              }}
            >
              {effectiveUser?.avatarUrl ? (
                <Image
                  src={effectiveUser.avatarUrl}
                  alt={effectiveUser.name || "User profile"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : profileInitials ? (
                <span className="text-xs font-semibold uppercase tracking-wide">{profileInitials}</span>
              ) : (
                <User className="h-4 w-4" />
              )}
            </Link>

            {/* Hamburger menu button (mobile / tablet) */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground shadow-sm transition hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              type="button"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet navigation drawer */}
        {mobileMenuOpen && (
          <motion.div
            id={mobileMenuId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border py-4 lg:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                {hasAgentPortal && (
                  <a
                    href={agentPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-foreground/90 hover:text-foreground"
                  >
                    Become an agent
                  </a>
                )}

                <button
                  type="button"
                  className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    if (isAuthenticated) {
                      window.location.href = "/profile"
                    } else {
                      openAuthModal("login")
                    }
                  }}
                >
                  Profile
                </button>

                <Link
                  href="/help"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Help Center
                </Link>

                <div className="flex flex-col gap-1.5 pt-2">
                  <button
                    type="button"
                    className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openAuthModal("login")
                    }}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    className="text-left text-sm font-medium text-foreground transition-colors hover:text-foreground"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openAuthModal("register")
                    }}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
