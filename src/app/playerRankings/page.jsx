"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { usePlayerRankings } from "./hooks/hooks"
import { FilterBar, HeroPlayer, ModeSwitcher, PageHeader, PlayerTable } from "./components/components"



export default function page() {
  const {
    mode,
    rankBy,
    filters,
    headers,
    players,
    hero,
    getStats,
    setRankBy,
    handleModeChange,
    resetFilters,
  } = usePlayerRankings()
  



  

  return (
    <main className="min-h-screen bg-surface px-6 pb-12 pt-12 text-on-surface md:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <PageHeader />

        <section className="mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <ModeSwitcher mode={mode} onChange={handleModeChange} />
          </div>

          <FilterBar mode={mode} filters={filters} rankBy={rankBy} setRankBy={setRankBy} />
        </section>

        <HeroPlayer hero={hero} mode={mode} />

        <PlayerTable players={players} headers={headers} getStats={getStats} mode={mode} />
      </div>
    </main>
  )
}


export function useGetPlayerIds() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getPlayerIds = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await axios.post(
        "/api/Players/rankings",
        {
          type: "bowling",
        },
        { withCredentials:true },
      )

      setData(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    getPlayerIds,
  }
}
