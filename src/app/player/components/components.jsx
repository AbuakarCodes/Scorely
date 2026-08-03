"use client"

import { Camera, Edit3, Search, UserRound, Swords, X, ChevronDown } from "lucide-react"

import { usePlayerStats } from "../hooks/hooks"
import { useState } from "react"

// -----------------------------------------------------
// Reusable Stat Card
// -----------------------------------------------------

export function StatCard({ label, value, highlight = false, className = "" }) {
  return (
    <div
      className={`
        p-5 min-h-[110px]
        flex flex-col justify-center
        bg-white
        ${highlight ? "text-primary" : "text-[#191c1e]"}
        ${className}
      `}
    >
      <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#586377] mb-2">{label}</p>

      <p
        className={`
          text-2xl sm:text-3xl
          font-black tracking-tight
          ${highlight ? "text-[#003527]" : "text-[#191c1e]"}
        `}
      >
        {value}
      </p>
    </div>
  )
}

// -----------------------------------------------------
// Player Hero
// -----------------------------------------------------

export function PlayerHero({ player, onImageChange, onNameChange }) {
  return (
    <section className="relative overflow-hidden bg-[#f2f4f6] pt-12 pb-24">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end">
          {/* Profile Image */}
          <div className="relative shrink-0">
            <div className="h-[360px] w-[280px] overflow-hidden rounded-2xl bg-[#e0e3e5] shadow-2xl sm:h-[420px] sm:w-[320px]">
              {player?.avatar ? (
                <img src={player.avatar} alt={player.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-container text-on-primary-container font-black text-6xl uppercase">
                  {player?.name?.charAt(0) || "?"}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="absolute -bottom-5 -right-5 flex flex-col gap-2">
              <label
                className="
        flex h-12 w-12 cursor-pointer items-center
        justify-center rounded-full
        bg-[#003527] text-white shadow-lg
        transition hover:bg-[#064e3b]
      "
                title="Change photo"
              >
                <Camera size={19} />

                <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
              </label>

              <button
                onClick={onNameChange}
                className="
        flex h-12 w-12 items-center justify-center
        rounded-full bg-white text-[#003527]
        shadow-lg transition hover:bg-[#003527]
        hover:text-white
      "
                title="Change name"
              >
                <Edit3 size={18} />
              </button>
            </div>
          </div>

          {/* Identity */}
          <div className="pb-3">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#b0f0d6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0b513d]">
                Player Profile
              </span>

              <span className="text-xs uppercase tracking-[0.16em] text-[#586377]">
                {player?.currentTeam}
              </span>
            </div>

            <h1 className="text-6xl font-black uppercase leading-none tracking-[-0.06em] text-[#191c1e] sm:text-8xl lg:text-9xl">
              {player?.name}
              <span className="text-[#003527]">.</span>
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-7">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#586377]">Primary Role</p>
                <p className="text-xl font-bold italic text-[#003527]">{player?.role}</p>
              </div>

              <div className="hidden h-10 w-px bg-[#bfc9c3] md:block" />

              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#586377]">Team</p>
                <p className="text-xl font-bold text-[#191c1e]">{player?.currentTeam}</p>
              </div>

              <div className="hidden h-10 w-px bg-[#bfc9c3] md:block" />

              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#586377]">Jersey Num</p>
                <p className="text-xl font-bold text-[#191c1e]">{player?.jerseyNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.04]">
        <svg viewBox="0 0 100 100" className="h-full w-full fill-[#003527]">
          <path d="M0,100 C30,80 70,80 100,100 L100,0 L0,0 Z" />
        </svg>
      </div>
    </section>
  )
}

// -----------------------------------------------------
// Section Heading
// -----------------------------------------------------

export function SectionHeading({ number, title, description }) {
  return (
    <div className="mb-8 flex items-end justify-between px-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#191c1e] sm:text-3xl">{title}</h2>

        <p className="mt-1 text-sm text-[#586377]">{description}</p>
      </div>

      <span className="hidden text-5xl font-black text-[#003527]/10 md:block">{number}</span>
    </div>
  )
}

// -----------------------------------------------------
// Batting Stats
// -----------------------------------------------------

export function BattingStats({ stats }) {
  return (
    <section className="mb-16">
      <SectionHeading number="01" title="Batting Performance" description="Complete batting statistics" />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#e0e3e5] shadow-sm md:grid-cols-4 lg:grid-cols-6">
        {/* Main Highlight */}
        <div className="col-span-2 flex flex-col justify-between bg-[#064e3b] p-7 sm:p-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b0f0d6]">Total Runs</span>

          <div>
            <span className="text-5xl font-black tracking-tight text-white sm:text-6xl">
              {stats?.totalRuns?.toLocaleString?.() ?? 0}
            </span>

            <p className="mt-2 text-xs uppercase tracking-widest text-[#b0f0d6]/70">
              {stats?.matches ?? 0} Matches Played
            </p>
          </div>
        </div>

        <StatCard label="hat Trick 4s" value={stats?.totalHatTriks_4s ?? 0} />

        <StatCard label="Strike Rate" value={stats?.strikeRate ?? 0} highlight />

        <StatCard label="Best Score" value={stats?.bestScore ?? 0} />

        <StatCard label="Boundary %" value={`${stats?.boundaryPercentage ?? 0}%`} />

        <StatCard label="Matches" value={stats?.matches ?? 0} />
        <StatCard label="4s" value={stats?.fours ?? 0} />
        <StatCard label="6s" value={stats?.sixes ?? 0} />
        <StatCard label="50s" value={stats?.fifties ?? 0} />
        <StatCard label="100s" value={stats?.hundreds ?? 0} />
        <StatCard label="Ducks" value={stats?.ducks ?? 0} />
        <StatCard label="Dot Balls" value={stats?.dotBalls ?? 0} />
        <StatCard label="Runs / Match" value={stats?.runsPerMatch ?? 0} />
      </div>
    </section>
  )
}

// -----------------------------------------------------
// Bowling Stats
// -----------------------------------------------------

export function BowlingStats({ stats }) {
  return (
    <section className="mb-16">
      <SectionHeading number="02" title="Bowling Mastery" description="Complete bowling statistics" />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#e0e3e5] shadow-sm md:grid-cols-4 lg:grid-cols-6">
        {/* Highlight */}
        <div className="col-span-2 flex flex-col justify-between bg-[#545f73] p-7 sm:p-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8e3fb]">
            Total Wickets
          </span>

          <div>
            <span className="text-5xl font-black tracking-tight text-white sm:text-6xl">
              {stats?.totalWickets ?? 0}
            </span>

            <p className="mt-2 text-xs uppercase tracking-widest text-[#d8e3fb]/70">
              {stats?.overs ?? "0"} Overs Bowled
            </p>
          </div>
        </div>

        <StatCard label="Economy" value={stats?.economy ?? 0} highlight />

        <StatCard label="hat trick" value={stats?.totalHatTriks_W ?? 0} />

        <StatCard label="Bowling SR" value={stats?.bowlingStrikeRate ?? 0} />

        <StatCard label="Best Figures" value={stats?.bestFigures ?? "0/0"} />

        <StatCard label="Matches" value={stats?.matches ?? 0} />

        <StatCard label="Overs" value={stats?.overs ?? "0"} />

        <StatCard label="Runs Conceded" value={stats?.runsConceded ?? 0} />

        <StatCard label="Maidens" value={stats?.maidens ?? 0} />

        <StatCard label="Dot Balls" value={stats?.dotBalls ?? 0} />

        <StatCard label="Wides" value={stats?.wides ?? 0} />

        <StatCard label="No Balls" value={stats?.noBalls ?? 0} />

        <StatCard label="Boundaries Conceded" value={stats?.boundariesConceded ?? 0} />
      </div>
    </section>
  )
}

// -----------------------------------------------------
// Search Result
// -----------------------------------------------------

export function PlayerSearchResult({ player, onSelect }) {
  return (
    <button
      onClick={() => onSelect(player)}
      className="
        flex w-full items-center gap-3
        border-b border-[#e0e3e5]/60
        p-4 text-left
        transition hover:bg-[#003527]/5
      "
    >
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#e0e3e5]">
        {player?.avatar ? (
          <img src={player?.avatar} alt={player?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-container text-on-primary-container font-black text-xl uppercase">
            {player?.name?.charAt(0) || "?"}
          </div>
        )}{" "}
      </div>

      <div>
        <p className="font-bold text-[#191c1e]">{player.name}</p>

        <p className="text-[10px] uppercase tracking-wider text-[#586377]">
          {player?.role} • {player?.team}
        </p>
      </div>
    </button>
  )
}

// -----------------------------------------------------
// H2H Stat
// -----------------------------------------------------

export function H2HStat({ label, value, emphasis = false }) {
  return (
    <div className="rounded-xl bg-[#f2f4f6] p-4 sm:p-5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#586377]">{label}</p>

      <p
        className={`
          text-xl font-bold
          ${emphasis ? "text-[#003527]" : "text-[#191c1e]"}
        `}
      >
        {value}
      </p>
    </div>
  )
}

// -----------------------------------------------------
// Head To Head
// -----------------------------------------------------

export function HeadToHead({
  player,
  opponent,
  search,
  results,
  headToHead,
  H2Hloading,
  H2Herror,
  onSearch,
  onSelect,
  onClear,
}) {
  const [open, setOpen] = useState(false)

  const batting = headToHead?.batting
  const bowling = headToHead?.bowling

  return (
    <section className="mb-20">
      <div className="rounded-3xl bg-[#f2f4f6] p-6 sm:p-8 lg:p-12">
        <div className="mb-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#191c1e] sm:text-3xl">
              Head-to-Head Analysis
            </h2>

            <p className="mt-1 text-sm text-[#586377]">
              Compare {player?.name}'s performance against another player
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <div className="relative">
              <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#586377]" />

              <input
                value={search}
                onChange={(e) => {
                  onSearch(e.target.value)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                placeholder="Select player to compare..."
                className="
                  h-14 w-full rounded-xl
                  bg-white pl-12 pr-12
                  text-sm text-[#191c1e]
                  shadow-sm outline-none
                  ring-[#003527]/20
                  transition
                  focus:ring-2
                "
              />

              {search && (
                <button
                  onClick={() => {
                    onClear()
                    setOpen(false)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#586377]"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {open && results?.length > 0 && !opponent && (
              <div className="absolute top-full z-50 mt-2 w-full max-h-[30rem] scroll-smooth overflow-y-scroll no-scrollbar rounded-xl border border-[#e0e3e5] bg-white shadow-xl">
                {results.map((item) => (
                  <PlayerSearchResult
                    key={item._id}
                    player={item}
                    onSelect={(selected) => {
                      onSelect(selected)
                      setOpen(false)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {opponent && (
          <>
            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PlayerBadge player={player} />

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003527] text-white">
                <Swords size={17} />
              </div>

              <PlayerBadge player={opponent} />
            </div>

            {H2Hloading && (
              <div className="rounded-2xl bg-white py-16 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#003527]/20 border-t-[#003527]" />

                <p className="text-sm font-medium text-[#586377]">Loading head-to-head statistics...</p>
              </div>
            )}

            {!H2Hloading && H2Herror && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-sm font-medium text-red-600">{H2Herror}</p>
              </div>
            )}

            {!H2Hloading && !H2Herror && batting && bowling && (
              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-[#003527] p-3 text-white">
                      <UserRound size={19} />
                    </div>

                    <h3 className="text-lg font-bold uppercase tracking-tight">Batting vs {opponent?.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <H2HStat label="Runs" value={batting?.runs} emphasis />

                    <H2HStat label="Balls Faced" value={batting?.ballsFaced} />

                    <H2HStat label="Strike Rate" value={batting?.strikeRate} />

                    <H2HStat label="runs / over" value={batting?.average} />

                    <H2HStat label="4s" value={batting?.fours} />

                    <H2HStat label="6s" value={batting?.sixes} />

                    <H2HStat label="Dismissals" value={batting?.dismissals} />

                    <H2HStat label="Dot Balls" value={batting?.dotBalls} />

                    <H2HStat label="Boundary %" value={`${batting?.boundaryPercentage}%`} />

                    <H2HStat label="Highest Score" value={batting?.highestScore} />
                  </div>
                </div>

                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-[#545f73] p-3 text-white">
                      <Swords size={19} />
                    </div>

                    <h3 className="text-lg font-bold uppercase tracking-tight">Bowling vs {opponent?.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <H2HStat label="Overs" value={bowling?.overs} emphasis />

                    <H2HStat label="Balls" value={bowling?.balls} />

                    <H2HStat label="Runs Conceded" value={bowling?.runsConceded} />

                    <H2HStat label="Wickets" value={bowling?.wickets} emphasis />

                    <H2HStat label="Economy" value={bowling?.economy} />

                    <H2HStat label="Bowling SR" value={bowling?.bowlingStrikeRate} />

                    <H2HStat label="Runs / wicket" value={bowling?.average} />

                    <H2HStat label="Dot Balls" value={bowling?.dotBalls} />

                    <H2HStat label="4s Conceded" value={bowling?.foursConceded} />

                    <H2HStat label="6s Conceded" value={bowling?.sixesConceded} />

                    <H2HStat label="Wides" value={bowling?.wides} />

                    <H2HStat label="No Balls" value={bowling?.noBalls} />

                    <H2HStat label="Best Figures" value={bowling?.bestFigures} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!opponent && (
          <div className="rounded-2xl border-2 border-dashed border-[#bfc9c3]/50 py-14 text-center">
            <ChevronDown className="mx-auto mb-3 text-[#586377]/40" />

            <p className="text-sm font-medium text-[#586377]">
              Search for a player above to unlock Head-to-Head metrics.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

// -----------------------------------------------------
// Player Badge
// -----------------------------------------------------

export function PlayerBadge({ player }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 shadow-sm">
      <div className="h-10 w-10 overflow-hidden rounded-full bg-[#e0e3e5]">
        {player?.avatar ? (
          <img src={player?.avatar} alt={player?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-container text-on-primary-container font-black text-xl uppercase">
            {player?.name?.charAt(0) || "?"}
          </div>
        )}
      </div>

      <span className="font-bold text-[#191c1e]">{player.name}</span>
    </div>
  )
}

// -----------------------------------------------------
// Main Player Profile
// -----------------------------------------------------

// export default export function PlayerProfile({ playerId }) {
//   const {
//     player,
//     selectedOpponent,
//     search,
//     filteredPlayers,
//     headToHead,

//     setSearch,
//     selectOpponent,
//     clearComparison,

//     handleImageChange,
//     handleNameChange,
//   } = usePlayerStats(playerId);

//   return (
//     <main className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">

//       <PlayerHero
//         player={player}
//         onImageChange={handleImageChange}
//         onNameChange={handleNameChange}
//       />

//       <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-12">

//         <div className="-mt-12 rounded-t-3xl bg-[#f7f9fb] pt-12">
//           <BattingStats stats={player.batting} />

//           <BowlingStats stats={player.bowling} />

//           <HeadToHead
//             player={player}
//             opponent={selectedOpponent}
//             search={search}
//             results={filteredPlayers}
//             headToHead={headToHead}
//             onSearch={setSearch}
//             onSelect={selectOpponent}
//             onClear={clearComparison}
//           />
//         </div>
//       </div>
//     </main>
//   );
// }
