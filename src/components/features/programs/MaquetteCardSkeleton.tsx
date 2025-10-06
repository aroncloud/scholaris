import React from 'react'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const MaquetteCardSkeleton = () => {
  return (
    <Card className="border-l-4 border-l-blue-500 gap-4">
      <CardHeader>
        {/* Header avec titre et actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-2">
              {/* Chevron skeleton */}
              <Skeleton className="h-10 w-10 rounded" />
              {/* Titre skeleton */}
              <Skeleton className="h-6 w-64" />
            </div>
            {/* Description skeleton */}
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          {/* Badge et menu skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-7 w-7 rounded" />
          </div>
        </div>

        {/* Séquences badges skeleton */}
        <div className="flex flex-wrap gap-2 text-sm mt-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>
      </CardHeader>
    </Card>
  )
}

export default MaquetteCardSkeleton