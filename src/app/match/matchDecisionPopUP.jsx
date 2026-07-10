"use client"

import React, { useEffect } from "react"
import { Trophy, Star, Flame, Activity, Clock, Users, BarChart3, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { resetMatch, startInnings_fn } from "@/utils/reduxSclices/matchSlice"
import { useRouter } from "next/navigation"

// --- MAIN WRAPPER COMPONENT ---
export default function MatchDecisionPopUP({ setshowPopup }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { balls } = useSelector((state) => state?.match?.innings || [])
  const { matchWinner } = useSelector((state) => state?.match?.match)
  const { teams } = useSelector((state) => state.match.match)
  const matchSummary = computeMatchSummary({ balls, teams, winningTeam_id: matchWinner?.id })

  console.log({matchWinner});

  function ClosePopUP() {
    router.push("/")
    setshowPopup((prev) => ({ ...prev, matchDecision: false }))
    dispatch(resetMatch())
  }

  function startNewMatch() {
    router.push("/selectTeamToStartMatch")
    dispatch(resetMatch())
    dispatch(startInnings_fn())
  }

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
          onClick={() => {
            ClosePopUP()
          }}
          className="absolute top-4 right-4 text-[#404944] hover:text-[#003527] p-2 rounded-full hover:bg-[#eceef0] transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto w-full no-scrollbar">
          <ModalHeader winMessage={`${matchWinner?.name || ""} won `} />
          <ScorecardsSection matchSummary={matchSummary} />
          <ModalFooter ClosePopUP={ClosePopUP} startNewMatch={startNewMatch} />
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

function ScorecardsSection({ matchSummary }) {
  const { teamA, teamB } = matchSummary
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      {[teamA, teamB].map((team, index) => (
        <article
          key={team.id}
          className={`${
            team.wasWon
              ? "bg-[#ffffff] border-2 border-[#22C55E] shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden"
              : "bg-[#f2f4f6] border border-[#bfc9c3]"
          } rounded-2xl p-6 group`}
        >
          {team.wasWon && (
            <div className="absolute top-0 right-0 bg-[#22C55E] text-white px-4 py-1 rounded-bl-xl font-bold text-xs uppercase tracking-wider">
              Winner
            </div>
          )}

          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-[#404944] font-semibold text-sm mb-1">Team {index === 0 ? "A" : "B"}</h3>

              <p className="text-[#003527] font-black text-2xl tracking-tight">{team.name}</p>
            </div>

            <div className="text-right">
              <p className="text-[#003527] font-black text-4xl [text-shadow:0_0_15px_rgba(34,197,94,0.3)]">
                {team.runs}/{team.fallenWickets}
              </p>

              <p className="text-[#22C55E] font-bold text-sm tracking-wide">{team.playedOvers} Overs</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function ModalFooter({ ClosePopUP, startNewMatch }) {
  return (
    <footer className="flex flex-col md:flex-row gap-4 items-center justify-center">
      <button onClick={()=>{startNewMatch()}} className="w-full md:w-auto px-10 py-4 bg-white border-2 border-[#bfc9c3] hover:border-[#003527] text-[#003527] font-bold uppercase tracking-widest text-sm rounded-lg transition-all active:scale-95">
        New Match
      </button>
      <button
        onClick={() => {
          ClosePopUP()
        }}
        className="w-full md:w-auto px-10 py-4 text-[#404944] hover:text-[#003527] font-bold uppercase tracking-widest text-xs transition-colors"
      >
        Close
      </button>
    </footer>
  )
}

// Utility functions
function computeMatchSummary({ balls, teams, winningTeam_id }) {
  if (!Array.isArray(balls)) {
    throw new Error("balls must be an array")
  }

  const initCard = (team) => ({
    id: team.id,
    name: team.name,

    wasWon: winningTeam_id === null ? null : winningTeam_id === team.id,

    runs: 0,
    fallenWickets: 0,

    overs: 0,
    ballsInOver: 0,
    playedOvers: "0.0",

    fallOfWickets: [],
  })

  const scorecards = {
    [teams.teamA.id]: initCard(teams.teamA),
    [teams.teamB.id]: initCard(teams.teamB),
  }

  for (const ball of balls) {
    const battingId = ball.battingTeam?.id

    if (!battingId || !scorecards[battingId]) continue

    const card = scorecards[battingId]

    // Total runs
    card.runs += (ball.runs || 0) + (ball.extraRuns || 0)

    // Overs
    if (ball.isLegalDelivery) {
      card.ballsInOver++

      if (card.ballsInOver === 6) {
        card.overs++
        card.ballsInOver = 0
      }
    }

    card.playedOvers = `${card.overs}.${card.ballsInOver}`

    // Wickets
    if (ball.isWicket) {
      card.fallenWickets++

      card.fallOfWickets.push({
        wicketNumber: card.fallenWickets,
        scoreAtFall: card.runs,
        over: card.playedOvers,
        strikerId: ball.strikerId,
        bowlerId: ball.bowlerId,
      })
    }
  }

  return {
    teamA: scorecards[teams.teamA.id],
    teamB: scorecards[teams.teamB.id],
  }
}
