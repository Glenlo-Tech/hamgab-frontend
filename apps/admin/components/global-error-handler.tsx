"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function GlobalErrorHandler() {
  const [error, setError] = useState<Error | null>(null)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)
      
      const errorMessage = event.reason?.message || event.reason || "An unexpected error occurred"
      setError(new Error(errorMessage))
      setShowError(true)
      
      // Prevent default browser error handling
      event.preventDefault()
    }

    // Handle general errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error)
      
      setError(event.error || new Error(event.message || "An unexpected error occurred"))
      setShowError(true)
      
      // Prevent default browser error handling
      event.preventDefault()
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [])

  const handleRefresh = () => {
    setShowError(false)
    setError(null)
    window.location.reload()
  }

  const handleDismiss = () => {
    setShowError(false)
    setError(null)
  }

  if (!showError || !error) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md border-2 border-destructive/50 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl font-bold">An Error Occurred</CardTitle>
          <CardDescription className="text-sm mt-2">
            Something unexpected happened. You can try refreshing the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error.message && (
            <div className="rounded-lg bg-muted p-3 border border-border">
              <p className="text-xs font-mono text-destructive break-words">
                {error.message}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            onClick={handleRefresh}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1"
          >
            Dismiss
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
