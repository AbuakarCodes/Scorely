"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

export function AddCard({ href, text="Add" }) {
  return (
    <Link
      href={href}
      className="
        min-w-[60px] md:min-w-[160px]
        aspect-square
        flex flex-col items-center justify-center
        border-2 border-dashed border-primary/20
        rounded-xl bg-primary/5
        hover:bg-primary/10
        cursor-pointer
        transition
      "
    >
      {/* Icon */}
      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
        <Plus />
      </div>

      {/* Text */}
      <p className="hidden md:block text-sm font-medium text-primary">
      {text}
      </p>
    </Link>
  )
}