"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, RotateCcw, Star, RefreshCcw } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import PlayerSelectionModal from "@/customComponents/BasicComponents/selectPlayer"
import {
  deliverBall,
  handelLastPlayer_isLastPlayerTrue,
  update_CRRandRRR,
  Update_innings,
  update_isDissmissedFlag,
  update_overAndBallInOver,
  update_pendingPlayersFlag,
  Update_Strike,
  update_TotalRuns,
  update_TotalWickets,
  Update_UI_afterInnings,
} from "@/utils/reduxSclices/matchSlice"

export default function LiveScoringPage() {
  const runButtons = [0, 1, 2, 3, 4, 6]
  const dispatch = useDispatch()

  const { teamA, teamB, loading } = useSelector((state) => state.match.match.teams)

  const { batsmen, bowler, innings, id } = useSelector((state) => state.match)
  const { batsmenA, batsmenB } = batsmen
  const { runs, wickets, over, ballsInOver, CRR, RRR, target } = innings?.score
  const { pendingNewBowler, pendingNewBatsman, balls, isFirstInings } = innings
  const { currentBowler } = bowler

  const {  TotalOvers, lastPlayerPlayed } = useSelector((state) => state?.settings || 0)
  const [showPopup, setshowPopup] = useState(false)
  const [selectedExtra, setSelectedExtra] = useState(null)

  useLayoutEffect(() => {
    if (pendingNewBowler || pendingNewBatsman?.nonStriker || pendingNewBatsman?.striker) setshowPopup(true)
    else if (!pendingNewBowler && !pendingNewBatsman?.nonStriker && !pendingNewBatsman?.striker)
      setshowPopup(false)
  }, [pendingNewBowler, pendingNewBatsman])

  useLayoutEffect(() => {
    if (isFirstInings === false) dispatch(  Update_UI_afterInnings({TotalOvers})  )
  }, [isFirstInings])

  const addBall = ({ runs = 0, type = "normal", extraType = null }) => {
    const ballObject = {
      matchId: id,
      inningsNumber: isFirstInings === null ? 0 : isFirstInings ? 1 : 2,
      over: over,
      ballInOver: ballsInOver,
      isLegalDelivery: !extraType || (extraType !== "wide" && extraType !== "noball"),
      strikerId: getBatsmanIdByRole(batsmen, "striker"),
      nonStrikerId: getBatsmanIdByRole(batsmen, "nonStriker"),
      bowlerId: currentBowler?.id,
      isWicket: type === "wicket",
      // `runs` are batsman runs only. Byes/leg byes count entirely as extras.
      //  Wides/no-balls automatically add 1 extra,
      //  while any additional runs entered are credited to the batsman.
      runs: extraType === "bye" || extraType === "legbye" ? 0 : runs,
      extraRuns:
        (extraType === "wide" || extraType === "noball" ? 1 : 0) ||
        (extraType === "bye" || extraType === "legbye" ? runs : 0),
      extraType,
    }
    dispatch(deliverBall(ballObject))
    dispatch(update_TotalRuns())
    dispatch(update_TotalWickets())
    dispatch(update_overAndBallInOver(ballObject?.isLegalDelivery))
    dispatch(update_CRRandRRR({TotalOvers}))
    dispatch(Update_Strike({ ballObject, lastPlayerPlayed }))
    dispatch(update_pendingPlayersFlag({ ballObject, TotalOvers }))
    dispatch(update_isDissmissedFlag(ballObject))
    dispatch(Update_innings({ ballObject, TotalOvers, lastPlayerPlayed }))
    dispatch(handelLastPlayer_isLastPlayerTrue({ ballObject, TotalOvers, lastPlayerPlayed }))

    setSelectedExtra(null)
  }

  // RUN BUTTONS

  // THIS OVER RUNS

  // const thisOverRuns = useMemo(() => {
  //   return matchState.recentBalls.reduce((acc, item) => {
  //     const parsed = parseInt(item)
  //     return isNaN(parsed) ? acc : acc + parsed
  //   }, 0)
  // }, [matchState.recentBalls])

  return (
    <>
      {showPopup && <PlayerSelectionModal />}

      <div className="min-h-screen bg-slate-50 pb-52">
        {/* HEADER */}

        <header className="sticky top-0 z-5 bg-primary text-white shadow-xl">
          <div className="px-4 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button className="mt-1">
                  <ArrowLeft className="size-5" />
                </button>

                <div>
                  <h1 className="text-xl font-bold">
                    {teamA.name} vs {teamB.name}
                  </h1>

                  <div className="mt-1 flex items-center gap-2">
                    <div className="size-2 rounded-full bg-red-500 animate-pulse" />

                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Live • {innings.isFirstInings === null ? "" : innings.isFirstInings ? "1" : "2"}st
                      Innings
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-bold opacity-70">
                  Target: {innings.isFirstInings === true || innings.isFirstInings === null ? 0 : target}
                </p>

                <div className="mt-1 flex gap-4 text-sm font-bold">
                  <p>
                    CRR <span className="text-green-300">{CRR}</span>
                  </p>

                  <p>
                    RRR{" "}
                    <span className="opacity-70">
                      {innings.isFirstInings === true || innings.isFirstInings === null ? "N/A" : RRR}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <h2 className="text-5xl font-black italic tracking-tight">
                {runs}/{wickets}
              </h2>

              <p className="pb-1 text-lg opacity-80">
                {over}.{ballsInOver} Overs
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
                This Over: {"thisOverRuns"} runs
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto justify-center">
              {/* {matchState.recentBalls.map((ball, index) => {
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
              })} */}
            </div>
          </section>

          {/* BATSMEN */}
          {[batsmenA, batsmenB].map((player) => {
            const stats = calBattingFiguers(player?.id, balls)
            return (
              <>
                <section
                  className={`overflow-hidden rounded-xl border bg-white shadow-sm ${player?.isStriker ? "border-primary shadow-2xl" : ""}`}
                >
                  <div className="bg-slate-50 px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 flex">
                    <span className="flex-1">{player?.isStriker ? "Striker" : "Non striker"}</span>
                    <span className="w-12 text-center">R</span>
                    <span className="w-12 text-center">B</span>
                    <span className="w-12 text-center">4</span>
                    <span className="w-12 text-center">6</span>
                    <span className="w-16 text-right">SR</span>
                  </div>

                  <div
                    key={`${player?.id}`}
                    className={`flex items-center px-4 py-4 border-t
    ${player?.isStriker ? "bg-primary/10" : "bg-white"}`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <span className={`font-bold ${player?.isStriker ? "text-primary" : "text-slate-700"}`}>
                        {player?.name}
                      </span>
                    </div>

                    <span className="w-12 text-center font-black">{stats?.runs || 0}</span>
                    <span className="w-12 text-center text-sm text-slate-500">{stats?.ballsPlayed || 0}</span>
                    <span className="w-12 text-center text-sm text-slate-500">{stats?.fours || 0}</span>
                    <span className="w-12 text-center text-sm text-slate-500">{stats?.sixes || 0}</span>
                    <span className="w-16 text-right text-sm font-bold">{stats?.strikeRate || 0}</span>
                  </div>
                </section>
              </>
            )
          })}

          {/* BOWLER */}
          {[currentBowler].map((bowler) => {
            const BowlingFiguers = calBowlingFiguers(bowler?.id, balls)
            return (
              <>
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
                      <h3 className="font-bold">{currentBowler?.name}</h3>

                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                        Fast • Over the wicket
                      </p>
                    </div>

                    <span className="w-12 text-center font-bold">{BowlingFiguers?.overs || 0}</span>

                    <span className="w-12 text-center">{0}</span>

                    <span className="w-12 text-center">{BowlingFiguers?.runs || 0}</span>

                    <span className="w-12 text-center font-black text-red-500">
                      {BowlingFiguers?.wickets || 0}
                    </span>

                    <span className="w-16 text-right font-bold text-primary">
                      {BowlingFiguers?.economy || 0}
                    </span>
                  </div>
                </section>
              </>
            )
          })}
        </main>

        {/* SCORING PANEL */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur-md p-4 shadow-2xl">
          {/* ACTIONS */}
          <div className="mb-3  grid grid-cols-6 gap-2">
            <button
              onClick={() =>
                addBall({
                  runs: 0,
                  type: "wicket",
                })
              }
              className="h-12 bg-[#FB2C36] rounded-xl  text-xs font-black text-white"
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
              onClick={() => setSelectedExtra("noball")}
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
    </>
  )
}

//  Utility Functions
function getBatsmanIdByRole(batsmen, role) {
  for (const key in batsmen) {
    const batsman = batsmen[key]

    if (role === "striker" && batsman.isStriker) return batsman.id
    if (role === "nonStriker" && !batsman.isStriker) return batsman.id
  }
}

function calBattingFiguers(PlayerId, matchBalls) {
  if (!PlayerId || !Array.isArray(matchBalls)) return

  const stats = {
    runs: 0,
    ballsPlayed: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0,
  }

  for (const ball of matchBalls) {
    if (ball.strikerId !== PlayerId) continue
    stats.runs += ball.runs
    if (ball.isLegalDelivery) stats.ballsPlayed++
    if (ball.runs === 4) stats.fours++
    else if (ball.runs === 6) stats.sixes++
  }
  stats.strikeRate = stats.ballsPlayed === 0 ? "0.00" : ((stats.runs / stats.ballsPlayed) * 100).toFixed(2)
  return stats
}

function calBowlingFiguers(bowlerId, matchBalls) {
  if (!bowlerId || !matchBalls) return
  if (!Array.isArray(matchBalls)) return

  let numberOfLegalBalls = 0
  let numberOfWickets = 0
  let runs = 0
  let maidenBalls = 0

  if (!bowlerId) return

  for (const ball of matchBalls) {
    if (ball.bowlerId !== bowlerId) continue

    const ballRuns =
      ball.extraType === "bye" || ball.extraType === "legbye" ? ball.runs : ball.runs + ball.extraRuns
    runs += ballRuns
    numberOfLegalBalls += ball.isLegalDelivery ? 1 : 0
    numberOfWickets += ball.isWicket ? 1 : 0
  }

  const economy = calculateEconomy(runs, numberOfLegalBalls)

  // overs bowled
  const overs = ballsToOvers(numberOfLegalBalls)

  return {
    overs,
    runs,
    wickets: numberOfWickets,
    economy,
  }
}

function ballsToOvers(balls) {
  const overs = Math.floor(balls / 6)
  const remainingBalls = balls % 6
  return `${overs}.${remainingBalls}`
}

function calculateEconomy(runsConceded, legalBalls) {
  if (legalBalls === 0) return 0
  return ((runsConceded * 6) / legalBalls).toFixed(2)
}

