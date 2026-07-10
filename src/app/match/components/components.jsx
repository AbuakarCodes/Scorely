import { ArrowLeft } from "lucide-react"
import React from "react"

export default function RecentBalls({ balls = [], thisOverRuns = 0 }) {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* Header Info */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Recent Balls</p>

        <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
          This Over: {thisOverRuns} runs
        </p>
      </div>

      {/* Horizontal Scroll Ball Tracker */}
      <div className="flex no-scrollbar gap-2 overflow-x-auto justify-center">
        {balls.map((ball, index) => {
          // Parse string display outcome based on ball data characteristics
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
              className={`min-w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${
                  isWicket
                    ? "bg-red-500 text-white"
                    : isBoundary
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-700"
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

export function Header({
  teamA,
  teamB,
  innings,
  target,
  CRR,
  RRR,
  RL,
  runs,
  wickets,
  over,
  ballsInOver,
  onBack,
}) {
  return (

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

                <span className="text-sm font-bold flex gap-x-0.5 tracking-wider">
                  LIVE •
                  <span className="text-[#7BF1A8]">
                    {innings.isFirstInings === null ? "" : innings.isFirstInings ? "1st" : "2nd"}
                  </span>
                  INNINGS
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm uppercase font-bold">
              Target{" "}
              <span className="text-[#7BF1A8]">
                {innings.isFirstInings === true || innings.isFirstInings === null ? 0 : target}
              </span>
            </p>

            <div className="mt-1 flex gap-4 text-sm font-bold">
              <p>
                CRR <span className="text-green-300">{CRR}</span>
              </p>

              <p>
                RRR{" "}
                <span className="text-[#7BF1A8]">
                  {innings.isFirstInings === true || innings.isFirstInings === null ? 0 : RRR > 0 ? RRR : 0}
                </span>
              </p>

              <p>
                RL{" "}
                <span className="text-[#7BF1A8]">
                  {innings.isFirstInings === true || innings.isFirstInings === null ? 0 : RL > 0 ? RL : 0}
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
  )
}
