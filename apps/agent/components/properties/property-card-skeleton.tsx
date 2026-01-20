/**
 * Property Card Skeleton
 * Loading skeleton for property cards
 */

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image Skeleton */}
        <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Content Skeleton */}
        <CardContent className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export function PropertyCardSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </>
  )
}

