"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTeams } from "@/utils/reduxSclices/teamSlice"
import { Search, ChevronRight, Home, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TeamCard } from "@/customComponents/addTeam/teamCard"
import { defaultImage } from "@/utils/Basic/constant"
import { PlayerCardSkeleton } from "@/customComponents/loaders/PlayerCardSkeleton"

export default function TeamsBackground() {
  const dispatch = useDispatch()
  const { teams, loading, error } = useSelector((state) => state.teams)

  const [localTeams, setLocalTeams] = useState([])
  const [searchTermInput, setSearchTermInput] = useState("")

  // fetch teams
  useEffect(() => {
    if (teams.length === 0) dispatch(fetchTeams())
  }, [teams.length])

  // sync redux → local
  useEffect(() => {
    setLocalTeams(teams)
  }, [teams])

  // SEARCH ONLY
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTermInput(value)

    if (!value.trim()) {
      setLocalTeams(teams)
      return
    }

    const s = value.toLowerCase()
    const filtered = teams.filter((t) => t.name.toLowerCase().includes(s))

    setLocalTeams(filtered)
  }

  if (error) return <p className="p-4">{error}</p>

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background shadow-sm">
        <div className="px-5 py-4 flex items-center gap-3 bg-primary text-white">
          <Link href="/">
            <Home size={20} />
          </Link>
          <h1 className="text-lg font-bold">Teams</h1>
        </div>

        {/* SEARCH */}
        <div className="px-5 py-4 bg-gray-50">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border">
            <Search size={18} className="text-primary" />
            <input
              value={searchTermInput}
              onChange={handleSearch}
              placeholder="Search teams..."
              className="w-full outline-none text-sm"
            />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex flex-col gap-5">
        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <PlayerCardSkeleton key={i} variant="detail" />
            ))}
          </div>
        ) : localTeams.length > 0 || !loading ? (
          <div className="space-y-5">
            {localTeams.map((team) => (
              <Link key={team._id} href={`/teams/${team._id}`} className="block">
                <TeamCard
                  variant="detailed"
                  name={team.name}
                  avatar={team.avatar || defaultImage}
                  playersCount={team.playersCount}
                  rank={team?.rank}
                  onAction={() => {
                    console.log("view team", team._id)
                  }}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="col-span-full text-center text-gray-500">No teams found</p>
        )}
      </main>

      {/* FLOATING BUTTON */}
      <Link href="/registerTeam">
        <Button className="fixed bottom-24 right-6 size-14 rounded-full shadow-lg">
          <Plus />
        </Button>
      </Link>
    </div>
  )
}
