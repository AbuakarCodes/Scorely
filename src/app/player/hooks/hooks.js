"use client"

import axios from "axios"
import { useEffect, useMemo, useState } from "react"

const PLAYERS = [
  {
    id: "1",
    name: "Abubakar",
    role: "Elite All-Rounder",
    team: "Warriors CC",
    avatar: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",

    batting: {
      matches: 32,
      runs: 1247,
      average: 48.0,
      strikeRate: 126.4,
      fours: 112,
      sixes: 30,
      fifties: 8,
      hundreds: 3,
      bestScore: "104*",
      ducks: 2,
      dotBalls: 412,
      boundaryPercentage: 58,
      runsPerMatch: 38.9,
    },

    bowling: {
      matches: 32,
      overs: 142.4,
      balls: 856,
      runsConceded: 840,
      wickets: 37,
      average: 22.7,
      economy: 5.89,
      strikeRate: 23.1,
      maidens: 12,
      bestFigures: "4/19",
      dotBalls: 380,
      wides: 14,
      noBalls: 4,
      boundariesConceded: 64,
    },
  },

  {
    id: "2",
    name: "Rashid Khan",
    role: "Leg-break Bowler",
    team: "Afghanistan",
    avatar: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",

    batting: {
      matches: 28,
      runs: 640,
      average: 32.0,
      strikeRate: 138.2,
      fours: 48,
      sixes: 26,
      fifties: 4,
      hundreds: 0,
      bestScore: "79*",
      ducks: 1,
      dotBalls: 140,
      boundaryPercentage: 61,
      runsPerMatch: 22.8,
    },

    bowling: {
      matches: 28,
      overs: 108.2,
      balls: 650,
      runsConceded: 650,
      wickets: 42,
      average: 15.48,
      economy: 6.0,
      strikeRate: 15.48,
      maidens: 7,
      bestFigures: "5/21",
      dotBalls: 290,
      wides: 9,
      noBalls: 1,
      boundariesConceded: 38,
    },
  },

  {
    id: "3",
    name: "Babar Azam",
    role: "Top-order Batter",
    team: "Pakistan",
    avatar: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",

    batting: {
      matches: 35,
      runs: 1580,
      average: 52.6,
      strikeRate: 132.4,
      fours: 145,
      sixes: 21,
      fifties: 11,
      hundreds: 4,
      bestScore: "127*",
      ducks: 1,
      dotBalls: 360,
      boundaryPercentage: 54,
      runsPerMatch: 45.1,
    },

    bowling: {
      matches: 35,
      overs: 2,
      balls: 12,
      runsConceded: 18,
      wickets: 0,
      average: 0,
      economy: 9.0,
      strikeRate: 0,
      maidens: 0,
      bestFigures: "0/18",
      dotBalls: 3,
      wides: 0,
      noBalls: 0,
      boundariesConceded: 3,
    },
  },
]

const HEAD_TO_HEAD = {
  "1-2": {
    batting: {
      runs: 54,
      ballsFaced: 62,
      strikeRate: 87.1,
      fours: 5,
      sixes: 1,
      dismissals: 1,
      average: 54,
      dotBalls: 13,
      boundaryPercentage: 40.7,
      highestScore: "31",
    },

    bowling: {
      overs: 4.2,
      balls: 26,
      runsConceded: 28,
      wickets: 0,
      average: 0,
      economy: 6.46,
      strikeRate: 0,
      dotBalls: 11,
      foursConceded: 3,
      sixesConceded: 0,
      wides: 1,
      noBalls: 0,
      bestFigures: "0/28",
    },
  },

  "1-3": {
    batting: {
      runs: 84,
      ballsFaced: 70,
      strikeRate: 120,
      fours: 8,
      sixes: 2,
      dismissals: 2,
      average: 42,
      dotBalls: 15,
      boundaryPercentage: 52.3,
      highestScore: "48",
    },

    bowling: {
      overs: 5,
      balls: 30,
      runsConceded: 31,
      wickets: 1,
      average: 31,
      economy: 6.2,
      strikeRate: 30,
      dotBalls: 14,
      foursConceded: 3,
      sixesConceded: 1,
      wides: 0,
      noBalls: 0,
      bestFigures: "1/31",
    },
  },
}

export function usePlayerStats(playerId) {
  const player = useMemo(() => PLAYERS.find((item) => item.id === playerId) ?? PLAYERS[0], [playerId])

  const [playerName, setPlayerName] = useState(player.name)
  const [profileImage, setProfileImage] = useState(player.avatar)

  const [search, setSearch] = useState("")
  const [selectedOpponent, setSelectedOpponent] = useState(null)

  const filteredPlayers = useMemo(() => {
    return PLAYERS.filter(
      (item) => item.id !== player.id && item.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search, player.id])

  const headToHead = useMemo(() => {
    if (!selectedOpponent) return null

    return (
      HEAD_TO_HEAD[`${player.id}-${selectedOpponent.id}`] ?? {
        batting: {
          runs: 0,
          ballsFaced: 0,
          strikeRate: 0,
          fours: 0,
          sixes: 0,
          dismissals: 0,
          average: 0,
          dotBalls: 0,
          boundaryPercentage: 0,
          highestScore: "0",
        },
        bowling: {
          overs: 0,
          balls: 0,
          runsConceded: 0,
          wickets: 0,
          average: 0,
          economy: 0,
          strikeRate: 0,
          dotBalls: 0,
          foursConceded: 0,
          sixesConceded: 0,
          wides: 0,
          noBalls: 0,
          bestFigures: "0/0",
        },
      }
    )
  }, [player.id, selectedOpponent])

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setProfileImage(previewUrl)
  }

  function handleNameChange() {
    const newName = window.prompt("Enter player name:", playerName)

    if (newName?.trim()) {
      setPlayerName(newName.trim())
    }
  }

  function selectOpponent(opponent) {
    setSelectedOpponent(opponent)
    setSearch(opponent.name)
  }

  function clearComparison() {
    setSelectedOpponent(null)
    setSearch("")
  }

  return {
    player: {
      ...player,
      name: playerName,
      avatar: profileImage,
    },

    selectedOpponent,
    search,
    filteredPlayers,
    headToHead,

    setSearch,
    selectOpponent,
    clearComparison,

    handleImageChange,
    handleNameChange,
  }
}

export default function usePlayerStatsAPI(userId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.post("/api/Players/playerStats", {
          playerId: userId,
        })
        setData(response.data)
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  return {
    data,
    loading,
    error,
  }
}
