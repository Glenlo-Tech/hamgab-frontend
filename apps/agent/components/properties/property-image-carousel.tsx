/**
 * Property Image Carousel Component
 * Displays multiple property images with navigation
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
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
}

/**
 * Compact carousel for property card (shows dots and allows navigation)
 */
export function PropertyImageCarousel({
  images,
  propertyTitle,
  className,
}: PropertyImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className={cn("relative h-48 md:h-auto md:w-64 flex-shrink-0 bg-muted", className)}>
        <Image
          src="/placeholder.svg"
          alt={propertyTitle}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
        />
      </div>
    )
  }

  const hasMultipleImages = images.length > 1

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      <div
        className={cn(
          "relative h-48 md:h-auto md:w-64 flex-shrink-0 group cursor-pointer",
          className
        )}
        onClick={() => hasMultipleImages && setIsLightboxOpen(true)}
      >
        {/* Main Image */}
        <div className="relative h-full w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentIndex]}
                alt={`${propertyTitle} - Image ${currentIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 256px"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Show on hover */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image Counter Badge */}
          {hasMultipleImages && (
            <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium z-10">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Dots Indicator */}
          {hasMultipleImages && images.length <= 5 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 sm:gap-1.5 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    goToImage(index)
                  }}
                  className={cn(
                    "rounded-full transition-all duration-300 shrink-0",
                    index === currentIndex
                      ? "bg-primary sm:h-2 sm:w-6"
                      : "bg-background/60 hover:bg-background/80 sm:h-2 sm:w-2"
                  )}
                  style={{
                    height: index === currentIndex ? "3px" : "3px",
                    width: index === currentIndex ? "8px" : "3px",
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Click hint for multiple images */}
          {hasMultipleImages && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full-Screen Viewing */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-6xl w-full p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span>{propertyTitle} - Image Gallery</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLightboxOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="relative h-[70vh] bg-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`${propertyTitle} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium z-10">
                {currentIndex + 1} of {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {hasMultipleImages && images.length > 1 && (
            <div className="p-4 border-t bg-muted/30 overflow-x-auto">
              <div className="flex items-center gap-2 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={cn(
                      "relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                      index === currentIndex
                        ? "border-primary scale-105"
                        : "border-transparent hover:border-muted-foreground/50 opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

