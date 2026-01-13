"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Building2, Menu, X, Plus } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "#properties", label: "Properties" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            <div>
              <span className="text-xl font-semibold tracking-tight block">HAMGAB</span>
              <span className="text-xs text-muted-foreground">Agent Portal</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
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

          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden py-4 border-t border-border"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Property
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
