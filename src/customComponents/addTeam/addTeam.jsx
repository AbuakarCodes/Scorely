"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { fetchTeams } from "@/utils/reduxSclices/teamSlice"
import { TeamCard } from "./teamCard"
import { PlayerCardSkeleton } from "../loaders/PlayerCardSkeleton"
import { defaultImage } from "@/utils/Basic/constant"
import { Plus } from "lucide-react"
import { AddCard } from "../BasicComponents/addCardButton"

export function AddTeams() {
  const dispatch = useDispatch()
  const { teams, loading } = useSelector((state) => state.teams)

  useEffect(() => {
    if (teams.length === 0) dispatch(fetchTeams())
  }, [])

  return (
    <section className="mt-6 ">
      <div className="px-4 flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">My Teams</h3>

        <Link href="/allTeams" className="text-primary text-sm font-semibold">
          View all
        </Link>
      </div>

      <div className="px-4 flex  gap-x-4">
        {/* Add Team Card */}
        <AddCard href="/RegisterTeam" text={"Add Team"} />

        {/* Teams List */}
        <div className="w-full  flex overflow-x-auto no-scrollbar gap-x-1">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0">
                  <PlayerCardSkeleton />
                </div>
              ))
            : teams.map((team) => (
                <div key={team._id} className="shrink-0 border">
                  <TeamCard
                    name={team?.name || "###"}
                    avatar={team.avatar || defaultImage}
                    playersCount={team?.playersCount || "###"}
                    onAction={() => console.log("view team", team._id)}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
