"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, RotateCcw, Star, RefreshCcw } from "lucide-react"
import { useSelector } from "react-redux"

/*
|--------------------------------------------------------------------------
| WHAT SHOULD COME FROM REDUX?
|--------------------------------------------------------------------------
| Global / Shared Match State:
|
| - match details
| - current innings
| - striker / non striker
| - current bowler
| - score
| - wickets
| - overs
| - ball by ball array
| - partnership
| - target
| - batting team / bowling team
|
| Because:
| - multiple components need it
| - must persist whole scoring session
| - should sync with localStorage
| - eventually sent to backend
|
|--------------------------------------------------------------------------
| WHAT SHOULD STAY LOCAL STATE?
|--------------------------------------------------------------------------
|
| UI ONLY STATE:
|
| - selected extra modal
| - animations
| - loading states
| - undo confirmation
| - temporary dropdown state
| - open/close panels
|
| Because:
| - not needed globally
| - purely presentational
|
|--------------------------------------------------------------------------
| YOUR FINAL FLOW
|--------------------------------------------------------------------------
|
| click run button
| -> create ball object
| -> dispatch(addBall(ball))
| -> redux updates score
| -> middleware/store subscriber syncs localStorage
| -> after match submit full innings array to backend
|
|--------------------------------------------------------------------------
*/

export default function LiveScoringPage() {

  // const  = useSelector((state) => state.match.teams)
  const { teamA, teamB, loading } = useSelector((state) => state.match.match.teams)
  


  const initialMatch = {
    match: {
      teamA: teamA.name,
      teamB: teamB.name,
      innings: 1,
      target: 185,
    },
  
    score: {
      runs: 142,
      wickets: 3,
      overs: 15,
      balls: 4,
      crr: 9.06,
      rrr: 10.12,
    },
  
    batsmen: [
      {
        id: 1,
        name: "Steve Smith",
        runs: 45,
        balls: 32,
        fours: 4,
        sixes: 1,
        strikeRate: 140.6,
        striker: true,
      },
      {
        id: 2,
        name: "Alex Carey",
        runs: 12,
        balls: 8,
        fours: 1,
        sixes: 0,
        strikeRate: 150,
        striker: false,
      },
    ],
  
    bowler: {
      id: 1,
      name: "Mark Wood",
      overs: 3.4,
      maidens: 0,
      runs: 32,
      wickets: 1,
      economy: 8.73,
    },
  
    recentBalls: [],
  
    partnership: {
      runs: 28,
      balls: 14,
    },
  
    lastWicket: "M. Marsh 22 (15)",
  }



  // --------------------------------------------------------------------------
  // LOCAL UI STATE
  // --------------------------------------------------------------------------

  const [selectedExtra, setSelectedExtra] = useState(null)

  // --------------------------------------------------------------------------
  // DUMMY REDUX LIKE STATE
  // --------------------------------------------------------------------------

  const [matchState, setMatchState] = useState(initialMatch)

  // --------------------------------------------------------------------------
  // LOCAL STORAGE SYNC
  // --------------------------------------------------------------------------

  useEffect(() => {
    const stored = localStorage.getItem("live-match")

    if (stored) {
      setMatchState(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("live-match", JSON.stringify(matchState))
  }, [matchState])

  // --------------------------------------------------------------------------
  // ADD BALL HANDLER
  // --------------------------------------------------------------------------

  const addBall = ({ runs = 0, type = "normal", extraType = null }) => {
    /*
    |--------------------------------------------------------------------------
    | THIS IS THE OBJECT YOU SHOULD STORE IN REDUX
    |--------------------------------------------------------------------------
    */

    const ballObject = {
      _id: crypto.randomUUID(),

      match_id: "match_001",

      innings: 1,

      over: matchState.score.overs,

      ball_in_over: matchState.score.balls,

      striker_id: matchState.batsmen.find((p) => p.striker)?.id,

      non_striker_id: matchState.batsmen.find((p) => !p.striker)?.id,

      bowler_id: matchState.bowler.id,

      runs,

      extra_type: extraType,

      wicket: type === "wicket",

      timestamp: Date.now(),
    }

    console.log("BALL OBJECT:", ballObject)

    // ----------------------------------------------------------------------
    // DUMMY SCORE UPDATE
    // ----------------------------------------------------------------------

    setMatchState((prev) => {
      const updatedBalls = [...prev.recentBalls]

      if (type === "wicket") {
        updatedBalls.push("W")
      } else if (extraType === "nb") {
        updatedBalls.push(`${runs}nb`)
      } else if (extraType === "wide") {
        updatedBalls.push(`${runs}wd`)
      } else {
        updatedBalls.push(String(runs))
      }

      if (updatedBalls.length >= 6) {
        updatedBalls.shift()
      }

      let newBalls = prev.score.balls
      let newOvers = prev.score.overs

      if (!extraType || extraType === "bye" || extraType === "legbye") {
        newBalls += 1

        if (newBalls >= 6) {
          newOvers += 1
          newBalls = 0
        }
      }

      return {
        ...prev,

        recentBalls: updatedBalls,

        score: {
          ...prev.score,
          runs: prev.score.runs + runs,
          wickets: type === "wicket" ? prev.score.wickets + 1 : prev.score.wickets,
          overs: newOvers,
          balls: newBalls,
        },
      }
    })

    setSelectedExtra(null)
  }

  // --------------------------------------------------------------------------
  // RUN BUTTONS
  // --------------------------------------------------------------------------

  const runButtons = [0, 1, 2, 3, 4, 6]

  // --------------------------------------------------------------------------
  // THIS OVER RUNS
  // --------------------------------------------------------------------------

  const thisOverRuns = useMemo(() => {
    return matchState.recentBalls.reduce((acc, item) => {
      const parsed = parseInt(item)
      return isNaN(parsed) ? acc : acc + parsed
    }, 0)
  }, [matchState.recentBalls])

  return (
    <div className="min-h-screen bg-slate-50 pb-52">
      {/* HEADER */}

      <header className="sticky top-0 z-50 bg-primary text-white shadow-xl">
        <div className="px-4 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <button className="mt-1">
                <ArrowLeft className="size-5" />
              </button>

              <div>
                <h1 className="text-xl font-bold">
                  {matchState.match.teamA} vs {matchState.match.teamB}
                </h1>

                <div className="mt-1 flex items-center gap-2">
                  <div className="size-2 rounded-full bg-red-500 animate-pulse" />

                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Live • {matchState.match.innings}st Innings
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase font-bold opacity-70">Target: {matchState.match.target}</p>

              <div className="mt-1 flex gap-4 text-sm font-bold">
                <p>
                  CRR <span className="text-green-300">{matchState.score.crr}</span>
                </p>

                <p>
                  RRR <span className="opacity-70">{matchState.score.rrr}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <h2 className="text-5xl font-black italic tracking-tight">
              {matchState.score.runs}/{matchState.score.wickets}
            </h2>

            <p className="pb-1 text-lg opacity-80">
              {matchState.score.overs}.{matchState.score.balls} Overs
            </p>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-4xl px-4 py-5 space-y-4">
        {/* RECENT BALLS */}

        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Recent Balls</p>

            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
              This Over: {thisOverRuns} runs
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {matchState.recentBalls.map((ball, index) => {
              const isWicket = ball === "W"
              const isBoundary = ball === "4" || ball === "6"

              return (
                <div
                  key={index}
                  className={`min-w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${
                      isWicket
                        ? "bg-red-500 text-white"
                        : isBoundary
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-700"
                    }
                  `}
                >
                  {ball}
                </div>
              )
            })}
          </div>
        </section>

        {/* BATSMEN */}

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 flex">
            <span className="flex-1">Batsman</span>
            <span className="w-12 text-center">R</span>
            <span className="w-12 text-center">B</span>
            <span className="w-12 text-center">4s</span>
            <span className="w-12 text-center">6s</span>
            <span className="w-16 text-right">SR</span>
          </div>

          {matchState.batsmen.map((player) => (
            <div
              key={player.id}
              className={`flex items-center px-4 py-4 border-t
              ${player.striker ? "bg-primary/5" : "bg-white"}`}
            >
              <div className="flex flex-1 items-center gap-3">
                {player.striker && <Star className="size-4 text-primary fill-primary" />}

                <span className={`font-bold ${player.striker ? "text-primary" : "text-slate-700"}`}>
                  {player.name}
                </span>
              </div>

              <span className="w-12 text-center font-black">{player.runs}</span>

              <span className="w-12 text-center text-sm text-slate-500">{player.balls}</span>

              <span className="w-12 text-center text-sm text-slate-500">{player.fours}</span>

              <span className="w-12 text-center text-sm text-slate-500">{player.sixes}</span>

              <span className="w-16 text-right text-sm font-bold">{player.strikeRate}</span>
            </div>
          ))}
        </section>

        {/* BOWLER */}

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 flex">
            <span className="flex-1">Bowler</span>
            <span className="w-12 text-center">O</span>
            <span className="w-12 text-center">M</span>
            <span className="w-12 text-center">R</span>
            <span className="w-12 text-center">W</span>
            <span className="w-16 text-right">Econ</span>
          </div>

          <div className="flex items-center px-4 py-4">
            <div className="flex-1">
              <h3 className="font-bold">{matchState.bowler.name}</h3>

              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Fast • Over the wicket
              </p>
            </div>

            <span className="w-12 text-center font-bold">{matchState.bowler.overs}</span>

            <span className="w-12 text-center">{matchState.bowler.maidens}</span>

            <span className="w-12 text-center">{matchState.bowler.runs}</span>

            <span className="w-12 text-center font-black text-red-500">{matchState.bowler.wickets}</span>

            <span className="w-16 text-right font-bold text-primary">{matchState.bowler.economy}</span>
          </div>
        </section>

        {/* EXTRA INFO */}

        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Partnership</p>

            <p className="mt-1 text-sm font-bold text-primary">
              {matchState.partnership.runs} ({matchState.partnership.balls} balls)
            </p>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Last Wicket</p>

            <p className="mt-1 text-sm font-bold">{matchState.lastWicket}</p>
          </div>
        </section>
      </main>

      {/* SCORING PANEL */}

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur-md p-4 shadow-2xl">
        {/* ACTIONS */}

        <div className="mb-3 grid grid-cols-6 gap-2">
          <button
            onClick={() =>
              addBall({
                runs: 0,
                type: "wicket",
              })
            }
            className="h-12 rounded-xl bg-red-500 text-xs font-black text-white"
          >
            WKT
          </button>

          <button
            onClick={() => setSelectedExtra("wide")}
            className="h-12 rounded-xl border bg-white text-xs font-bold"
          >
            Wide
          </button>

          <button
            onClick={() => setSelectedExtra("nb")}
            className="h-12 rounded-xl border bg-white text-xs font-bold"
          >
            NB
          </button>

          <button
            onClick={() => setSelectedExtra("bye")}
            className="h-12 rounded-xl border bg-white text-xs font-bold"
          >
            Bye
          </button>

          <button
            onClick={() => setSelectedExtra("legbye")}
            className="h-12 rounded-xl border bg-white text-xs font-bold"
          >
            LBye
          </button>

          <button className="flex h-12 items-center justify-center rounded-xl bg-primary text-white">
            <RotateCcw className="size-5" />
          </button>
        </div>

        {/* RUN BUTTONS */}

        <div className="grid grid-cols-6 gap-2">
          {runButtons.map((run) => (
            <button
              key={run}
              onClick={() =>
                addBall({
                  runs: run,
                  extraType: selectedExtra,
                })
              }
              className={`
                h-14 rounded-xl text-2xl font-black transition active:scale-95
                ${run === 4 || run === 6 ? "bg-primary text-white" : "bg-primary/10 text-primary"}
              `}
            >
              {run}
            </button>
          ))}
        </div>

        {/* SELECTED EXTRA */}

        {selectedExtra && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3">
            <p className="text-sm font-medium text-primary">Extra Selected: {selectedExtra}</p>

            <button
              onClick={() => setSelectedExtra(null)}
              className="flex items-center gap-2 text-sm font-bold text-primary"
            >
              <RefreshCcw className="size-4" />
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
