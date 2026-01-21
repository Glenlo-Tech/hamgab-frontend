/**
 * Camera Capture Hook - FIXED VERSION
 * Handles live camera capture for property images
 */

import React, { useState, useRef, useCallback, useEffect } from "react"

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

  // Clean up stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  const openCamera = useCallback(async () => {
    try {
      setError(null)
      setIsCapturing(true)

      // Request camera with optimal settings
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prefer back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false,
      })

      setStream(mediaStream)
      setIsOpen(true)

      // Wait a bit for the video element to be ready
      await new Promise(resolve => setTimeout(resolve, 100))

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Wait for metadata to load
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not found"))
            return
          }

          const video = videoRef.current
          
          const onLoadedMetadata = () => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata)
            resolve()
          }

          const onError = () => {
            video.removeEventListener("error", onError)
            reject(new Error("Video loading error"))
          }

          video.addEventListener("loadedmetadata", onLoadedMetadata)
          video.addEventListener("error", onError)

          // Start playing
          video.play().catch(reject)
        })
      }

      setIsCapturing(false)
    } catch (err) {
      setIsCapturing(false)
      setIsOpen(false)
      
      // Clean up stream on error
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }

      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Camera permission denied. Please allow camera access in your browser settings.")
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setError("No camera found. Please connect a camera device.")
        } else {
          setError(`Failed to access camera: ${err.message}`)
        }
      } else {
        setError("Failed to access camera. Please try again.")
      }
    }
  }, [stream])

  const closeCamera = useCallback(() => {
    // Stop all tracks
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsOpen(false)
    setError(null)
  }, [stream])

  const capturePhoto = useCallback(async (): Promise<CameraCaptureResult | null> => {
    if (!videoRef.current || !stream) {
      setError("Camera not ready. Please open camera first.")
      return null
    }

    const video = videoRef.current

    // Check if video is actually playing
    if (video.readyState < 2) {
      setError("Video not ready. Please wait a moment and try again.")
      return null
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("Invalid video dimensions. Please try reopening the camera.")
      return null
    }

    try {
      // Create canvas to capture frame
      const canvas = document.createElement("canvas")
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
          0.95
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
    videoRef: videoRef as React.MutableRefObject<HTMLVideoElement | null>,
  }
}