"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"


export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col text-slate-900 dark:text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-primary/10">

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw92vwsyi2zP3Gklgyf7-OCGfz7-2ODDCk_BP2uNknjvxrkKcIYfgkYaefbMzjPW-3HQWK2S3QEtuE72TLR06jqkCDPk8amkOhPaq2dhQPVRLrfnPfv4eDoCsJdbwzSJq3pyNfHtpO4PBTGPsPwmkdvX9n2PX1d--mpxipSP6x2bbKuVSSGvF5z3CQxymUWtjLhKUYxsJxGQH0SGauT2dlrOh2ZKuUpMGL0bcAIthgfIo6iHBGO6CznDnoEnaATj9x7tptB0GXR8E"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs text-primary font-medium uppercase tracking-wider">
              Good Morning
            </p>
            <h1 className="text-lg font-bold text-primary dark:text-emerald-400">
              Welcome, Rahul
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-primary/5 text-primary">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button className="p-2 rounded-full hover:bg-primary/5 text-primary">
            <Link href="/settings" className="material-symbols-outlined">settings</Link>
          </button>
        </div>

      </header>

      <main className="flex-1 overflow-y-auto pb-24">

        {/* Hero */}
        <section className="p-4">
          <Card className="relative overflow-hidden bg-primary text-white p-6 rounded-xl shadow-lg shadow-primary/20">

            <div className="absolute right-0 top-0 w-32 h-full bg-white/5 skew-x-12 translate-x-16"></div>

            <div className="relative z-10">

              <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">
                  sports_cricket
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-2">
                Ready for a game?
              </h2>

              <p className="text-emerald-50/80 mb-6 max-w-[240px]">
                Start a new match, record every ball, and track live statistics.
              </p>

              <Button className="w-full bg-white text-primary hover:bg-emerald-50 flex gap-2">
                <span className="material-symbols-outlined">
                  add_circle
                </span>
                Start New Match
              </Button>

            </div>

          </Card>
        </section>

        {/* Resume Match */}
        <section className="px-4 py-2">

          <Card className="p-4 flex items-center gap-4 border border-primary/10">

            <div className="relative">
              <div className="size-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">timer</span>
              </div>

              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-500 uppercase">
                  Live Now
                </span>
                <span className="text-slate-400 text-[10px]">•</span>
                <p className="text-xs text-slate-500">Overs</p>
              </div>
            </div>

            <Button variant="secondary">
              Resume
            </Button>

          </Card>

        </section>

        {/* Players */}
        <section className="mt-6">

          <div className="px-4 flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">
              My players
            </h3>

            <button className="text-primary text-sm font-semibold">
              View all
            </button>
          </div>

          <div className="px-4 flex gap-4 overflow-x-auto pb-2">

            <div className="min-w-[160px] flex flex-col items-center justify-center aspect-square border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 cursor-pointer">

              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined">
                  group_add
                </span>
              </div>

              <p className="text-sm font-medium text-primary">
                Add Player
              </p>

            </div>

          </div>

        </section>

        {/* Empty History */}
        <section className="mt-8 px-4">

          <Card className="flex flex-col items-center text-center p-8">

            <div className="size-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-5xl text-slate-300">
                history
              </span>
            </div>

            <h4 className="text-lg font-bold">
              No Recent Matches
            </h4>

            <p className="text-slate-500 text-sm mt-2 max-w-[220px]">
              Matches you score will appear here once they're completed.
            </p>

            <Button className="mt-6 bg-primary text-white">
              Start a match
            </Button>

          </Card>

        </section>

        {/* Stats */}
        {/* <section className="mt-8 px-4 mb-8">

          <h3 className="text-lg font-bold mb-4">
            Stats at a glance
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <Card className="bg-primary/5 p-4 border border-primary/5">
              <p className="text-xs font-medium text-primary uppercase mb-1">
                Matches Played
              </p>
              <p className="text-2xl font-bold text-primary">
                0
              </p>
            </Card>

            <Card className="bg-primary/5 p-4 border border-primary/5">
              <p className="text-xs font-medium text-primary uppercase mb-1">
                Total Players
              </p>
              <p className="text-2xl font-bold text-primary">
                0
              </p>
            </Card>

          </div>

        </section> */}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-lg border-t px-6 py-3 flex items-center justify-between">

        <a className="flex flex-col items-center text-primary">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </a>

        <a className="flex flex-col items-center text-slate-400 hover:text-primary">
          <span className="material-symbols-outlined">schedule</span>
          <span className="text-[10px]">Matches</span>
        </a>

        <div className="relative -top-8">
          <Button className="size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40">
            <span className="material-symbols-outlined text-3xl">
              add
            </span>
          </Button>
        </div>

        <a className="flex flex-col items-center text-slate-400 hover:text-primary">
          <span className="material-symbols-outlined">groups</span>
          <span className="text-[10px]">Players</span>
        </a>

        <a className="flex flex-col items-center text-slate-400 hover:text-primary">
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="text-[10px]">Stats</span>
        </a>

      </nav>

    </div>
  )
}