/**
 * Camera Capture Component - FIXED VERSION
 * Provides live camera interface for capturing property images
 */

"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"

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
    const video = videoRef.current

    if (!video || !stream || !isOpen) {
      return
    }

    // Set video element properties for better compatibility
    video.srcObject = stream
    video.muted = true
    video.playsInline = true
    video.autoplay = true

    const handleLoadedMetadata = () => {
      // Force play after metadata loads
      video.play().catch((err) => {
        console.error("Error starting video playback:", err)
      })
    }

    const handleCanPlay = () => {
      // Additional play attempt when video can play
      video.play().catch((err) => {
        console.error("Error on canplay:", err)
      })
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("canplay", handleCanPlay)

    // Immediate play attempt
    video.play().catch((err) => {
      console.error("Initial play error:", err)
    })

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("canplay", handleCanPlay)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [stream, videoRef, isOpen])

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref not available")
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    // Validate video is ready
    if (video.readyState < 2) {
      console.error("Video not ready, readyState:", video.readyState)
      return
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Invalid video dimensions:", video.videoWidth, video.videoHeight)
      return
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Could not get canvas context")
      return
    }

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Failed to create blob")
          return
        }

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

        <div className="relative bg-black min-h-[400px] flex items-center justify-center">
          {/* Video Preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto max-h-[70vh] object-contain"
            style={{ 
              display: stream ? 'block' : 'none',
              minHeight: '400px'
            }}
          />

          {/* Loading indicator */}
          {stream && !error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-white text-sm">
                {videoRef.current?.readyState === 4 ? "" : "Loading camera..."}
              </div>
            </div>
          )}

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