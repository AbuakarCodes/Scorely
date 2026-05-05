"use client"

import { PlayerCard } from "@/customComponents/addPlayer/playerCard"
import { Search, Home } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlayers } from "@/utils/reduxSclices/playerSlice"
import PageLoader from "@/customComponents/loaders/pageLoader"
import { PlayerCardSkeleton } from "@/customComponents/loaders/PlayerCardSkeleton"

export default function PlayersBackground() {
  const dispatch = useDispatch()
  const { players, loading, error } = useSelector((state) => state.players)

  const [localPlayers, setLocalPlayers] = useState([])
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchTermInput, setSearchTermInput] = useState("")

  // Fetch players
  useEffect(() => {
    if (players.length === 0) dispatch(fetchPlayers())
  }, [])

  // Sync redux → local
  useEffect(() => {
    setLocalPlayers(players)
  }, [players])

  // Filter + Search handler
  const applyFilters = (filter, search = searchTermInput) => {
    let filtered = [...players]

    // FILTER
    const f = filter.toLowerCase()

    if (f === "batsman" || f === "bowler" || f === "all-rounder") {
      filtered = filtered.filter((p) => p.role === f)
    } else if (f === "in squad") {
      filtered = filtered.filter((p) => p.teamId)
    } else if (f === "free") {
      filtered = filtered.filter((p) => !p.teamId)
    }

    if (search && search.trim() !== "") {
      const s = search.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(s))
    }

    setLocalPlayers(filtered)
  }
  const handleFilter = (filter) => {
    setActiveFilter(filter)
    applyFilters(filter)
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTermInput(value)
    applyFilters(activeFilter, value)
  }

  if (error) return <p>{error}</p>

  return (
    <>
    

      <div className="min-h-screen bg-surface text-black">
        <Header
          searchTermInput={searchTermInput}
          handleSearch={handleSearch}
          handleFilter={handleFilter}
          activeFilter={activeFilter}
        />

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <div className="space-y-5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <PlayerCardSkeleton variant="detail" key={i} />)
            ) : localPlayers.length > 0 || !loading ? (
              localPlayers.map((player) => (
                <PlayerCard
                  key={player._id}
                  variant="detailed"
                  name={player.name}
                  role={player.role}
                  image={
                    player.avatar ||
                    "https://res.cloudinary.com/dtrrzyutr/image/upload/fl_preserve_transparency/v1777660543/playres_default_profile_o205zq.jpg?_s=public-apps"
                  }
                  team={player.teamId || "Un Caped"}
                  rank={null}
                  inSquad={Boolean(player.teamId)}
                  onAction={() => console.log("view", player._id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No players found</p>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

const Header = ({ searchTermInput, handleSearch, handleFilter, activeFilter }) => {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* TOP BAR */}
      <div className="px-5 py-4 flex bg-primary items-center gap-x-1 text-white">
        <Link href="/">
          <Home className="text-white" size={20} />
        </Link>
        <h1 className="text-lg font-bold">Select Players</h1>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-slate-100 px-5 py-4 space-y-3">
        {/* SEARCH */}
        <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-3 py-2">
          <Search size={18} className="text-primary" />
          <input
            value={searchTermInput}
            onChange={handleSearch}
            placeholder="Search by name, role or team..."
            className="bg-transparent outline-none w-full text-sm text-black placeholder:text-primary"
          />
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
          {["All", "Batsman", "Bowler", "All-Rounder", "In Squad", "Un caped"].map((item) => (
            <button
              key={item}
              onClick={() => handleFilter(item)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-full text-sm
                ${activeFilter === item ? "bg-primary text-white" : "bg-gray-200 text-primary"}
                hover:bg-gray-300 transition
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
