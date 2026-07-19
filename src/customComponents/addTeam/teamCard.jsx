"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TeamCard({
  name,
  avatar,
  playersCount,
  rank,
  teamId,
  variant = "compact",
  onAction,
}) {

  // =========================
  // COMPACT (grid / add page)
  // =========================
  if (variant === "compact") {
    return (
    
      <Link href={`/manegeTeams/${teamId}`}>
      
      <div className="w-[160px] border-2 border-dashed border-black/10 aspect-square flex flex-col items-center justify-center rounded-lg bg-background p-4 text-center hover:shadow-md transition">
        
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-primary/10">
          <img
            src={avatar}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Name */}
        <div className="w-full overflow-x-scroll no-scrollbar">
          <h3 className="text-sm font-semibold">{name}</h3>
        </div>

        {/* Players Count */}
        <div className="w-full overflow-x-scroll no-scrollbar">
          <p className="text-xs text-muted-foreground uppercase mb-3">
            {playersCount} players
          </p>
        </div>

        {/* Button */}
        <Button
          size="sm"
          className="w-full text-xs text-white"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onAction?.(e)
          }}
        >
          View
        </Button>
      </div>
     </Link>
    )
  }

  // =========================
  // DETAILED (list page)
  // =========================
  return (
    <div className="bg-background rounded-xl shadow-sm hover:shadow-md transition relative">
      
      {/* Top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-muted">
            <img
              src={avatar}
              alt={name}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Rank (optional like PlayerCard) */}
          {rank && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              #{rank}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left w-full">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
              {name}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground uppercase mb-1">
            {playersCount} players
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground">
            Team Squad
          </p>
        </div>

        {/* Button */}
        <div className="w-full sm:w-auto">
          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onAction?.(e)
            }}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  )
}