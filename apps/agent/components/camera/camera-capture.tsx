/**
 * Camera Capture Component
 * Provides live camera interface for capturing property images
 */

"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface CameraCaptureProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (file: File, preview: string) => void
  videoRef: React.MutableRefObject<HTMLVideoElement | null>
  stream: MediaStream | null
  error: string | null
}

export function CameraCapture({
  isOpen,
  onClose,
  onCapture,
  videoRef,
  stream,
  error,
}: CameraCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Attach stream to video when it changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err)
      })
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [stream, videoRef])

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return

        // Create File from blob
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const file = new File([blob], `property-photo-${timestamp}.jpg`, {
          type: "image/jpeg",
        })

        // Create preview URL
        const preview = URL.createObjectURL(blob)

        onCapture(file, preview)
      },
      "image/jpeg",
      0.95
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Capture Property Photo
          </DialogTitle>
          <DialogDescription>
            Position the property in the frame and tap the capture button
          </DialogDescription>
        </DialogHeader>

        <div className="relative bg-black">
          {/* Video Preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto max-h-[70vh] object-contain"
          />

          {/* Canvas (hidden, used for capture) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Error Message */}
          {error && (
            <div className="absolute top-4 left-4 right-4 bg-destructive text-destructive-foreground p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Capture Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="h-14 w-14 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              onClick={handleCapture}
              size="icon"
              className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 border-4 border-background shadow-lg"
              disabled={!stream || !!error}
            >
              <Camera className="h-8 w-8" />
            </Button>

            <div className="h-14 w-14" /> {/* Spacer for symmetry */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

