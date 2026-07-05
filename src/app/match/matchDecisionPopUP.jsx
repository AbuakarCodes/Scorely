"use client"

import React, { useEffect } from "react"
import { Trophy, Star, Flame, Activity, Clock, Users, BarChart3, X } from "lucide-react"
import { useSelector } from "react-redux"

// --- MAIN WRAPPER COMPONENT ---
export default function MatchDecisionPopUP({ isOpen = true, onClose }) {
  const { balls } = useSelector((state) => state?.match?.innings || [])
  const { matchWinner } = useSelector((state) => state?.match?.match)

  console.log(balls,matchWinner);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#191c1e]/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Glow Effects Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#003527]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#22C55E]/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Main Glassmorphic Panel */}
      <main className="bg-white/90 backdrop-blur-[24px] max-w-4xl w-full rounded-2xl overflow-hidden border border-[#bfc9c3] shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#404944] hover:text-[#003527] p-2 rounded-full hover:bg-[#eceef0] transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Scrollable Container with Hidden Scrollbars */}
        <div
          className="p-8 md:p-12 overflow-y-auto w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx global>{`
            ::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <ModalHeader winMessage={`${matchWinner?.name || ""} won `}  />

          <ScorecardsSection />

          <StatsGrid />

          <AdditionalStatsRow />

          <ModalFooter onClose={onClose} />
        </div>
      </main>
    </div>
  )
}

// --- SUB-COMPONENTS (DEFINED OUTSIDE MAIN FUNCTION) ---

function ModalHeader({ winMessage }) {
  return (
    <header className="text-center mb-12">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-[#EAB308] blur-3xl opacity-10 scale-150"></div>
        <Trophy className="text-[#EAB308] h-20 w-20 md:h-24 md:w-24 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)] fill-[#EAB308] mx-auto" />
      </div>
      <p className="text-[#404944] font-bold tracking-[0.2em] uppercase text-xs mb-2">Match Finished</p>
      <h1 className="font-black text-4xl md:text-6xl tracking-tight text-[#003527] mb-4 leading-tight">
        {winMessage}
      </h1>
    </header>
  )
}

function ScorecardsSection() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      {/* Team A (Winner) */}
      <article className="bg-[#ffffff] border-2 border-[#22C55E] rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-[#22C55E] text-white px-4 py-1 rounded-bl-xl font-bold text-xs uppercase tracking-wider">
          Winner
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-[#404944] font-semibold text-sm mb-1">Team A</h3>
            <p className="text-[#003527] font-black text-2xl tracking-tight">Pakistan</p>
          </div>
          <div className="text-right">
            <p className="text-[#003527] font-black text-4xl [text-shadow:0_0_15px_rgba(34,197,94,0.3)]">
              179/4
            </p>
            <p className="text-[#22C55E] font-bold text-sm tracking-wide">18.5 Overs</p>
          </div>
        </div>
      </article>

      {/* Team B */}
      <article className="bg-[#f2f4f6] border border-[#bfc9c3] rounded-2xl p-6 group">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-[#404944] font-semibold text-sm mb-1">Team B</h3>
            <p className="text-[#191c1e] font-black text-2xl tracking-tight">India</p>
          </div>
          <div className="text-right">
            <p className="text-[#191c1e] font-black text-4xl opacity-80">178/6</p>
            <p className="text-[#404944] font-medium text-sm">20.0 Overs</p>
          </div>
        </div>
      </article>
    </div>
  )
}

function StatsGrid() {
  const hoverCardStyle =
    "bg-[#eceef0] rounded-xl p-5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:translate-y-[-2px] hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#bfc9c3]/30"
  const labelStyle = "text-[#404944] text-[10px] font-bold uppercase tracking-widest mb-1"

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      <div className={hoverCardStyle}>
        <Star className="text-[#EAB308] fill-[#EAB308] h-6 w-6 mb-3" />
        <p className={labelStyle}>Player of Match</p>
        <p className="text-[#003527] font-bold text-lg leading-tight">Babar Azam</p>
      </div>

      <div className={hoverCardStyle}>
        <Flame className="text-[#22C55E] h-6 w-6 mb-3" />
        <p className={labelStyle}>Top Scorer</p>
        <p className="text-[#003527] font-bold text-lg leading-tight">M. Rizwan (71)</p>
      </div>

      <div className={hoverCardStyle}>
        <Activity className="text-[#545f73] h-6 w-6 mb-3" />
        <p className={labelStyle}>Best Bowler</p>
        <p className="text-[#003527] font-bold text-lg leading-tight">S. Afridi (3/22)</p>
      </div>

      <div className={hoverCardStyle}>
        <Clock className="text-[#191c1e] h-6 w-6 mb-3" />
        <p className={labelStyle}>Duration</p>
        <p className="text-[#003527] font-bold text-lg leading-tight">3h 45m</p>
      </div>
    </section>
  )
}

function AdditionalStatsRow() {
  const titleLabelStyle = "text-[#404944] text-[10px] font-bold uppercase tracking-widest"

  return (
    <section className="bg-[#e6e8ea]/40 rounded-2xl p-6 border border-[#bfc9c3]/50 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#22C55E]/10 p-3 rounded-full">
            <Users className="text-[#22C55E] h-5 w-5" />
          </div>
          <div>
            <p className={titleLabelStyle}>Highest Partnership</p>
            <p className="text-[#003527] font-bold text-xl">
              82 Runs <span className="text-sm font-normal text-[#404944] ml-2">(Rizwan &amp; Babar)</span>
            </p>
          </div>
        </div>

        <div className="h-px md:h-12 w-full md:w-px bg-[#bfc9c3]"></div>

        <div className="flex items-center gap-4">
          <div className="bg-[#EAB308]/10 p-3 rounded-full">
            <BarChart3 className="text-[#EAB308] h-5 w-5" />
          </div>
          <div>
            <p className={titleLabelStyle}>Boundaries</p>
            <p className="text-[#003527] font-bold text-xl">
              18 <span className="text-xs text-[#404944] font-medium">Fours</span> / 9{" "}
              <span className="text-xs text-[#404944] font-medium">Sixes</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ModalFooter({ onClose }) {
  return (
    <footer className="flex flex-col md:flex-row gap-4 items-center justify-center">
      <button className="w-full md:w-auto px-10 py-4 bg-primary text-[#ffffff] font-black uppercase tracking-widest text-sm rounded-lg transition-all active:scale-95 shadow-lg shadow-[#003527]/20 hover:bg-primary/90">
        View Scorecard
      </button>
      <button className="w-full md:w-auto px-10 py-4 bg-white border-2 border-[#bfc9c3] hover:border-[#003527] text-[#003527] font-bold uppercase tracking-widest text-sm rounded-lg transition-all active:scale-95">
        New Match
      </button>
      <button
        onClick={onClose}
        className="w-full md:w-auto px-10 py-4 text-[#404944] hover:text-[#003527] font-bold uppercase tracking-widest text-xs transition-colors"
      >
        Close
      </button>
    </footer>
  )
}
