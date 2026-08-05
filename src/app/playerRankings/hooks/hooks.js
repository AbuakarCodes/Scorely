"use client"

import { fetchPlayerRankings } from "@/utils/reduxSclices/playerSlice"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const battingFilters = [
  { value: "average", label: "Batting Average" },
  { value: "strikeRate", label: "Strike Rate" },
  { value: "runs", label: "Total Runs" },
  { value: "fours", label: "Most 4s" },
]

const bowlingFilters = [
  { value: "wickets", label: "Most Wickets" },
  { value: "economy", label: "Best Economy" },
  { value: "strikeRate", label: "Bowling Strike Rate" },
  { value: "overs", label: "Most Overs" },
]

export function usePlayerRankings() {
  const [mode, setMode] = useState("batting")
  const [rankBy, setRankBy] = useState("runs")
  const [players, setplayers] = useState([])
  const [rankOne, setrankOne] = useState([])

  const dispatch = useDispatch()
  const { battingRanks, BowlingRanks, Rank_Loading } = useSelector((state) => state?.players)

  const filters = mode === "batting" ? battingFilters : bowlingFilters

  useEffect(() => {
    if (mode === "bowling" && BowlingRanks.length === 0) {
      dispatch(fetchPlayerRankings("bowling"))
    } else if (mode === "batting" && battingRanks.length === 0) {
      dispatch(fetchPlayerRankings("batting"))
    }
  }, [mode])

  useEffect(() => {
    if (mode === "batting") {
      setplayers(battingRanks)
    } else setplayers(BowlingRanks)
  }, [mode, BowlingRanks, battingRanks])

  useEffect(() => {
    if (players.length >= 1) setrankOne(players[0])
  }, [players])

  // Player sorting

  const headers = mode === "batting" ? ["Runs", "Avg", "SR", "4s"] : ["Wickets", "Econ", "SR", "Overs"]

  const getStats = (player) => {
    if (mode === "batting") {
      return [player?.runs, player?.average?.toFixed(2), player?.strikeRate?.toFixed(1), player?.fours]
    }
    return [player?.wickets, player?.economy?.toFixed(2), player?.strikeRate?.toFixed(1), player?.overs]
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setRankBy(newMode === "batting" ? "runs" : "wickets")
  }

  const resetFilters = () => {
    setMode("batting")
    setRankBy("runs")
  }

  return {
    mode,
    rankBy,
    filters,
    headers,
    players,
    Rank_Loading,
    rankOne,
    getStats,
    setRankBy,
    handleModeChange,
    resetFilters,
  }
}
