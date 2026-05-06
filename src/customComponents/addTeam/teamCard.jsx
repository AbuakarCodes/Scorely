"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export function TeamCard({ name, avatar, playersCount, onAction }) {
  return (
    <div className="w-[160px] aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-black/10 bg-background p-4 text-center hover:shadow-md transition">
      
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-primary/10">
        <img
          src={avatar}
          alt={name}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Team Name */}
      <h3 className="text-sm font-semibold truncate w-full">{name}</h3>

      {/* Players Count */}
      <p className="text-xs text-muted-foreground mb-3">
        {playersCount} Players
      </p>

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
        View Profile
      </Button>
    </div>
  )
}