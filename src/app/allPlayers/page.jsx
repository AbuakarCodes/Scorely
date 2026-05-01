"use client"

import axios from "axios"
import { PlayerCard } from "@/customComponents/addPlayer/playerCard"
import { Search, Home } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlayers } from "@/utils/reduxSclices/playerSlice"
import PageLoader from "@/customComponents/loaders/pageLoader"

export default function PlayersBackground() {
  const dispatch = useDispatch()

  const { players, loading, error } = useSelector((state) => state.players)

  useEffect(() => {
    if (players.length === 0) dispatch(fetchPlayers())
  }, [])

  if (error) return <p>{error}</p>

  return (
    <>
      {loading && <PageLoader />}
      <div className="min-h-screen bg-surface text-black">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-50 shadow-md">
          {/* TOP BAR (PRIMARY ONLY) */}
          <div className="px-5 py-4 flex bg-primary items-center gap-x-1  text-white">
            <Link href="/">
              <Home className="text-white" size={20} />
            </Link>
            <h1 className="text-lg font-bold">Select Players</h1>
          </div>

          {/* SEARCH + FILTER AREA (GRAY SECTION) */}
          <div className="bg-slate-100 px-5 py-4 space-y-3">
            {/* SEARCH */}
            <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-3 py-2">
              <Search size={18} className="text-primary" />
              <input
                placeholder="Search by name, role or team..."
                className="bg-transparent outline-none w-full text-sm text-black placeholder:text-primary"
              />
            </div>

            {/* FILTERS */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
              {["All", "Batsman", "Bowler", "All-Rounder", "In Squad", "Free"].map((item) => (
                <button
                  key={item}
                  className="
            whitespace-nowrap px-4 py-1.5 rounded-full text-sm
            bg-gray-200 text-primary
            hover:bg-gray-300 transition
          "
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* PLAYER CARDS */}
          <div className="space-y-5">
            {players.map((player) => (
              <PlayerCard
                key={player._id}
                variant="detailed"
                name={player.name}
                role={player.role}
                image={
                  player.avatar ||
                  "https://res.cloudinary.com/dtrrzyutr/image/upload/fl_preserve_transparency/v1777660543/playres_default_profile_o205zq.jpg?_s=public-apps"
                }
                team={player.teamId || "Unassigned"}
                rank={null}
                inSquad={player.isActive}
                onAction={() => console.log("view", player._id)}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
