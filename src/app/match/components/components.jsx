import { batting_bowlingTeam } from "@/utils/reduxSclices/matchSlice"
import { ArrowLeft } from "lucide-react"
import React from "react"
import { useSelector } from "react-redux"

export default function RecentBalls({ balls = [], runsInOver = 0, over }) {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* Header Info */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Recent Balls</p>

        <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
          This Over: {runsInOver} runs
        </p>
      </div>

      <div className="flex no-scrollbar gap-2 overflow-x-auto justify-center">
        {balls
          .filter((b) => b.over === over)
          .map((ball, index) => {
            const display = ball.isWicket
              ? "W"
              : ball.extraType === "wide"
                ? `${ball.extraRuns}Wd`
                : ball.extraType === "noball"
                  ? `${ball.runs + ball.extraRuns}Nb`
                  : ball.extraType === "bye"
                    ? `${ball.extraRuns}B`
                    : ball.extraType === "legbye"
                      ? `${ball.extraRuns}Lb`
                      : ball.runs

            const isWicket = ball.isWicket
            const isBoundary = ball.runs === 4 || ball.runs === 6

            return (
              <div
                key={index}
                className={`min-w-8 h-8 rounded-full  flex items-center justify-center text-sm font-bold transition-colors
            ${
              isWicket
                ? "bg-red-500 border-red-600 text-white"
                : isBoundary
                  ? "bg-primary border-primary text-white"
                  : "bg-slate-100 border-slate-300 text-slate-700"
            }
          `}
              >
                {display}
              </div>
            )
          })}
      </div>
    </section>
  )
}

// export function Header({ teamA, teamB, innings, target, CRR, RRR, runsLeft, runs, wickets, over, ballsInOver }) {
//   return (
//     <header className="sticky top-0 z-5 bg-primary text-white shadow-xl">
//       <div className="px-4 py-5">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex items-start gap-3">
//             <button className="mt-1">
//               <ArrowLeft className="size-5" />
//             </button>

//             <div>
//               <h1 className="text-xl font-bold">
//                 {teamA.name} vs {teamB.name}
//               </h1>

//               <div className="mt-1 flex items-center gap-2">
//                 <div className="size-2 rounded-full bg-red-500 animate-pulse" />

//                 <span className="text-sm font-bold flex gap-x-0.5 tracking-wider">
//                   LIVE •
//                   <span className="text-[#7BF1A8]">
//                     {innings.isFirstInings === null ? "" : innings.isFirstInings ? "1st" : "2nd"}
//                   </span>
//                   INNINGS
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="text-right">
//             <p className="text-sm uppercase font-bold">
//               Target{" "}
//               <span className="text-[#7BF1A8]">
//                 {innings.isFirstInings === true || innings.isFirstInings === null ? 0 : target}
//               </span>
//             </p>

//             <div className="mt-1 flex gap-4 text-sm font-bold">
//               <p>
//                 CRR <span className="text-green-300">{CRR}</span>
//               </p>

//               <p>
//                 RRR{" "}
//                 <span className="text-[#7BF1A8]">
//                   {innings.isFirstInings === true || innings.isFirstInings === null ? 0 : RRR > 0 ? RRR : 0}
//                 </span>
//               </p>

//               <p>
//                 runsLeft{" "}
//                 <span className="text-[#7BF1A8]">
//                   {innings.isFirstInings === true || innings.isFirstInings === null ? 0 : runsLeft > 0 ? runsLeft : 0}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-5 flex items-end gap-3">
//           <h2 className="text-5xl font-black italic tracking-tight">
//             {runs}/{wickets}
//           </h2>

//           <p className="pb-1 text-lg opacity-80">
//             {over}.{ballsInOver} Overs
//           </p>
//         </div>
//       </div>
//     </header>
//   )
// }

// import { ArrowLeft } from "lucide-react"

// export function Header({
//   teamA,
//   teamB,
//   innings,
//   target,
//   CRR,
//   RRR,
//   runsLeft,
//   runs,
//   wickets,
//   over,
//   ballsInOver,
// }) {
//   const isFirstInnings = innings.isFirstInings === true || innings.isFirstInings === null

//   return (
//     <header className="sticky top-0 z-50 bg-primary text-white shadow-2xl px-5 pt-6 pb-4">
//       {/* Top Row: Teams & Target */}
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <button className="hover:bg-primary-foreground/10 p-1 rounded-full transition-colors">
//             <ArrowLeft className="size-5" />
//           </button>

//           <div>
//             <h1 className="font-bold text-lg leading-tight flex items-center gap-2">
//               {teamA.name}
//               <span className="text-[10px] bg-[#7BF1A8] text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
//                 Batting
//               </span>
//             </h1>

//             <p className="text-xs opacity-70 flex items-center gap-1.5 mt-0.5">
//               vs {teamB.name}
//               <span className="text-[10px] border border-primary-foreground/30 text-primary-foreground/70 px-1.5 py-0.5 rounded uppercase tracking-wider">
//                 Bowling
//               </span>
//             </p>
//           </div>
//         </div>

//         <div className="text-right">
//           <p className="text-[10px] font-bold uppercase tracking-widest text-[#7BF1A8]">
//             Target: {isFirstInnings ? 0 : target}
//           </p>
//           <p className="text-xs font-medium opacity-80 mt-0.5">
//             {isFirstInnings ? (
//               <>
//                 <span className="text-[#7BF1A8]">
//                   {innings.isFirstInings === null ? "" : "1st"}
//                 </span>{" "}
//                 Innings
//               </>
//             ) : (
//               `Need ${Math.max(target - runs, 0)} off ${Math.max(
//                 (20 - over) * 6 - ballsInOver,
//                 0
//               )}`
//             )}
//           </p>
//         </div>
//       </div>

//       {/* Score & Overs */}
//       <div className="flex items-end justify-between">
//         <div className="flex items-baseline gap-2">
//           <span className="text-5xl font-black italic tracking-tighter">
//             {runs}/{wickets}
//           </span>
//           <span className="text-lg font-medium opacity-80">
//             {over}.{ballsInOver}{" "}
//             <span className="text-xs uppercase tracking-widest opacity-60 ml-0.5">
//               Overs
//             </span>
//           </span>
//         </div>

//         <div className="flex flex-col items-end">
//           <div className="flex items-center gap-2 mb-1">
//             <span className="size-2 bg-red-500 rounded-full animate-pulse" />
//             <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">
//               LIVE
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Live Metrics Bar */}
//       <div className="mt-5 grid grid-cols-4 gap-2 border-t border-primary-foreground/10 pt-4">
//         <div className="text-center">
//           <p className="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">
//             CRR
//           </p>
//           <p className="text-sm font-black text-[#7BF1A8]">{CRR}</p>
//         </div>

//         <div className="text-center">
//           <p className="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">
//             RRR
//           </p>
//           <p className="text-sm font-black text-[#7BF1A8]">
//             {isFirstInnings ? 0 : RRR > 0 ? RRR : 0}
//           </p>
//         </div>

//         <div className="text-center">
//           <p className="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">
//             Target
//           </p>
//           <p className="text-sm font-black">{isFirstInnings ? 0 : target}</p>
//         </div>

//         <div className="text-center">
//           <p className="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">
//             runsLeft
//           </p>
//           <p className="text-sm font-black">
//             {isFirstInnings ? 0 : runsLeft > 0 ? runsLeft : 0}
//           </p>
//         </div>
//       </div>
//     </header>
//   )
// }

export function Header() {
  const { innings } = useSelector((state) => state?.match || {})
  const { teams, tossWinner, tossDecision } = useSelector((state) => state?.match?.match || {})
  const { teamA, teamB } = teams
  const { runs, wickets, over, ballsInOver, runsLeft, CRR, RRR, target } = innings?.score || {}

  const isFirstInnings = innings?.isFirstInings === true || innings?.isFirstInings === null
  
  const battingTeam = batting_bowlingTeam({
    team: teams,
    tossWinner,
    tossDecision,
    isFirstInings: innings?.isFirstInings,
  })?.battingTeam

  const topTeam = teamA?.id === battingTeam?.id ? teamA : teamB
  const bottomTeam = teamA?.id === battingTeam?.id ? teamB : teamA

  

  return (
    <header className="sticky top-0 z-5 bg-primary text-white shadow-2xl">
      {/* ---------- Desktop / large screens (md and up) ---------- */}
      <div className="hidden md:block px-4 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button className="mt-1">
              <ArrowLeft className="size-5" />
            </button>

            <div>
              <h1 className="text-xl font-bold">
                {teamA?.name || ""} vs {teamB?.name || ""}
              </h1>

              <div className="mt-1 flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500 animate-pulse" />

                <span className="text-sm font-bold flex gap-x-0.5 tracking-wider">
                  LIVE •
                  <span className="text-[#7BF1A8]">
                    {innings?.isFirstInings === null ? "" : innings?.isFirstInings ? "1st" : "2nd"}
                  </span>
                  INNINGS
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm uppercase font-bold">
              Target <span className="text-[#7BF1A8]">{isFirstInnings ? 0 : target}</span>
            </p>

            <div className="mt-1 flex gap-4 text-sm font-bold">
              <p>
                CRR <span className="text-green-300">{CRR}</span>
              </p>

              <p>
                RRR <span className="text-[#7BF1A8]">{isFirstInnings ? 0 : RRR > 0 ? RRR : 0}</span>
              </p>

              <p>
                runsLeft{" "}
                <span className="text-[#7BF1A8]">{isFirstInnings ? 0 : runsLeft > 0 ? runsLeft : 0}</span>
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

      {/* ---------- Mobile & tablet (below md) ---------- */}
      <div className="md:hidden px-5 pt-6 pb-4">
        {/* Top Row: Teams & Target */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <button className="hover:bg-primary-foreground/10 p-1 rounded-full transition-colors">
              <ArrowLeft className="size-5" />
            </button>

            <div>
              <h1 className="flex items-center gap-2 text-lg font-bold leading-tight">
                {topTeam?.name || ""}
                <span className="rounded bg-[#7BF1A8] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                  Batting
                </span>
              </h1>

              <p className="mt-0.5 flex items-center gap-1.5 text-xs opacity-70">
                vs {bottomTeam?.name || ""}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7BF1A8]">
              Target: {isFirstInnings ? 0 : target}
            </p>
            <p className="text-xs font-medium opacity-80 mt-0.5">
              {isFirstInnings ? (
                <>
                  <span className="text-[#7BF1A8]">{innings.isFirstInings === null ? "" : "1st"}</span>{" "}
                  Innings
                </>
              ) : (
                `Need ${Math.max(target - runs, 0)} off ${Math.max((20 - over) * 6 - ballsInOver, 0)}`
              )}
            </p>
          </div>
        </div>

        {/* Score & Overs */}
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black italic tracking-tighter">
              {runs}/{wickets}
            </span>
            <span className="text-lg font-medium opacity-80">
              {over}.{ballsInOver}{" "}
              <span className="text-xs uppercase tracking-widest opacity-60 ml-0.5">Overs</span>
            </span>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              {innings?.isFirstInings === null ? "" : innings?.isFirstInings ? "1st" : "2nd"} Innings{" "}
            </div>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="mt-5 grid grid-cols-4 gap-2 border-t border-primary-foreground/10 pt-4">
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">CRR</p>
            <p className="text-sm font-black text-[#7BF1A8]">{CRR}</p>
          </div>

          <div className="text-center">
            <p className="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">RRR</p>
            <p className="text-sm font-black text-[#7BF1A8]">{isFirstInnings ? 0 : RRR > 0 ? RRR : 0}</p>
          </div>

          <div className="text-center">
            <p className="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">Target</p>
            <p className="text-sm font-black">{isFirstInnings ? 0 : target}</p>
          </div>

          <div className="text-center">
            <p className="text-[9px] uppercase tracking-tighter opacity-60 font-bold mb-0.5">runsLeft</p>
            <p className="text-sm font-black">{isFirstInnings ? 0 : runsLeft > 0 ? runsLeft : 0}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
