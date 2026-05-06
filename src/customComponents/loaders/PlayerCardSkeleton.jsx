"use client"

import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export function PlayerCardSkeleton({ variant = "compact" }) {

  if (variant === "compact") {
    return (
      <div className="min-w-[160px] aspect-square border-2 border-dashed border-black/10 rounded-lg bg-background p-4 flex flex-col items-center justify-center space-y-1">

        <Skeleton circle height={54} width={54} />
        <Skeleton height={14} width={90} />
        <Skeleton height={12} width={70} />
        <Skeleton height={32} width={120} borderRadius={6} />
      </div>
    )
  }

  return (
    <div className="bg-background rounded-xl shadow-sm relative overflow-hidden">

      {/* top bar */}
      <div className="absolute top-0 left-0 w-full h-1">
        <Skeleton height={4} />
      </div>

      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">

        {/* Avatar + rank */}
        <div className="relative flex-shrink-0">
          <Skeleton circle height={96} width={96} />

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <Skeleton height={18} width={40} borderRadius={999} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left space-y-2 w-full">

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Skeleton height={24} width={180} />

            <Skeleton height={16} width={80} />
          </div>

          <Skeleton height={14} width={120} />

          <Skeleton height={14} width={160} />
        </div>

        {/* Button */}
        <div className="w-full sm:w-auto">
          <Skeleton height={40} width={140} />
        </div>

      </div>
    </div>
  )
}