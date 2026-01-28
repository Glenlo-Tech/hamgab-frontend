import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import { Toaster } from "@/components/ui/toaster"
import { SWRProvider } from "@/components/providers/swr-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Agent Portal | HAMGAB",
  description: "Manage your property listings and grow your business",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "/favicon_io/favicon.ico" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HAMGAB Agent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "HAMGAB Agent Portal",
    title: "Agent Portal | HAMGAB",
    description: "Manage your property listings and grow your business",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <SWRProvider>
            {children}
            <GlobalErrorHandler />
            <ServiceWorkerRegister />
            <Toaster />
            <Analytics />
          </SWRProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

