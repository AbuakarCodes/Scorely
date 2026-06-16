"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { AddPlayers } from "@/customComponents/addPlayer/AddPlayers"
import { AddTeams } from "@/customComponents/addTeam/addTeam"
import PageLoader from "@/customComponents/loaders/pageLoader"
import { useDispatch, useSelector } from "react-redux"
import { startMatch } from "@/utils/reduxSclices/matchSlice"
import { X, History, Plus, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {

  const { data: session, status } = useSession()
  const [popup, setPopup] = useState({ visiable: null, startPrevMatch: null, matchDetails: {} })
  const { balls } = useSelector((state) => state.match.innings)
  const teams = useSelector((state) => state.match.match?.teams);
  const overs = useSelector((state) => state?.match?.innings?.score?.over || 0)

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (popup?.startPrevMatch === true) {
      router.push("/test")
    } else if (popup?.startPrevMatch === false) {
      router.push("/selectTeamToStartMatch")
    }
  }, [popup])


  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin")
  }, [status, router])

  function sratMatch_handler(e) {
    const has_matchIn_LS = !!localStorage.getItem("match")
    if (has_matchIn_LS && balls.length > 0) {

      setPopup((prev) => ({
        ...prev, visiable: true, matchDetails: matchDetails_setter(teams, overs)
      }));



      // const result = confirm("start previous match ?")
      // if (result) {
      // } else {
      //   // delete the prev matach data and start adding newone

      // }

      // showpopup
      // start prevmatch or new one
    } else {
      dispatch(startMatch(1))
      router.push("/selectTeamToStartMatch")
    }

    // dispatch(startMatch(1))
    //  router.push("/selectTeamToStartMatch")
  }

  return (
    <>
      {status === "loading" && <PageLoader />}
      {popup?.visiable && <StartScoringModal
        popup={popup}
        setPopup={setPopup}
      />}
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
                    🏏
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  Ready for a game?
                </h2>

                <p className="text-emerald-50/80 mb-6 max-w-[240px]">
                  Start a new match, record every ball, and track live statistics.
                </p>


              </div>

            </Card>
          </section>



          {/* Players */}
          <AddPlayers></AddPlayers>
          <AddTeams></AddTeams>



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
            <Button onClick={sratMatch_handler} className="size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40">
              add
              <Link href={"/selectTeamToStartMatch"} className="material-symbols-outlined text-3xl">
              </Link>
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
    </>
  )
}



function StartScoringModal({
  popup,
  setPopup,
}) {
  const handleClose = () => {
    setPopup({
      visiable: false,
      startPrevMatch: null,
      matchDetails: {},
    });

  };

  const handleResumeMatch = () => {
    setPopup((prev) => ({
      ...prev,
      startPrevMatch: true,
    }));
  };

  const handleStartNewMatch = () => {
    setPopup((prev) => ({
      ...prev,
      startPrevMatch: false,
    }));
  };

  return (
    <Dialog
      open={popup.visiable}
      onOpenChange={(open) => {
        // Clicking outside the popup or pressing Escape triggers this handler
        if (!open) handleClose();
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold">
              Start Scoring
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Resume Previous Match */}
            <button
              onClick={handleResumeMatch}
              className="group flex w-full items-center rounded-xl border bg-muted/40 p-4 text-left transition-all hover:bg-muted"
            >
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                <History className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1">
                <p className="font-semibold">
                  Resume Previous Match
                </p>

                {popup.matchDetails && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    <div> {popup?.matchDetails?.teamAName} <span className="text-red-500">VS</span> {popup?.matchDetails?.teamBName} </div>
                    <div>{popup?.matchDetails?.overs}</div>
                  </p>
                )}
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </button>

            {/* Start New Match */}
            <button
              onClick={handleStartNewMatch}
              className="group text-white flex w-full items-center rounded-xl bg-primary p-4 text-left  transition-all hover:opacity-90"
            >
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Plus className="h-5 w-5 " />
              </div>

              <div className="flex-1">
                <p className="font-bold">Start New Match</p>
                <p className="mt-1 text-sm opacity-80">
                  Configure fresh scorecard
                </p>
              </div>

              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="h-1 bg-primary" />
      </DialogContent>
    </Dialog>
  );
}


// Utility Functions
function matchDetails_setter(teams, overs) {
  if (!teams || typeof teams !== "object") return false;
  if (!teams.teamA?.name || !teams.teamB?.name) return false;

  if (typeof overs !== "number" || isNaN(overs)) return false;

  return {
    teamAName: teams.teamA.name,
    teamBName: teams.teamB.name,
    overs
  };
}