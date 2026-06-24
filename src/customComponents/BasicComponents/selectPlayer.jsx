"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { MdSportsCricket } from "react-icons/md"
import { BiSolidCricketBall } from "react-icons/bi"
import { FaUser } from "react-icons/fa"
import { useMemo } from "react"

import { X, SlidersHorizontal, ChevronRight, Check } from "lucide-react"

const DUMMY_BATSMEN = [
  {
    id: 1,
    name: "Alastair Cook",
    role: "LH Bat",
    roleVariant: "secondary",
    avg: "45.35",
    sr: "128.4",
    initials: "AC",
  },
  {
    id: 2,
    name: "Joe Root",
    role: "RH Bat",
    roleVariant: "secondary",
    avg: "50.12",
    sr: "135.2",
    initials: "JR",
  },
  {
    id: 3,
    name: "Ben Stokes",
    role: "All-Rounder",
    roleVariant: "primary",
    avg: "36.10",
    sr: "148.9",
    initials: "BS",
  },
  {
    id: 4,
    name: "Jonny Bairstow",
    role: "RH Bat",
    roleVariant: "secondary",
    avg: "38.44",
    sr: "141.2",
    initials: "JB",
  },
  {
    id: 5,
    name: "Zak Crawley",
    role: "RH Bat",
    roleVariant: "secondary",
    avg: "31.20",
    sr: "59.8",
    initials: "ZC",
  },
  {
    id: 6,
    name: "Harry Brook",
    role: "RH Bat",
    roleVariant: "secondary",
    avg: "55.80",
    sr: "72.1",
    initials: "HB",
  },
]

const DUMMY_BOWLERS = [
  {
    id: 7,
    name: "James Anderson",
    role: "Fast",
    roleVariant: "tertiary",
    econ: "3.24",
    wkts: "690",
    initials: "JA",
  },
  {
    id: 8,
    name: "Stuart Broad",
    role: "Fast-Medium",
    roleVariant: "tertiary",
    econ: "3.56",
    wkts: "604",
    initials: "SB",
  },
  {
    id: 9,
    name: "Jack Leach",
    role: "Spin",
    roleVariant: "tertiary",
    econ: "3.01",
    wkts: "165",
    initials: "JL",
  },
  {
    id: 10,
    name: "Ollie Robinson",
    role: "Fast-Medium",
    roleVariant: "tertiary",
    econ: "3.38",
    wkts: "98",
    initials: "OR",
  },
  {
    id: 11,
    name: "Mark Wood",
    role: "Fast",
    roleVariant: "tertiary",
    econ: "4.12",
    wkts: "200",
    initials: "MW",
  },
]


export default function SelectParticipantsModal({ onClose, onConfirm }) {
  // 0 = batting, 1 = balling
  const OrderdTeams = useRef([])
  const { teamA, teamB, loading } = useSelector((state) => state.match.match.teams)
  const { tossDecision, tossWinner } = useSelector((state) => state?.match?.match)
  const pendingNewBatsman = useSelector(
    (state) => state.match?.innings?.pendingNewBatsman ?? { stricker: null, nonStricker: null },
  )
  const pendingNewBowler = useSelector((state) => state.match?.innings?.pendingNewBowler ?? null)

  const [search, setSearch] = useState("")

  useEffect(() => {
    orderingTeams()
  }, [teamA, teamB])

  // order teams temas in array [0] = batting, [1] = bowling
  function orderingTeams() {
    const TosswinningTeam = [teamA, teamB].find((team) => team.id === tossWinner.id)
    const ToosLostTeam = [teamA, teamB].find((team) => team.id !== tossWinner.id)

    if (tossDecision === "bat") {
      OrderdTeams.current[0] = TosswinningTeam
      OrderdTeams.current[1] = ToosLostTeam
    } else if (tossDecision === "bowl") {
      OrderdTeams.current[0] = ToosLostTeam
      OrderdTeams.current[1] = TosswinningTeam
    }
  }

  const needStriker = pendingNewBatsman?.stricker
  const needBothBatsmen = pendingNewBatsman.nonStricker && pendingNewBatsman.stricker
  const needNonstricker = pendingNewBatsman.nonStricker
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

  const isBowlerTab = activeTab === "bowler"

  // Player selection >>>>>
  // There are listing batsman By defalut,
  // and Bowler when the Bowler tab is active

  //  What we'll do ? >>>>>>>>
  // For batsmen [0] and only whos's isDissmissed is false
  // For bowler [1]
  // revers the team order when the inings got changed

  const allPlayers = isBowlerTab ? DUMMY_BOWLERS : DUMMY_BATSMEN
  const filtered = allPlayers.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  // ── Select a player ───────────────────────────────────────────────────────
  function handleSelect(player) {
    const next = { ...playerSelections, [activeTab]: player.id }
    setplayerSelections(next)

    // Auto-advance to next unselected tab
    const currentIdx = tabList.indexOf(activeTab)
    const nextTab = tabList.find((t, i) => i > currentIdx && !next[t] === true)
    // If there's a next tab that has no selection yet, move there
    const nextUnfilled = tabList.find((t, i) => i > currentIdx && next[t] === null)
    if (nextUnfilled) setActiveTab(nextUnfilled)
  }

  // ── Confirm ───────────────────────────────────────────────────────────────
  const allFilled = tabList.every((t) => playerSelections[t] !== null)

  function handleConfirm() {
    if (!allFilled) return
    const resolve = (tab, pool) => pool.find((p) => p.id === playerSelections[tab]) ?? null
    onConfirm?.({
      striker: resolve("striker", DUMMY_BATSMEN),
      nonStriker: resolve("nonStriker", DUMMY_BATSMEN),
      bowler: resolve("bowler", DUMMY_BOWLERS),
    })
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
        style={{ background: "rgba(25,28,30,0.45)", backdropFilter: "blur(12px)" }}
      >
        {/* Modal */}
        <div className="bg-white w-full max-w-xl max-h-[92dvh] md:max-h-[780px] rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-[] flex items-center justify-between px-5 py-4 z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-full  active:scale-95 transition-all text-transparent"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center">
              <h1 className="font-bold  text-base">{stepTitle}</h1>
              <span className="text-[10px] uppercase tracking-widest font-bold ">
                Step {stepNum} of {tabList.length}
              </span>
            </div>
            <span className="text-primary font-bold text-xs px-3 py-1 rounded-full bg-primary/10">
              Cricket Pro
            </span>
          </header>

          {/* Search */}
          <div className="px-5 pt-3 pb-2  space-y-3">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-3.5  pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players by name…"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-chart-4 transition-all"
              />
            </div>

            {/* Pool label + filter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  {isBowlerTab ? "Bowler Pool" : "Batsmen Pool"}
                </span>

                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-extrabold rounded-full">
                  {filtered.length} AVAILABLE
                </span>
              </div>

              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-green-700 transition-colors">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Player list */}
          <div
            className="flex-1 overflow-y-auto px-5 py-3 space-y-3 bg-gray-100/40"
            style={{ scrollbarWidth: "none" }}
          >
            {filtered.length === 0 && (
              <p className="text-center text-sm text-black mt-10">No players found.</p>
            )}
            {filtered.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isBowler={isBowlerTab}
                isSelected={playerSelections[activeTab] === player.id}
                onClick={() => handleSelect(player)}
              />
            ))}
          </div>

          {/* Tab bar */}
          <div className=" px-4 pt-3 pb-4 flex items-center justify-around border-t">
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
          <div className="px-5 pb-6 ">
            <button
              onClick={handleConfirm}
              disabled={!allFilled}
              className=" bg-primary text-white w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-40"
             
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

function TabButton({ label, icon: Icon, isActive, isDone, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 px-5 py-2 rounded-full transition-all duration-200 text-xs font-bold
  ${
    isActive
      ? "bg-chart-4/10 text-primary"
      : isDone
        ? "text-primary opacity-90"
        : "text-gray-500 opacity-60 hover:opacity-90"
  }`}
    >
      <div className="relative">
        <Icon size={20} />
        {isDone && !isActive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full  flex items-center justify-center">
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
        <span
          className={`text-[10px] uppercase font-bold tracking-wider text-gray-500 }`}
        >
          {label}
        </span>
        <span
          className={`text-sm font-bold ${selected ? " text-chart-4" : "text-gray-950"}`}
        >
          {value}
        </span>
      </div>
    )
  }

  function Avatar({ initials }) {
    return (
      <div className="w-14 h-14 rounded-full bg-white-100 flex items-center justify-center text-gray-950 font-bold text-lg select-none">
        {initials}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 border active:scale-[0.98]
        ${
          isSelected
            ? "bg-chart-4/10 border-chart-4 shadow-md"
            : "bg-white border-transparent hover:shadow-lg hover:border-gray-300"
        }`}
    >
      {/* Avatar */}
      <div
        className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-colors flex-shrink-0
        ${isSelected ? "border-chart-4" : "border-gray-200 group-hover:border-chart-4"}`}
      >
        <Avatar initials={player.initials} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`font-bold text-base truncate ${isSelected ? "text-chart-4" : "text-gray-900"}`}
          >
            {player.name}
          </h3>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase whitespace-nowrap ${""}`}
          >
            {player.role}
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
              <Stat label="Avg" value={player.avg} selected={isSelected} />
              <Stat label="S/R" value={player.sr} selected={isSelected} />
            </>
          )}
        </div>
      </div>

      {/* Chevron / check */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all
        ${
          isSelected
            ? "bg-chart-4 text-white"
            : "bg-gray-100 group-hover:bg-chart-4 group-hover:text-white text-gray-600"
        }`}
      >
        {isSelected ? <Check size={18} /> : <ChevronRight size={18} />}
      </div>
    </div>
  )
}