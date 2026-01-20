/**
 * Camera Capture Hook
 * Handles live camera capture for property images
 */

import React, { useState, useRef, useCallback } from "react"

export interface CameraCaptureResult {
  file: File
  preview: string
}

export interface UseCameraCaptureReturn {
  isOpen: boolean
  isCapturing: boolean
  error: string | null
  openCamera: () => Promise<void>
  closeCamera: () => void
  capturePhoto: () => Promise<CameraCaptureResult | null>
  stream: MediaStream | null
  videoRef: React.MutableRefObject<HTMLVideoElement | null>
}

export function useCameraCapture(): UseCameraCaptureReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const openCamera = useCallback(async () => {
    try {
      setError(null)
      setIsCapturing(true)

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      setStream(mediaStream)
      setIsOpen(true)
      setIsCapturing(false)

      // Attach stream to video element if ref exists
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
    } catch (err) {
      setIsCapturing(false)
      setIsOpen(false)
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Camera permission denied. Please allow camera access.")
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setError("No camera found. Please connect a camera device.")
        } else {
          setError("Failed to access camera. Please try again.")
        }
      } else {
        setError("Failed to access camera. Please try again.")
      }
    }
  }, [])

  const closeCamera = useCallback(() => {
    // Stop all tracks
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsOpen(false)
    setError(null)
  }, [stream])

  const capturePhoto = useCallback(async (): Promise<CameraCaptureResult | null> => {
    if (!videoRef.current || !stream) {
      setError("Camera not ready. Please open camera first.")
      return null
    }

    try {
      // Create canvas to capture frame
      const canvas = document.createElement("canvas")
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Failed to capture photo. Please try again.")
        return null
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to create image blob"))
            }
          },
          "image/jpeg",
          0.95 // Quality
        )
      })

      // Create File from blob
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const file = new File([blob], `property-photo-${timestamp}.jpg`, {
        type: "image/jpeg",
      })

      // Create preview URL
      const preview = URL.createObjectURL(blob)

      return { file, preview }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to capture photo")
      return null
    }
  }, [stream])

  return {
    isOpen,
    isCapturing,
    error,
    openCamera,
    closeCamera,
    capturePhoto,
    stream,
    // Expose videoRef for component to use
    videoRef: videoRef as React.MutableRefObject<HTMLVideoElement | null>,
  }
}

