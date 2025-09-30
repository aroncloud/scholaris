import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '../ui/card';

const BoxedSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-24" />
                <Separator orientation="vertical" className="h-6" />
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
    </div>    
  )
}

export default BoxedSkeleton