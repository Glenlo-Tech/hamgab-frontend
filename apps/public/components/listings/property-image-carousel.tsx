/**
 * Property Image Carousel Component for Public Listings
 * Displays multiple property images with navigation
 */

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PropertyImageCarouselProps {
  images: string[]
  propertyTitle: string
  className?: string
  disableLightbox?: boolean // If true, clicking won't open lightbox (useful when inside a clickable card)
}

/**
 * Normalize image URL - handles both absolute and relative paths
 */
function normalizeImageUrl(filePath: string | undefined | null): string {
  if (!filePath) return "/placeholder.svg"
  
  // If it's already an absolute URL (starts with http:// or https://), return as-is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath
  }
  
  // If it's a relative path, prepend the API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  if (apiBaseUrl) {
    // Remove trailing slash from API base URL and leading slash from file path
    const base = apiBaseUrl.replace(/\/$/, "")
    const path = filePath.startsWith("/") ? filePath : `/${filePath}`
    return `${base}${path}`
  }
  
  // Fallback: return as-is (might be a local path)
  return filePath.startsWith("/") ? filePath : `/${filePath}`
}

/**
 * Compact carousel for property card (shows dots and allows navigation)
 */
export function PropertyImageCarousel({
  images,
  propertyTitle,
  className,
  disableLightbox = false,
}: PropertyImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  // Normalize image URLs
  const normalizedImages = images.map(img => normalizeImageUrl(img))

  // Preload adjacent images
  useEffect(() => {
    if (!normalizedImages || normalizedImages.length === 0) return

    const prevIndex = currentIndex === 0 ? normalizedImages.length - 1 : currentIndex - 1
    const nextIndex = currentIndex === normalizedImages.length - 1 ? 0 : currentIndex + 1
    
    const indicesToPreload = [prevIndex, nextIndex]
    
    indicesToPreload.forEach((index: number) => {
      if (index !== currentIndex && normalizedImages[index] && !failedImages.has(index)) {
        const img = new window.Image()
        img.src = normalizedImages[index]
      }
    })
  }, [currentIndex, normalizedImages, failedImages])

  // Handle image load errors
  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index))
  }

  if (!normalizedImages || normalizedImages.length === 0) {
    return (
      <div
        className={cn(
          "relative bg-muted",
          className ?? "w-full h-48 md:h-64"
        )}
      >
        <Image
          src="/placeholder.svg"
          alt={propertyTitle}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
          priority
        />
      </div>
    )
  }

  const hasMultipleImages = normalizedImages.length > 1

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? normalizedImages.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === normalizedImages.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const handleCarouselClick = (e: React.MouseEvent) => {
    if (disableLightbox) {
      // If lightbox is disabled, don't do anything (let parent handle click)
      return
    }
    e.stopPropagation() // Prevent card click from firing
    if (hasMultipleImages) {
      setIsLightboxOpen(true)
    }
  }

  return (
    <>
      <div
        className={cn(
          "relative group",
          !disableLightbox && hasMultipleImages && "cursor-pointer",
          className ?? "w-full h-48 md:h-64"
        )}
        onClick={handleCarouselClick}
      >
        {/* Main Image */}
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          {/* Render all images but only show current one */}
          {normalizedImages.map((image, index) => {
            const imageSrc = failedImages.has(index) ? "/placeholder.svg" : image
            return (
              <motion.div
                key={`image-${index}`}
                initial={false}
                animate={{
                  opacity: index === currentIndex ? 1 : 0,
                  scale: index === currentIndex ? 1 : 1.05,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0"
                style={{ pointerEvents: index === currentIndex ? "auto" : "none" }}
              >
                <Image
                  src={imageSrc}
                  alt={`${propertyTitle} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 256px"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  onError={() => handleImageError(index)}
                />
              </motion.div>
            )
          })}

          {/* Navigation Arrows - Show on hover (desktop) and always visible on mobile */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 cursor-pointer -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-black/80 z-10 shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-white cursor-pointer" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-black/80 z-10 shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-white cursor-pointer" />
              </button>
            </>
          )}

          {/* Image Counter Badge */}
          {hasMultipleImages && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs font-medium z-10">
              {currentIndex + 1}/{normalizedImages.length}
            </div>
          )}

          {/* Improved Dots Indicator - Smaller on mobile */}
          {hasMultipleImages && normalizedImages.length <= 8 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {normalizedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    goToImage(index)
                  }}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    "h-1.5 sm:h-2",
                    index === currentIndex
                      ? "w-4 sm:w-6 bg-white shadow-md"
                      : "w-1.5 sm:w-2 bg-white/60 hover:bg-white/80"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full-Screen Viewing */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent 
          className="max-w-7xl w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-h-[95vh] p-0 gap-0 border-0" 
        >
          {/* Professional Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className={cn(
              "absolute top-3 right-3 sm:top-4 sm:right-4 z-50",
              "h-9 w-9 sm:h-10 sm:w-10",
              "rounded-full",
              "bg-black/80 hover:bg-black",
              "backdrop-blur-md",
              "flex items-center justify-center",
              "transition-all duration-200",
              "shadow-lg hover:shadow-xl",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              "group cursor-pointer"
            )}
            aria-label="Close gallery"
          >
            <X className="h-5 w-5 sm:h-5 sm:w-5 text-white group-hover:rotate-90 transition-transform duration-200 " />
          </button>

          {/* Header - Hidden on mobile for cleaner look */}
          <DialogHeader className="hidden sm:block p-4 sm:p-6 border-b bg-background/95 backdrop-blur-sm">
            <DialogTitle className="text-lg">{propertyTitle}</DialogTitle>
          </DialogHeader>

          <div className="relative h-[65vh] sm:h-[70vh] bg-black">
            {/* Main Image Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={failedImages.has(currentIndex) ? "/placeholder.svg" : normalizedImages[currentIndex]}
                  alt={`${propertyTitle} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  onError={() => handleImageError(currentIndex)}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className={cn(
                    "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2",
                    "h-10 w-10 sm:h-12 sm:w-12",
                    "rounded-full",
                    "bg-black/80 hover:bg-black",
                    "backdrop-blur-md",
                    "flex items-center justify-center",
                    "transition-all duration-200",
                    "shadow-lg hover:shadow-xl hover:scale-110",
                    "z-10  cursor-pointer"
                  )}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white cursor-pointer" />
                </button>
                <button
                  onClick={goToNext}
                  className={cn(
                    "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2",
                    "h-10 w-10 sm:h-12 sm:w-12",
                    "rounded-full",
                    "bg-black/80 hover:bg-black",
                    "backdrop-blur-md",
                    "flex items-center justify-center",
                    "transition-all duration-200",
                    "shadow-lg hover:shadow-xl hover:scale-110",
                    "z-10 cursor-pointer"
                  )}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white cursor-pointer" />
                </button>
              </>
            )}

            {/* Image Counter - Professional Style */}
            {hasMultipleImages && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:bottom-4 sm:top-auto bg-black/80 backdrop-blur-md text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium z-10 shadow-lg">
                {currentIndex + 1} of {normalizedImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip - Improved spacing and sizing */}
          {hasMultipleImages && normalizedImages.length > 1 && (
            <div className="p-3 sm:p-4 border-t bg-muted/50 overflow-x-auto">
              <div className="flex items-center gap-2 sm:gap-3 justify-start sm:justify-center">
                {normalizedImages.map((image, index) => {
                  const thumbnailSrc = failedImages.has(index) ? "/placeholder.svg" : image
                  return (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={cn(
                        "relative rounded-md overflow-hidden border-2 transition-all flex-shrink-0",
                        "h-14 w-14 sm:h-20 sm:w-20",
                        index === currentIndex
                          ? "border-primary scale-105 shadow-lg"
                          : "border-transparent hover:border-primary/50 opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={thumbnailSrc}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        loading="lazy"
                        onError={() => handleImageError(index)}
                      />
                      {/* Selected indicator */}
                      {index === currentIndex && (
                        <div className="absolute inset-0 bg-primary/10" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

