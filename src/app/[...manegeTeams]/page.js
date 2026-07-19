"use client"

import { useState, useMemo, useEffect } from "react"
import {
  RemovalModal,
  StickyActionBar,
  SquadManagement,
  StatisticsGrid,
  TeamHeader,
} from "./components/componsnts"
import axios from "axios"
import { useParams } from "next/navigation"
import PageLoader from "@/customComponents/loaders/pageLoader"

export default function TeamPage() {
  const [players, setPlayers] = useState([])
  // --------------------
  const [activeTab, setActiveTab] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [playerPendingRemoval, setPlayerPendingRemoval] = useState(null)

  const teamID = useParams()?.manegeTeams?.[1]
  const { getTeamStats, data, loading, error } = useTeamStats()

  useEffect(() => {
    if (teamID) getTeamStats(teamID)
  }, [teamID])

  useEffect(() => {
    if (data) {
      const mappedPlayers = (data?.totalPlayers || []).map((player) => ({
        id: player?._id,
        name: player?.name,
        role: player?.role.charAt(0).toUpperCase() + player?.role.slice(1),
        number: player?.jerseyNumber,
        category: player?.role.replace("-", ""),
        selected: player?.inPlaying_XI,
        image: player?.avatar || "",
      }))
      setPlayers(mappedPlayers)
    }
  }, [data])

  // ADDED: Dynamically map incoming API analytics payload
  const dynamicStats = useMemo(() => {
    if (!data) return []
    const playingXICount = (data?.totalPlayers || []).filter((p) => p.inPlaying_XI).length
    return [
      { key: "matches", label: "Matches", value: data?.matchesPlayed || 0 },
      { key: "won", label: "Won", value: data?.matchesWon || 0 },
      { key: "lost", label: "Lost", value: data?.matchesLost || 0 },
      { key: "winRate", label: "Win Rate", value: `${data?.winningPercentage || 0}%` },
      { key: "squad", label: "Squad", value: (data?.totalPlayers || []).length },
      { key: "playingXI", label: "Playing XI", value: playingXICount },
    ]
  }, [data])

  const dynamicTeamInfo = useMemo(() => {
    return {
      name: data?.teamName || "Loading...",
      handle: `@${data?.teamName || "team"}`,
      division: "Division I",
      established: "EST. 2026",
      logo: data?.teamAvatar || "",
    }
  }, [data])
  // --------------------

  const selectedCount = useMemo(() => players.filter((p) => p.selected).length, [players])

  const toggleSelection = (id) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)))
  }

  const handleMore = (player) => {
    setPlayerPendingRemoval(player)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setPlayerPendingRemoval(null)
  }

  const confirmRemoval = () => {
    if (playerPendingRemoval) {
      setPlayers((prev) => prev.filter((p) => p.id !== playerPendingRemoval.id))
    }
    closeModal()
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface font-body text-red-500">
        <p className="text-lg">Error: {error}</p>
      </main>
    )
  }

  return (
    <>
      {loading && <PageLoader></PageLoader>}
      <main className="min-h-screen py-12 md:py-20 bg-surface font-body text-on-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
          <TeamHeader team={dynamicTeamInfo} onEdit={() => console.log("Edit team")} />
          <StatisticsGrid stats={dynamicStats} />
          <SquadManagement
            players={players}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onToggleSelect={toggleSelection}
            onNewPlayer={() => console.log("New player")}
            onMore={handleMore}
          />
        </div>

        <RemovalModal isOpen={modalOpen} onClose={closeModal} onConfirm={confirmRemoval} />
      </main>
    </>
  )
}

export function useTeamStats() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getTeamStats = async (teamId) => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post("/api/Team/getSpecificTeamInfo", {
        teamId,
      })

      setData(response.data.data)
      return response.data
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to fetch team statistics"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    getTeamStats,
  }
}
