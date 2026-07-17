"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios"
import { deletePlayer } from "@/utils/reduxSclices/playerSlice"
import { useDispatch, useSelector } from "react-redux"
import { fetchTeams } from "@/utils/reduxSclices/teamSlice"

export function PlayerCard({ name, role, image, team, rank, inSquad, playerId, variant = "compact" }) {
  const { deletePlayer_Loading, deletePlayer_error } = useSelector((state) => state.players)
  const dispatch = useDispatch()
  async function deletePlayer_handler(e) {
    e.stopPropagation()
    e.preventDefault()
     await dispatch(deletePlayer(playerId))
     await dispatch(fetchTeams())
  }

  // COMPACT (grid / add page)
  if (variant === "compact") {
    return (
      <div className="w-[160px]  border-2 border-dashed border-black/10 aspect-square flex flex-col items-center justify-center  rounded-lg   bg-background p-4 text-center hover:shadow-md transition">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-primary/10">
          <img src={image} alt={name} width={64} height={64} className="object-cover w-full h-full" />
        </div>

        <div className="w-full overflow-x-scroll no-scrollbar">
          <h3 className="text-sm font-semibold ">{name}</h3>
        </div>

        <div className="w-full overflow-x-scroll no-scrollbar">
          <p className="text-xs text-muted-foreground uppercase mb-3">{role}</p>
        </div>

        <Button
          size="sm"
          className="w-full text-xs text-white"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          Add
        </Button>
      </div>
    )
  }

  // DETAILED (profile/list page)
  return (
    <Link href={`/player/${playerId}`}>
      <div className="bg-background rounded-xl shadow-sm hover:shadow-md transition relative">
        {/* top bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-muted">
              <img src={image} alt={name} width={120} height={120} className="object-cover w-full h-full" />
            </div>

            {rank && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                #{rank}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-center sm:text-left w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">{name}</h2>

              {inSquad && (
                <span className="bg-emerald-100 text-emerald-900 text-[10px] px-2 py-0.5 rounded font-bold w-fit mx-auto sm:mx-0">
                  ✓ IN SQUAD
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground uppercase mb-1">{role}</p>

            {team && <p className="text-xs sm:text-sm text-muted-foreground">{team}</p>}
          </div>

          {/* Button */}
          <div className="w-full flex flex-col gap-y-1 sm:w-auto">
            <Button
              disabled={deletePlayer_Loading}
              className="disabled:opacity-25 w-full bg-red-500  sm:w-auto"
              onClick={deletePlayer_handler}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
