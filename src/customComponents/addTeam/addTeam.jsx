"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { fetchTeams } from "@/utils/reduxSclices/teamSlice"
import { TeamCard } from "./teamCard"
import { PlayerCardSkeleton } from "../loaders/PlayerCardSkeleton"
import { defaultImage } from "@/utils/Basic/constant"

export function AddTeams() {
  const dispatch = useDispatch()
  const { teams, loading } = useSelector((state) => state.teams)

  useEffect(() => {
    if (teams.length === 0) dispatch(fetchTeams())
  }, [dispatch, teams.length])

  return (
    <section className="mt-6">
      <div className="px-4 flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">My Teams</h3>

        <Link href="/allTeams" className="text-primary text-sm font-semibold">
          View all
        </Link>
      </div>

      <div className="px-4 flex gap-x-4">
        {/* Add Team Card */}
        <Link
          href="/RegisterTeam"
          className="min-w-[160px] flex flex-col items-center justify-center aspect-square border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 cursor-pointer"
        >
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <span className="material-symbols-outlined">groups</span>
          </div>

          <p className="text-sm font-medium text-primary">Add Team</p>
        </Link>

        {/* Teams List */}
        <div className="w-full flex overflow-x-auto no-scrollbar gap-x-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0">
                  <PlayerCardSkeleton />
                </div>
              ))
            : teams.map((team) => (
                <div key={team._id} className="shrink-0">
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
