"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Search, Trophy, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

// const players = [
//   {
//     id: 1,
//     name: "Alastair Cook",
//     role: "Left-hand Bat",
//     avg: 45.35,
//     sr: 112.4,
//     number: 8,
//     image: "https://i.pravatar.cc/150?img=1",
//   },
//   {
//     id: 2,
//     name: "James Anderson",
//     role: "Right-arm Fast",
//     avg: 12.1,
//     sr: 95.2,
//     number: 12,
//     image: "https://i.pravatar.cc/150?img=2",
//   },
//   {
//     id: 3,
//     name: "Sarah Taylor",
//     role: "Wicket Keeper Bat",
//     avg: 38.4,
//     sr: 128.5,
//     number: 4,
//     image: "https://i.pravatar.cc/150?img=3",
//   },
//   {
//     id: 4,
//     name: "Kevin Pietersen",
//     role: "Right-hand Bat",
//     avg: 47.28,
//     sr: 145.2,
//     image: "https://i.pravatar.cc/150?img=4",
//   },
// ]

// export default function PlayerSelectionModal({ criteria }) {
//   // 0 = batting, 1 = balling
//   const OrderdTeams = useRef([])
//   // should be batt OR ball
//   const selectionCriteria = useRef("")
//   const { teamA, teamB, loading } = useSelector((state) => state.match.match.teams)
//   const { tossDecision, tossWinner } = useSelector((state) => state.match.match)
//   const [players, setplayers] = useState([])

//   useEffect(() => {
//     orderingTeams()
//   }, [teamA, teamB])

//   function orderingTeams() {
//     const TosswinningTeam = [teamA, teamB].find((team) => team.id === tossWinner.id)
//     const ToosLostTeam = [teamA, teamB].find((team) => team.id !== tossWinner.id)

//     if (tossDecision === "bat") {
//       OrderdTeams.current[0] = TosswinningTeam
//       OrderdTeams.current[1] = ToosLostTeam
//     } else if (tossDecision === "bowl") {
//       OrderdTeams.current[0] = ToosLostTeam
//       OrderdTeams.current[1] = TosswinningTeam
//     }

//     if (criteria.current.playerType === "batsmen") {
//       setplayers(OrderdTeams.current[0].players)
//     }
//   }

//   return (
//     <AnimatePresence>
//       <>
//         {/* Backdrop */}
//         <motion.div
//           className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         />

//         {/* Modal Wrapper */}
//         <motion.div
//           className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             initial={{
//               y: "100%",
//               opacity: 0,
//             }}
//             animate={{
//               y: 0,
//               opacity: 1,
//             }}
//             exit={{
//               y: "100%",
//               opacity: 0,
//             }}
//             transition={{
//               duration: 0.35,
//               ease: [0.22, 1, 0.36, 1],
//             }}
//             className="
//                 w-full
//                 max-w-2xl
//                 bg-background
//                 rounded-t-[2rem]
//                 sm:rounded-3xl
//                 shadow-2xl
//                 flex
//                 flex-col
//                 max-h-[90vh]
//                 overflow-hidden
//               "
//           >
//             <Notch></Notch>
//             <Header></Header>
//             <SearchPlayers></SearchPlayers>
//             <PlayersList players={players}></PlayersList>
//             <Footer></Footer>
//           </motion.div>
//         </motion.div>
//       </>
//     </AnimatePresence>
//   )

//   // Logic Functions

//   // UI Functions
//   function PlayersList({ players }) {
//     if (!players || !Array.isArray(players)) return
//     return (
//       <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
//         {players.map((player) => (
//           <div
//             key={player.id}
//             className="
//                       flex
//                       items-center
//                       gap-4
//                       rounded-2xl
//                       bg-muted/40
//                       p-4
//                       transition-all
//                       hover:bg-muted
//                     "
//           >
//             <div className="relative">
//               <img src={player.image} alt={player.name} className="h-14 w-14 rounded-full object-cover" />

//               {player.number && (
//                 <div
//                   className="
//                             absolute
//                             -bottom-1
//                             -right-1
//                             flex
//                             h-5
//                             w-5
//                             items-center
//                             justify-center
//                             rounded-full
//                             bg-primary
//                             text-[10px]
//                             font-bold
//                             text-white
//                           "
//                 >
//                   {player.number}
//                 </div>
//               )}
//             </div>

//             <div className="flex-1">
//               <h3 className="font-semibold">{player.name}</h3>

//               <p className="text-xs text-muted-foreground">{player.role}</p>

//               <div className="mt-2 flex gap-5">
//                 <div>
//                   <p className="text-[10px] text-muted-foreground">AVG</p>

//                   <p className="font-bold">{player.avg}</p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] text-muted-foreground">SR</p>

//                   <p className="font-bold">{player.sr}</p>
//                 </div>
//               </div>
//             </div>

//             <Button className="bg-primary text-white hover:bg-primary/90">Select</Button>
//           </div>
//         ))}
//       </div>
//     )
//   }

//   function SearchPlayers() {
//     return (
//       <div className="space-y-4 px-6 pb-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input placeholder="Search by name or role..." className="pl-10" />
//         </div>
//       </div>
//     )
//   }

//   function Header() {
//     return (
//       <div className="px-6 pb-4">
//         <h2 className="text-2xl font-bold">Select Player</h2>

//         <p className="mt-1 text-sm text-muted-foreground">Assigning {criteria.current.playerType === "batsmen"?"Batsmen":"Bowler"} for Innings 1</p>
//       </div>
//     )
//   }

//   function Notch() {
//     return (
//       <div className="flex justify-center py-4">
//         <div className="h-1.5 w-12 rounded-full bg-black/30" />
//       </div>
//     )
//   }
// }
// function Footer() {
//   return (
//     <div className="flex items-center justify-between border-t px-6 py-4">
//       <div className="flex items-center gap-2 text-muted-foreground">
//         <Users className="h-4 w-4" />
//         <span className="text-sm">11 Players Available</span>
//       </div>
//     </div>
//   )
// }

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>

import { useMemo } from "react"


import { X, SlidersHorizontal, ChevronRight, Check } from "lucide-react";

// ---------------------------------------------------------------------------
// Dummy data – replace with real data / selectors later
// ---------------------------------------------------------------------------
const DUMMY_BATSMEN = [
  { id: 1, name: "Alastair Cook", role: "LH Bat", roleVariant: "secondary", avg: "45.35", sr: "128.4", initials: "AC" },
  { id: 2, name: "Joe Root", role: "RH Bat", roleVariant: "secondary", avg: "50.12", sr: "135.2", initials: "JR" },
  { id: 3, name: "Ben Stokes", role: "All-Rounder", roleVariant: "primary", avg: "36.10", sr: "148.9", initials: "BS" },
  { id: 4, name: "Jonny Bairstow", role: "RH Bat", roleVariant: "secondary", avg: "38.44", sr: "141.2", initials: "JB" },
  { id: 5, name: "Zak Crawley", role: "RH Bat", roleVariant: "secondary", avg: "31.20", sr: "59.8", initials: "ZC" },
  { id: 6, name: "Harry Brook", role: "RH Bat", roleVariant: "secondary", avg: "55.80", sr: "72.1", initials: "HB" },
];

const DUMMY_BOWLERS = [
  { id: 7, name: "James Anderson", role: "Fast", roleVariant: "tertiary", econ: "3.24", wkts: "690", initials: "JA" },
  { id: 8, name: "Stuart Broad", role: "Fast-Medium", roleVariant: "tertiary", econ: "3.56", wkts: "604", initials: "SB" },
  { id: 9, name: "Jack Leach", role: "Spin", roleVariant: "tertiary", econ: "3.01", wkts: "165", initials: "JL" },
  { id: 10, name: "Ollie Robinson", role: "Fast-Medium", roleVariant: "tertiary", econ: "3.38", wkts: "98", initials: "OR" },
  { id: 11, name: "Mark Wood", role: "Fast", roleVariant: "tertiary", econ: "4.12", wkts: "200", initials: "MW" },
];

// ---------------------------------------------------------------------------
// Role badge colours
// ---------------------------------------------------------------------------
const ROLE_BADGE = {
  secondary: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  primary: "bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)]",
  tertiary: "bg-[#ffdad5] text-[#6e372f]",
};

// ---------------------------------------------------------------------------
// Avatar placeholder (initials)
// ---------------------------------------------------------------------------
function Avatar({ initials }) {
  return (
    <div className="w-14 h-14 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-on-primary-container)] font-bold text-lg select-none">
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Player card
// ---------------------------------------------------------------------------
function PlayerCard({ player, isSelected, onClick, isBowler }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 border active:scale-[0.98]
        ${isSelected
          ? "bg-[var(--color-primary-container)] border-[var(--color-primary)] shadow-md"
          : "bg-white border-transparent hover:shadow-lg hover:border-[var(--color-outline-variant)]"
        }`}
    >
      {/* Avatar */}
      <div className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-colors flex-shrink-0
        ${isSelected ? "border-[var(--color-primary)]" : "border-[var(--color-surface-container-high)] group-hover:border-[var(--color-primary)]"}`}>
        <Avatar initials={player.initials} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`font-bold text-base truncate ${isSelected ? "text-[var(--color-on-primary-container)]" : "text-[var(--color-on-surface)]"}`}>
            {player.name}
          </h3>
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase whitespace-nowrap ${ROLE_BADGE[player.roleVariant]}`}>
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
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all
        ${isSelected
          ? "bg-[var(--color-primary)] text-white"
          : "bg-[var(--color-surface-container-low)] group-hover:bg-[var(--color-primary)] group-hover:text-white text-[var(--color-secondary)]"
        }`}>
        {isSelected ? <Check size={18} /> : <ChevronRight size={18} />}
      </div>
    </div>
  );
}

function Stat({ label, value, selected }) {
  return (
    <div className="flex flex-col">
      <span className={`text-[10px] uppercase font-bold tracking-wider ${selected ? "text-[var(--color-on-primary-container)]/70" : "text-[var(--color-outline)]"}`}>
        {label}
      </span>
      <span className={`text-sm font-bold ${selected ? "text-[var(--color-on-primary-container)]" : "text-[var(--color-primary)]"}`}>
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab button (Striker / Non-Striker / Bowler)
// ---------------------------------------------------------------------------
function TabButton({ label, icon: Icon, isActive, isDone, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 px-5 py-2 rounded-full transition-all duration-200 text-xs font-bold
        ${isActive
          ? "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]"
          : isDone
            ? "text-[var(--color-primary)] opacity-90"
            : "text-[var(--color-secondary)] opacity-60 hover:opacity-90"
        }`}
    >
      <div className="relative">
        <Icon size={20} />
        {isDone && !isActive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
            <Check size={8} className="text-white" />
          </span>
        )}
      </div>
      <span>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Derive which tabs to show from redux state
// ---------------------------------------------------------------------------
function useTabs(pendingNewBatsman, pendingNewBowler) {
  // pendingNewBatsman: { stricker: null|"name", nonStricker: null|"name" }
  // pendingNewBowler: null | "name"

  const needStriker = pendingNewBatsman !== null;
  const needNonStriker = pendingNewBatsman !== null && "nonStricker" in (pendingNewBatsman ?? {});
  const needBowler = pendingNewBowler !== undefined; // always present as key

  // Determine which tabs to render
  const tabs = [];

  if (needStriker) tabs.push("striker");
  // Only show non-striker tab if the redux state has a nonStricker key (meaning we need both batsmen)
  if (needStriker && pendingNewBatsman !== null && pendingNewBatsman.nonStricker !== undefined) {
    tabs.push("nonStriker");
  }
  tabs.push("bowler");

  return tabs;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SelectParticipantsModal({ onClose, onConfirm }) {
  // ── Redux ──────────────────────────────────────────────────────────────────
  // Read from store; fall back to demo defaults so the component works standalone
  const pendingNewBatsman = useSelector(
    (state) => state.match?.pendingNewBatsman ?? { stricker: null, nonStricker: null }
  );
  const pendingNewBowler = useSelector(
    (state) => state.match?.pendingNewBowler ?? null
  );

  // ── Derive which tabs are needed ──────────────────────────────────────────
  const needStriker = pendingNewBatsman !== null;
  const needBothBatsmen =
    pendingNewBatsman !== null &&
    "nonStricker" in pendingNewBatsman;
  const needBowler = true; // pendingNewBowler key always present

  // Build ordered tab list
  const tabList = useMemo(() => {
    const list = [];
    if (needStriker) list.push("striker");
    if (needBothBatsmen) list.push("nonStriker");
    if (needBowler) list.push("bowler");
    return list;
  }, [needStriker, needBothBatsmen, needBowler]);

  // ── Local selection state ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(tabList[0]);
  const [selections, setSelections] = useState({
    striker: null,
    nonStriker: null,
    bowler: null,
  });
  const [search, setSearch] = useState("");

  // ── Player list to show ───────────────────────────────────────────────────
  const isBowlerTab = activeTab === "bowler";
  const allPlayers = isBowlerTab ? DUMMY_BOWLERS : DUMMY_BATSMEN;
  const filtered = allPlayers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Select a player ───────────────────────────────────────────────────────
  function handleSelect(player) {
    const next = { ...selections, [activeTab]: player.id };
    setSelections(next);

    // Auto-advance to next unselected tab
    const currentIdx = tabList.indexOf(activeTab);
    const nextTab = tabList.find((t, i) => i > currentIdx && !next[t] === true);
    // If there's a next tab that has no selection yet, move there
    const nextUnfilled = tabList.find((t, i) => i > currentIdx && next[t] === null);
    if (nextUnfilled) {
      setTimeout(() => setActiveTab(nextUnfilled), 180);
    }
  }

  // ── Confirm ───────────────────────────────────────────────────────────────
  const allFilled = tabList.every((t) => selections[t] !== null);

  function handleConfirm() {
    if (!allFilled) return;
    const resolve = (tab, pool) =>
      pool.find((p) => p.id === selections[tab]) ?? null;
    onConfirm?.({
      striker: resolve("striker", DUMMY_BATSMEN),
      nonStriker: resolve("nonStriker", DUMMY_BATSMEN),
      bowler: resolve("bowler", DUMMY_BOWLERS),
    });
  }

  // ── Tab meta ──────────────────────────────────────────────────────────────
  const TAB_META = {
    striker: { label: "Striker", Icon: StrikerIcon },
    nonStriker: { label: "Non-Striker", Icon: NonStrikerIcon },
    bowler: { label: "Bowler", Icon: BowlerIcon },
  };

  const stepNum = tabList.indexOf(activeTab) + 1;
  const stepTitle =
    activeTab === "striker"
      ? "Select Striker"
      : activeTab === "nonStriker"
      ? "Select Non-Striker"
      : "Select Bowler";

  return (
    <>
      {/* CSS Variables */}
      <style>{`
        :root {
          --color-primary: #003527;
          --color-on-primary: #ffffff;
          --color-primary-container: #064e3b;
          --color-on-primary-container: #80bea6;
          --color-primary-fixed: #b0f0d6;
          --color-on-primary-fixed-variant: #0b513d;
          --color-secondary: #545f73;
          --color-on-secondary: #ffffff;
          --color-secondary-container: #d5e0f8;
          --color-on-secondary-container: #586377;
          --color-surface: #f7f9fb;
          --color-surface-container-lowest: #ffffff;
          --color-surface-container-low: #f2f4f6;
          --color-surface-container: #eceef0;
          --color-surface-container-high: #e6e8ea;
          --color-on-surface: #191c1e;
          --color-outline: #707974;
          --color-outline-variant: #bfc9c3;
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
        style={{ background: "rgba(25,28,30,0.45)", backdropFilter: "blur(12px)" }}>

        {/* Modal */}
        <div className="bg-[var(--color-surface)] w-full max-w-xl max-h-[92dvh] md:max-h-[780px] rounded-t-[2rem] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <header className="bg-[var(--color-surface-container-lowest)] flex items-center justify-between px-5 py-4 z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--color-surface-container-low)] active:scale-95 transition-all text-[var(--color-on-surface)]">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center">
              <h1 className="font-bold text-[var(--color-primary)] text-base">{stepTitle}</h1>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-on-secondary-container)]">
                Step {stepNum} of {tabList.length}
              </span>
            </div>
            <span className="text-[var(--color-primary)] font-bold text-xs px-3 py-1 rounded-full"
              style={{ background: "rgba(6,78,59,0.10)" }}>
              Cricket Pro
            </span>
          </header>

          {/* Search */}
          <div className="px-5 pt-3 pb-2 bg-[var(--color-surface-container-lowest)] space-y-3">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-3.5 text-[var(--color-outline)] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players by name…"
                className="w-full bg-[var(--color-surface-container-low)] rounded-xl pl-10 pr-4 py-3 text-sm outline-none placeholder:text-[var(--color-outline)]/60 focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all"
              />
            </div>

            {/* Pool label + filter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[var(--color-on-secondary-container)] uppercase tracking-wide">
                  {isBowlerTab ? "Bowler Pool" : "Batsmen Pool"}
                </span>
                <span className="px-2 py-0.5 bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)] text-[10px] font-extrabold rounded-full">
                  {filtered.length} AVAILABLE
                </span>
              </div>
              <button className="p-1.5 rounded-lg bg-[var(--color-surface-container-low)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Player list */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 bg-[var(--color-surface)]"
            style={{ scrollbarWidth: "none" }}>
            {filtered.length === 0 && (
              <p className="text-center text-sm text-[var(--color-outline)] mt-10">No players found.</p>
            )}
            {filtered.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isBowler={isBowlerTab}
                isSelected={selections[activeTab] === player.id}
                onClick={() => handleSelect(player)}
              />
            ))}
          </div>

          {/* Tab bar */}
          <div className="bg-[var(--color-surface-container-lowest)] px-4 pt-3 pb-4 flex items-center justify-around border-t border-[var(--color-surface-container)]">
            {tabList.map((tab) => {
              const { label, Icon } = TAB_META[tab];
              const isDone = selections[tab] !== null;
              return (
                <TabButton
                  key={tab}
                  label={label}
                  icon={Icon}
                  isActive={activeTab === tab}
                  isDone={isDone}
                  onClick={() => setActiveTab(tab)}
                />
              );
            })}
          </div>

          {/* Confirm button */}
          <div className="px-5 pb-6 bg-[var(--color-surface-container-lowest)]">
            <button
              onClick={handleConfirm}
              disabled={!allFilled}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-40"
              style={{ background: "var(--color-primary)", color: "var(--color-on-primary)" }}
            >
              {allFilled ? "Confirm Selection" : `Select ${TAB_META[tabList.find((t) => !selections[t]) ?? tabList[0]].label}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Inline SVG icons (lucide-react doesn't have cricket-specific icons)
// ---------------------------------------------------------------------------
function StrikerIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function NonStrikerIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <circle cx="16" cy="7" r="3" />
      <path d="M2 20c0-3.5 3-6 7-6" />
      <path d="M13 20c0-3.5 3-6 7-6" />
    </svg>
  );
}

function BowlerIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      <path d="M17 3l3 3-7 7" />
    </svg>
  );
}