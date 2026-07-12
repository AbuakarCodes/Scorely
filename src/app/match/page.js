"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, RotateCcw, Star, RefreshCcw, CloudCog } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import PlayerSelectionModal from "@/app/match/utils/selectPlayer"
import {
  batting_bowlingTeam,
  deliverBall,
  handelLastPlayer_isLastPlayerTrue,
  match_Decision,
  resetMatch,
  update_CRRandRRR,
  switchSides,
  update_isDissmissedFlag,
  update_overAndBallInOver,
  update_pendingPlayersFlag,
  Update_Strike,
  update_TotalRuns,
  update_TotalWickets,
  Undo,
} from "@/utils/reduxSclices/matchSlice"
import { extraButtons, runButtons } from "./utils/constants"
import MatchDecisionPopUP from "./utils/matchDecisionPopUP"
import RecentBalls, { Header } from "./components/components"
import { match_snapShot, removePrevBall_snapshot } from "./utils/snapShot"
import { GGGGGGG } from "@/TEST"
export default function LiveScoringPage() {
  const dispatch = useDispatch()

  const matchState = useSelector((state) => state.match)

  const { teams, tossWinner, tossDecision } = useSelector((state) => state.match.match)
  const { teamA, teamB } = teams

  const { batsmen, bowler, innings, id } = useSelector((state) => state.match)
  const { matchWinner } = useSelector((state) => state?.match?.match)
  const { batsmenA, batsmenB } = batsmen
  const { runs, wickets, over, ballsInOver, CRR, RRR, runsLeft, target } = innings?.score
  const { pendingNewBowler, pendingNewBatsman, balls, isFirstInings } = innings
  const { currentBowler } = bowler

  const { TotalOvers, lastPlayerPlayed } = useSelector((state) => state?.settings || 0)
  const [showPopup, setshowPopup] = useState({ playerSelection: false, matchDecision: false })
  const [selectedExtra, setSelectedExtra] = useState(null)

  useLayoutEffect(() => {
    const NumberOfBatters = getTeam({ teams, tossWinner, tossDecision, isFirstInings }, "bat").players.length
    dispatch(update_pendingPlayersFlag({ NumberOfBatters }))
  }, [])

  useLayoutEffect(() => {
    if (pendingNewBowler || pendingNewBatsman?.nonStriker || pendingNewBatsman?.striker)
      setshowPopup((prev) => ({ ...prev, playerSelection: true }))
    else if (!pendingNewBowler && !pendingNewBatsman?.nonStriker && !pendingNewBatsman?.striker)
      setshowPopup((prev) => ({ ...prev, playerSelection: false }))
  }, [pendingNewBowler, pendingNewBatsman])

  useEffect(() => {
    if (matchWinner.id) {
      setshowPopup((prev) => ({ ...prev, matchDecision: true }))
    }
  }, [matchWinner])

  

  const addBall = ({ runs = 0, type = "normal", extraType = null }) => {
    match_snapShot({ matchState })

    const ballObject = {
      matchId: id,
      ballId: crypto.randomUUID(),
      battingTeam: getTeam({ teams, tossWinner, tossDecision, isFirstInings }, "bat"),
      bowlingTeam: getTeam({ teams, tossWinner, tossDecision, isFirstInings }, "bowl"),
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

    dispatch(deliverBall({ ballObject }))
    dispatch(update_isDissmissedFlag(ballObject))
    dispatch(update_TotalRuns())
    dispatch(update_TotalWickets())
    dispatch(update_overAndBallInOver({ ballObject, TotalOvers }))
    dispatch(update_CRRandRRR({ TotalOvers }))
    dispatch(Update_Strike({ ballObject, lastPlayerPlayed }))
    dispatch(switchSides({ ballObject, TotalOvers, lastPlayerPlayed }))
    dispatch(update_pendingPlayersFlag({ ballObject, TotalOvers }))
    dispatch(handelLastPlayer_isLastPlayerTrue({ ballObject, TotalOvers, lastPlayerPlayed }))
    dispatch(match_Decision({ TotalOvers, ballObject, lastPlayerPlayed }))

    setSelectedExtra(null)

  }

  function unDo_handler() {
    // get the match state whic we got from snapShot
    // chnage the intire match state as it was befor the current ball
    // remove the current ball from snap shot as we always need previous ball so we can reflect previous ball
    if (balls.length === 0) return
    const prevBall_matchState = getPrevBallMatchState()
    dispatch(Undo(prevBall_matchState))
    removePrevBall_snapshot()
  }

  return (
    <>
      {showPopup.matchDecision && <MatchDecisionPopUP setshowPopup={setshowPopup} />}
      {showPopup.playerSelection && <PlayerSelectionModal />}

      <div className="min-h-screen bg-slate-50 pb-52">
        <Header
          teamA={teamA}
          teamB={teamB}
          innings={innings}
          target={target}
          CRR={CRR}
          RRR={RRR}
          RL={runsLeft}
          runs={runs}
          wickets={wickets}
          over={over}
          ballsInOver={ballsInOver}
        />

        {/* MAIN */}

        <main className="mx-auto max-w-4xl px-4 py-5 space-y-4">
          <RecentBalls balls={balls} thisOverRuns={0} />

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
              disabled={matchWinner?.id}
              onClick={() =>
                addBall({
                  runs: 0,
                  type: "wicket",
                })
              }
              className="h-12 disabled:opacity-50 bg-[#FB2C36] rounded-xl  text-xs font-black text-white"
            >
              WKT
            </button>

            {extraButtons.map((button) => (
              <button
                key={button.extraState}
                disabled={matchWinner?.id}
                onClick={() => setSelectedExtra(button.extraState)}
                className="h-12 disabled:opacity-50 rounded-xl border bg-white text-xs font-bold"
              >
                {button.label}
              </button>
            ))}

            <button
              onClick={(e) => { unDo_handler(e) }}
              disabled={matchWinner?.id}
              className="flex h-12 disabled:opacity-50 items-center justify-center rounded-xl bg-primary text-white"
            >
              <RotateCcw className="size-5" />
            </button>
          </div>

          {/* RUN BUTTONS */}
          <div className="grid grid-cols-6 gap-2">
            {runButtons.map((run) => (
              <button
                disabled={matchWinner?.id}
                key={run}
                onClick={() =>
                  addBall({
                    runs: run,
                    extraType: selectedExtra,
                  })
                }
                className={`
                disabled:opacity-50 h-14 rounded-xl text-2xl font-black transition active:scale-95
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

function getTeam({ teams, tossWinner, tossDecision, isFirstInings }, forceRole) {
  // forceRole its optional, undefined forceRole = "bat"
  if (!teams || !teams.teamA || !teams.teamB) return
  if (!tossWinner) return

  if (!tossDecision || !["bat", "bowl"].includes(tossDecision)) return

  if (typeof isFirstInings !== "boolean") return

  const result = batting_bowlingTeam({
    team: teams,
    tossWinner,
    tossDecision,
    isFirstInings,
  })

  if (!result?.battingTeam || !result?.bowlingTeam) return
  // Decide role (override OR computed)
  const role = forceRole || "bat"
  const selectedTeam = role === "bat" ? result.battingTeam : result.bowlingTeam

  return {
    id: selectedTeam?.id,
    name: selectedTeam?.name,
    players: selectedTeam?.players || []
  }
}

function getPrevBallMatchState() {
  const PrevBallMatchState = JSON.parse(localStorage.getItem("snapShot"))
  return PrevBallMatchState[PrevBallMatchState.length - 1]
}