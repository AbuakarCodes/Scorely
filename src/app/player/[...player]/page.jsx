"use client"

import { useParams } from "next/navigation"
import { BattingStats, BowlingStats, HeadToHead, PlayerHero } from "../components/components"
import usePlayerStatsAPI, { usePlayerStats } from "../hooks/hooks"

export default function PlayerProfile() {
  const params = useParams()

  const playerId = params?.player[0]

  const {
    player,
    selectedOpponent,
    search,
    filteredPlayers,
    headToHead,

    setSearch,
    selectOpponent,
    clearComparison,

    handleImageChange,
    handleNameChange,
  } = usePlayerStats(playerId)

  const { data, loading, error } = usePlayerStatsAPI(playerId)
  console.log(data?.player)

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <PlayerHero player={data?.player} onImageChange={handleImageChange} onNameChange={handleNameChange} />

      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="-mt-12 rounded-t-3xl bg-[#f7f9fb] pt-12">
          <BattingStats stats={data?.batting} />
          <BowlingStats stats={data?.bowling} />

          <HeadToHead
            player={player}
            opponent={selectedOpponent}
            search={search}
            results={filteredPlayers}
            headToHead={headToHead}
            onSearch={setSearch}
            onSelect={selectOpponent}
            onClear={clearComparison}
          />
        </div>
      </div>
    </main>
  )
}
