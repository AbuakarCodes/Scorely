"use client"

import Image from "next/image"
import { ArrowLeft, Trophy, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"

import { tossWinner_fn, tossDecision_fn } from "@/utils/reduxSclices/matchSlice"
import { useEffect } from "react"

const image =
  "data:image/jpeg;base64,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"

export default function MatchSetupPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const { teams: reduxTeams, tossWinner, tossDecision } = useSelector((state) => state?.match?.match)
  const teams = [reduxTeams?.teamA, reduxTeams?.teamB]

  function tossWinner_handler(e, id, name) {
    if (!id || !name) return
    dispatch(tossWinner_fn({ id, name }))
  }

  function tossDecision_handler(e) {
    if (!["bat", "bowl"].includes(e.target?.name)) return
    dispatch(tossDecision_fn(e.target?.name))
  }

  useEffect(() => {
    if (teams[0]?.id && tossWinner.id == "") {
      const id = teams[0]?.id
      const name = teams[0]?.name
      dispatch(tossWinner_fn({ id, name }))
    }
  }, [])

  return (
    <>
      <div className="min-h-screen bg-background flex justify-center">
        <div className="relative w-full max-w-2xl border-x bg-background">
          <Header router={router}/>
          <main className="space-y-6 pb-32">
            <Teams teams={teams} />
            <section className="space-y-6 px-4">
              <TossWinner teams={teams} tossWinner_handler={tossWinner_handler} />
              <TossDecision tossDecision_handler={tossDecision_handler} />
            </section>
            <MatchSettings />
          </main>
          <StartMatchSection router={router} />
        </div>
      </div>
    </>
  )

  function TossDecision() {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Winner chose to...</h2>

        <div className="flex rounded-xl bg-primary/10 p-1">
          <button
            name="bat"
            onClick={(e) => tossDecision_handler(e)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-bold transition-all ${tossDecision === "bat" ? "bg-primary text-white" : "text-primary"}`}
          >
            <Trophy className="size-4" />
            Bat
          </button>

          <button
            name="bowl"
            onClick={(e) => tossDecision_handler(e)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-bold transition-all ${tossDecision === "bowl" ? "bg-primary text-white" : "text-primary"}`}
          >
            <Shield className="size-4" />
            Bowl
          </button>
        </div>
      </div>
    )
  }

  function TossWinner({ teams, tossWinner_handler }) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Who won the toss?</h2>

        <div className="flex gap-3">
          {teams.map((team, idx) => {
            const active = tossWinner.id === team.id

            return (
              <button
                key={team.id}
                onClick={(e) => tossWinner_handler(e, team?.id, team?.name)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 transition-all ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <div className={`size-2 rounded-full ${active ? "bg-primary" : "bg-muted"}`} />

                <span className="font-bold">{team.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  function MatchSettings() {
    return (
      <section className="px-4">
        <Card className="border-primary/10 bg-muted/40 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold">Match Settings</h3>

            <Button variant="link" className="h-auto p-0 text-xs">
              Edit Settings
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-muted-foreground">Overs</span>
            <span className="text-right font-medium">20 Overs</span>

            <span className="text-muted-foreground">Ball Type</span>
            <span className="text-right font-medium">Leather (Red)</span>

            <span className="text-muted-foreground">Pitch Type</span>
            <span className="text-right font-medium">Turf</span>
          </div>
        </Card>
      </section>
    )
  }
}

function Teams({ teams }) {
  return (
    <section className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Select Teams</h2>

      <div className="grid grid-cols-2 gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden border-primary/10">
            <div className="relative aspect-square">
              <Image src={team.image || image} alt={team.name} fill className="object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-3 left-3">
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
              </div>
            </div>

            <div className="space-y-3 p-3">
              <p className="text-xs font-medium text-primary">
                {team?.players?.length || "N/A"} Players Selected
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function StartMatchSection({ router }) {
  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 border-t bg-background p-4">
      <Button className="h-14 w-full gap-2 text-base font-bold" onClick={() => router.push("/test")}>
        Start Match
      </Button>
    </div>
  )
}

function Header({router}) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between p-4">
        <Button size="icon" variant="ghost" className="rounded-full">
          <Button
            onClick={() => {
              router.back()
            }}
          >
            <ArrowLeft className="size-5" />
          </Button>
        </Button>

        <h1 className="text-lg font-bold">Match Setup</h1>

        <div className="w-9" />
      </div>
    </header>
  )
}
