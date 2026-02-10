import type React from "react"
import type { Metadata, Viewport } from "next"
import { Abyssinica_SIL, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ErrorBoundary } from "@/components/error-boundary"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import "./globals.css"

const abyssinica = Abyssinica_SIL({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-abyssinica",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "HAMGAB | Modern Property Management Platform",
  description:
    "Discover, list, and manage properties with our comprehensive platform for owners, tenants, agents, and administrators.",
  generator: "Glenzzy",
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico", sizes: "any" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HAMGAB | Modern Property Management Platform",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "HAMGAB",
    title: "HAMGAB | Modern Property Management Platform",
    description: "Manage your property listings and grow your business",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${abyssinica.variable} ${geistMono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          {children}
          <GlobalErrorHandler />
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
}
