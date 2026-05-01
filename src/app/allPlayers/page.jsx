"use client"

import { PlayerCard } from "@/customComponents/addPlayer/playerCard"
import { Search, ArrowLeft, Users, Shield, History, Trophy, Home } from "lucide-react"
import Link from "next/link"

export default function PlayersBackground() {
  return (
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
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
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
          {/* <div className="bg-white rounded-xl shadow-sm border p-4"> */}
          <PlayerCard
            variant="detailed"
            name="Jameson Sterling"
            role="Opening Batsman • Right-Arm Fast"
            image="/player.jpg"
            team="Green Valley XI"
            rank={1}
            inSquad={true}
            onAction={() => console.log("view")}
          />
          {/* </div> */}

          <PlayerCard
            variant="detailed"
            name="Arjun Mehta"
            role="Wicket Keeper • Middle Order"
            image="/player2.jpg"
            team="Unassigned"
            rank={null}
            inSquad={false}
            onAction={() => console.log("add")}
          />

          <PlayerCard
            variant="detailed"
            name="Marcus Thorne"
            role="All-Rounder • Leg Break"
            image="/player3.jpg"
            team="Southern Strikers"
            rank={14}
            inSquad={true}
            onAction={() => console.log("view")}
          />
        </div>
      </main>
    </div>
  )
}
