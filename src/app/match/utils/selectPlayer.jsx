"use client"

import { Layers, Search } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdSportsCricket } from "react-icons/md"
import { BiSolidCricketBall } from "react-icons/bi"
import { FaUser } from "react-icons/fa"
import { useMemo } from "react"
import { chnageBatsmen_OR_Bowler } from "@/utils/reduxSclices/matchSlice"

import { X, SlidersHorizontal, ChevronRight, Check } from "lucide-react"

export default function SelectParticipantsModal() {
  const { teamA, teamB, loading } = useSelector((state) => state.match.match.teams)
  const { tossDecision, tossWinner } = useSelector((state) => state?.match?.match)
  const { batsmen } = useSelector((state) => state?.match)
  const pendingNewBatsman = useSelector(
    (state) => state.match?.innings?.pendingNewBatsman ?? { striker: null, nonStriker: null },
  )
  const pendingNewBowler = useSelector((state) => state.match?.innings?.pendingNewBowler ?? null)
  const { isFirstInings } = useSelector((state) => state.match?.innings ?? null)

  const [search, setSearch] = useState("")
  const dispatch = useDispatch()

  // 0 = batting, 1 = balling
  const [OrderdTeams, setOrderdTeams] = useState([{ players: [] }, { players: [] }])

  useEffect(() => {
    setOrderdTeams(orderingTeams(teamA, teamB, tossWinner, tossDecision, isFirstInings))
  }, [teamA, teamB, isFirstInings])
  // innings if fists as it is if 2nd swap as well

  const needStriker = pendingNewBatsman?.striker
  const needBothBatsmen = pendingNewBatsman?.nonStriker && pendingNewBatsman?.striker
  const needNonstricker = pendingNewBatsman?.nonStriker
  const needBowler = pendingNewBowler

  // Build ordered tab list
  const tabList = useMemo(() => {
    const list = []

    if (needBothBatsmen) {
      list.push("striker")
      list.push("nonStriker")
    }
    if (needStriker && !needBothBatsmen) list.push("striker")
    if (needNonstricker && !needBothBatsmen) list.push("nonStriker")

    if (needBowler) list.push("bowler")

    return list
  }, [needStriker, needBothBatsmen, needBowler, needNonstricker])

  const [activeTab, setActiveTab] = useState(tabList[0])
  const [playerSelections, setplayerSelections] = useState({
    striker: null,
    nonStriker: null,
    bowler: null,
  })

  const battingTeam = OrderdTeams[0]?.players || []
  const bowlingTeam = OrderdTeams[1]?.players || []

  const isBowlerTab = activeTab === "bowler"

  const allPlayers = isBowlerTab ? bowlingTeam : filterPlayers(battingTeam, batsmen)
  let filtered = Array.isArray(allPlayers)
    ? allPlayers.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : []

  if (activeTab === "nonStriker") {
    filtered = filtered.filter((p) => p?._id !== playerSelections?.striker?.id)
  }
  if (activeTab === "striker") {
    filtered = filtered.filter((p) => p?._id !== playerSelections?.nonStriker?.id)
  }

  // ── Select a player ───────────────────────────────────────────────────────
  function handleSelect(player) {
    const next = { ...playerSelections, [activeTab]: { id: player?._id, name: player?.name } }
    setplayerSelections(next)
    // Auto-advance to next unselected tab
    const currentIdx = tabList.indexOf(activeTab)
    const nextUnfilled = Array.isArray(tabList)
      ? tabList.find((t, i) => i > currentIdx && next[t] === null)
      : []
    if (nextUnfilled) {
      setTimeout(() => {
        setActiveTab(nextUnfilled)
      }, 180)
    }
  }

  // ── Confirm ───────────────────────────────────────────────────────────────
  const allFilled = tabList.every((t) => playerSelections[t] !== null)

  function handleConfirm() {
    if (!allFilled) return
    dispatch(chnageBatsmen_OR_Bowler(playerSelections))
  }

  // ── Tab meta for UI
  const TAB_META = {
    striker: { label: "Striker", Icon: MdSportsCricket },
    nonStriker: { label: "Non-Striker", Icon: FaUser },
    bowler: { label: "Bowler", Icon: BiSolidCricketBall },
  }

  // In which step we are currently in
  const stepNum = tabList.indexOf(activeTab) + 1
  const stepTitle =
    activeTab === "striker"
      ? "Select Striker"
      : activeTab === "nonStriker"
        ? "Select Non-Striker"
        : "Select Bowler"

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
        style={{ background: "rgba(10,12,14,0.6)", backdropFilter: "blur(16px)" }}
      >
        {/* Modal */}
        <div className="bg-white dark:bg-[#111417] dark:text-white w-full max-w-xl max-h-[92dvh] md:max-h-[780px] rounded-t-[2rem] md:rounded-[2rem] shadow-2xl dark:shadow-black/50 flex flex-col overflow-hidden dark:border dark:border-white/10">
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-4 z-10 dark:bg-[#15191d] dark:border-b dark:border-white/5">
            <button className="p-2 rounded-full active:scale-95 transition-all text-transparent dark:hover:bg-white/10">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center">
              <h1 className="font-bold text-base dark:text-white">{stepTitle}</h1>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400">
                Step {stepNum} of {tabList.length}
              </span>
            </div>
            <span className="text-primary dark:text-emerald-400 font-bold text-xs px-3 py-1 rounded-full bg-primary/10 dark:bg-emerald-400/10 dark:border dark:border-emerald-400/20">
              Cricket Pro
            </span>
          </header>

          {/* Search */}
          <div className="px-5 pt-4 pb-2 space-y-3 dark:bg-[#111417]">
            <div className="relative flex items-center">
              <Search
                size={18}
                className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players by name…"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-chart-4 transition-all dark:bg-[#1c2126] dark:text-white dark:placeholder-gray-500 dark:focus:ring-emerald-400/40 dark:border dark:border-white/5"
              />
            </div>

            {/* Pool label + filter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {isBowlerTab ? "Bowler Pool" : "Batsmen Pool"}
                </span>

                <span className="px-2 py-0.5 bg-green-100 dark:bg-emerald-400/10 text-green-700 dark:text-emerald-400 text-[10px] font-extrabold rounded-full dark:border dark:border-emerald-400/20">
                  {filtered.length} AVAILABLE
                </span>
              </div>

              <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#1c2126] text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-emerald-400 dark:hover:bg-white/5 transition-colors dark:border dark:border-white/5">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Player list */}
          <div
            className="flex-1 overflow-y-auto px-5 py-3 space-y-3 bg-gray-100/40 dark:bg-[#0d0f11]"
            style={{ scrollbarWidth: "none" }}
          >
            {filtered.length === 0 && (
              <p className="text-center text-sm text-black dark:text-gray-400 mt-10">No players found.</p>
            )}
            {filtered.map((player) => (
              <PlayerCard
                key={player?._id}
                player={player}
                isBowler={isBowlerTab}
                isSelected={playerSelections[activeTab]?.id === player?._id}
                onClick={() => handleSelect(player)}
              />
            ))}
          </div>

          {/* Tab bar */}
          <div className="px-4 pt-3 pb-4 flex items-center justify-around border-t dark:bg-[#15191d] dark:border-white/5">
            {tabList.map((tab) => {
              const { label, Icon } = TAB_META[tab]
              const isDone = playerSelections[tab] !== null
              return (
                <TabButton
                  key={tab}
                  label={label}
                  icon={Icon}
                  isActive={activeTab === tab}
                  isDone={isDone}
                  onClick={() => setActiveTab(tab)}
                />
              )
            })}
          </div>

          {/* Confirm button */}
          <div className="px-5 pb-6 dark:bg-[#15191d]">
            <button
              onClick={handleConfirm}
              disabled={!allFilled}
              className="bg-primary dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-40 dark:shadow-lg dark:shadow-emerald-500/20"
            >
              {allFilled
                ? "Confirm Selection"
                : `Select ${TAB_META[tabList.find((t) => !playerSelections[t]) ?? tabList[0]].label}`}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Utility functions

function orderingTeams(teamA, teamB, tossWinner, tossDecision, isFirstInings) {
  const TosswinningTeam = [teamA, teamB].find((team) => team.id === tossWinner.id)
  const ToosLostTeam = [teamA, teamB].find((team) => team.id !== tossWinner.id)

  if (isFirstInings === true) {
    if (tossDecision === "bat") return [TosswinningTeam, ToosLostTeam]
    if (tossDecision === "bowl") return [ToosLostTeam, TosswinningTeam]
  } else if (isFirstInings === false) {
    if (tossDecision === "bat") return [ToosLostTeam, TosswinningTeam]
    if (tossDecision === "bowl") return [TosswinningTeam, ToosLostTeam]
  }

  return [{ Players: [] }, { Players: [] }]
}

function filterPlayers(players_param, batsmen) {
  if (!players_param) return
  if (!Array.isArray(players_param)) return
  const players = [...players_param]

  const nonStriker = Object.values(batsmen).find((player) => !player.isStriker)
  // filtring nonStriker because when a player got out it will not shown in selection
  // as we are filtering it with isDissmissel propertie but
  // the nonStriker will keep appering so we filter it as well
  return players.filter((p) => !p.isDismissed && p._id !== nonStriker.id)
}

function TabButton({ label, icon: Icon, isActive, isDone, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 px-5 py-2 rounded-full transition-all duration-200 text-xs font-bold
  ${
    isActive
      ? "bg-chart-4/10 dark:bg-emerald-400/10 text-primary dark:text-emerald-400"
      : isDone
        ? "text-primary dark:text-emerald-400 opacity-90"
        : "text-gray-500 dark:text-gray-400 opacity-60 hover:opacity-90"
  }`}
    >
      <div className="relative">
        <Icon size={20} />
        {isDone && !isActive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400 flex items-center justify-center">
            <Check size={8} className="text-white" />
          </span>
        )}
      </div>
      <span>{label}</span>
    </button>
  )
}

function PlayerCard({ player, isSelected, onClick, isBowler }) {
  function Stat({ label, value, selected }) {
    return (
      <div className="flex flex-col">
        <span className={`text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400`}>
          {label}
        </span>
        <span
          className={`text-sm font-bold ${selected ? "text-chart-4 dark:text-emerald-400" : "text-gray-950 dark:text-white"}`}
        >
          {value}
        </span>
      </div>
    )
  }

  function Avatar({ initials, img }) {
    const value = initials.split("")[0]

    return (
      <div className="bg-white dark:bg-[#1c2126] w-14 h-14 rounded-full flex items-center justify-center text-gray-950 dark:text-white font-bold text-lg select-none">
        {img ? <img className="bg-contain" src={img}></img> : value}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`group relative dark:bg-[#171b1f] dark:text-white rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 border active:scale-[0.98]
        ${
          isSelected
            ? "bg-chart-4/10 dark:bg-emerald-400/10 border-chart-4 dark:border-emerald-400 shadow-md dark:shadow-emerald-500/10"
            : "bg-white dark:bg-[#171b1f] border-transparent dark:border-white/5 hover:shadow-lg hover:border-gray-300 dark:hover:border-white/10"
        }`}
    >
      {/* Avatar */}
      <div
        className={`relative  rounded-full overflow-hidden border-2 transition-colors 
        ${isSelected ? "border-chart-4 dark:border-emerald-400" : "border-gray-200 dark:border-white/10 group-hover:border-chart-4 dark:group-hover:border-emerald-400"}`}
      >
        <Avatar initials={player?.name} img={player?.avatar} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`font-bold text-base truncate ${isSelected ? "text-chart-4 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}
          >
            {player?.name}
          </h3>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase whitespace-nowrap dark:bg-white/5 dark:text-gray-300 ${""}`}
          >
            {player?.role}
          </span>
        </div>

        <div className="flex gap-4 mt-1">
          {isBowler ? (
            <>
              <Stat label="Econ" value={player.econ} selected={isSelected} />
              <Stat label="Wkts" value={player.wkts} selected={isSelected} />
            </>
          ) : (
            <>
              <Stat label="Avg" value={player?.avg} selected={isSelected} />
              <Stat label="S/R" value={player?.sr} selected={isSelected} />
            </>
          )}
        </div>
      </div>

      {/* Chevron / check */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
        ${
          isSelected
            ? "bg-chart-4 dark:bg-emerald-500 text-white"
            : "bg-gray-100 dark:bg-white/5 group-hover:bg-chart-4 dark:group-hover:bg-emerald-500 group-hover:text-white text-gray-600 dark:text-gray-300"
        }`}
      >
        {isSelected ? <Check size={18} /> : <ChevronRight size={18} />}
      </div>
    </div>
  )
}
