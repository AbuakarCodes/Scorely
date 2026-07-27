"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import {
  RemovalModal,
  StickyActionBar,
  AddPlayersInTeam,
  StatisticsGrid,
  TeamHeader,
  TeamPlayers,
} from "./components/componsnts"
import axios from "axios"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlayers, updatePlayerTeam } from "@/utils/reduxSclices/playerSlice"

export default function TeamPage() {
  const [players, setPlayers] = useState([])
  // --------------------
  const [activeTab, setActiveTab] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [removedPlayerId, setRemovedPlayerIds] = useState(null)
  const dispatch = useDispatch()

  const teamID = useParams()?.manegeTeams?.[1]
  const { getTeamStats, data, loading, error } = useTeamStats()
  const allPlayers = useSelector((state) => state?.players?.players) || []
  const unDebutePlayers = Array.isArray(allPlayers) ? allPlayers.filter((P) => !P?.teamId) : []

  useEffect(() => {
    if (allPlayers.length === 0) dispatch(fetchPlayers())
  }, [])

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

  const dynamicStats = useMemo(() => {
    if (!data) return []
    return [
      { key: "matches", label: "Matches", value: data?.matchesPlayed || 0 },
      { key: "won", label: "Won", value: data?.matchesWon || 0 },
      { key: "lost", label: "Lost", value: data?.matchesLost || 0 },
      { key: "winRate", label: "Win Rate", value: `${data?.winningPercentage || 0}%` },
      { key: "squad", label: "Squad", value: (data?.totalPlayers || [])?.length },
      { key: "ranking", label: "Rank", value: "" },
    ]
  }, [data])

  const dynamicTeamInfo = useMemo(() => {
    return {
      name: data?.teamName || "Loading...",
      handle: `@${data?.teamName || "team"}`,
      division: "Division I",
      established: "EST. 2026",
      logo: data?.avatar || "",
    }
  }, [data])
  // --------------------

  const toggleSelection = async (id) => {
    dispatch(
      updatePlayerTeam({
        playerId: id,
        teamId: teamID,
        action: "add",
      }),
    )
    setPlayers((prev) => prev.map((p) => (p._id === id ? { ...p, selected: !p.selected } : p)))
  }

  const removePlayer_handeler = ({id}) => {
    setRemovedPlayerIds(id)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setRemovedPlayerIds(null)
  }

  const confirmRemoval = () => {
    if (removedPlayerId) {
      setPlayers((prev) => prev.filter((p) => p?.id !== removedPlayerId))
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
      <main className="min-h-screen py-12 md:py-20 bg-surface font-body text-on-surface">
        <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-12">
          <TeamHeader team={dynamicTeamInfo} onEdit={() => console.log("Edit team")} />
          <StatisticsGrid stats={dynamicStats} />
          <TeamPlayers players={players || []} removePlayer_handeler={removePlayer_handeler} />
          <AddPlayersInTeam
            players={unDebutePlayers}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onToggleSelect={toggleSelection}
            onNewPlayer={() => console.log("New player")}
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
