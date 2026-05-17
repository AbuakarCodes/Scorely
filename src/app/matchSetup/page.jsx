"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Edit, Play, Trophy, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation";

const dummyTeams = [
  {
    id: 1,
    name: "Team A",
    players: 11,
    image: "",
  },
  {
    id: 2,
    name: "Team B",
    players: 11,
    image: "",
  },
]

export default function MatchSetupPage() {
  // Later you can replace this with redux state
  // const teams = useSelector((state) => state.teams.selectedTeams)

  const teams = dummyTeams

  const [tossWinner, setTossWinner] = useState(teams[0].id)
  const [decision, setDecision] = useState("bat")

const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="relative w-full max-w-2xl border-x bg-background">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between p-4">
            <Button size="icon" variant="ghost" className="rounded-full">
              <ArrowLeft className="size-5" />
            </Button>

            <h1 className="text-lg font-bold">Match Setup</h1>

            <div className="w-9" />
          </div>

          {/* Progress */}
          <div className="px-4 pb-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Step 1: Match Details</p>

              <p className="text-xs text-muted-foreground">1 of 2</p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-primary/20">
              <div className="h-full w-1/2 bg-primary" />
            </div>

            <p className="mt-2 text-xs font-medium text-primary">Next: Scoreboard initialization</p>
          </div>
        </header>

        <main className="space-y-6 pb-32">
          {/* Teams */}
          <section className="p-4">
            <h2 className="mb-4 text-2xl font-bold">Select Teams</h2>

            <div className="grid grid-cols-2 gap-4">
              {teams.map((team) => (
                <Card key={team.id} className="overflow-hidden border-primary/10">
                  <div className="relative aspect-square">
                    <Image src={team.image} alt={team.name} fill className="object-cover" />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-lg font-bold text-white">{team.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-3 p-3">
                    <p className="text-xs font-medium text-primary">{team.players} Players Selected</p>

                    <Button variant="secondary" className="w-full">
                      Change Team
                    </Button>

                    <Button variant="outline" className="w-full gap-2 border-primary/20">
                      <Edit className="size-4" />
                      Edit Squad
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Toss */}
          <section className="space-y-6 px-4">
            {/* Toss Winner */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Who won the toss?</h2>

              <div className="flex gap-3">
                {teams.map((team) => {
                  const active = tossWinner === team.id

                  return (
                    <button
                      key={team.id}
                      onClick={() => setTossWinner(team.id)}
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

            {/* Decision */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Winner chose to...</h2>

              <div className="flex rounded-xl bg-primary/10 p-1">
                <button
                  onClick={() => setDecision("bat")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-bold transition-all ${
                    decision === "bat" ? "bg-primary text-white" : "text-primary"
                  }`}
                >
                  <Trophy className="size-4" />
                  Bat
                </button>

                <button
                  onClick={() => setDecision("bowl")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-bold transition-all ${
                    decision === "bowl" ? "bg-primary text-white" : "text-primary"
                  }`}
                >
                  <Shield className="size-4" />
                  Bowl
                </button>
              </div>
            </div>
          </section>

          {/* Match Settings */}
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
        </main>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 border-t bg-background p-4">
          <Button className="h-14 w-full gap-2 text-base font-bold" onClick={() => router.push("/test")}>
            Start Match
          </Button>
        </div>
      </div>
    </div>
  )
}
