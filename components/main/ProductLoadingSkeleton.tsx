import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils'

interface ProductLoadingSkeletonProps {
  length: number
  className?: string
  InnerClass?: string
}

const ProductLoadingSkeleton = ({
  length,
  className,
  InnerClass
}: ProductLoadingSkeletonProps) => {
  const placeholders = Array.from({ length })

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
        className
      )}
    >
      {placeholders.map((_, idx) => (
        <div
          key={idx}
          className={cn(
            'rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col animate-pulse',
            InnerClass
          )}
        >
          {/* Image area */}
          <Skeleton className="h-48 w-full bg-gray-200" />

          {/* Content area */}
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
            <Skeleton className="h-10 w-full bg-gray-300 rounded-md mt-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductLoadingSkeleton
