"use client"

import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, Check, Search, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { fetchTeams } from "@/utils/reduxSclices/teamSlice"
import { useRouter } from "next/navigation"

import { fetchTeamPlayers, startInnings_fn, setMatch_id } from "@/utils/reduxSclices/matchSlice"
import PageLoader from "@/customComponents/loaders/pageLoader"
import { resetMatch } from "@/utils/reduxSclices/matchSlice"

export default function SelectTeamsPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { teams, loading, error } = useSelector((state) => state.teams)
  const { playersError, playersLoading } = useSelector((state) => state.match.Loading)

  useEffect(() => {
    if (teams.length === 0) dispatch(fetchTeams())
  }, [teams.length])

  const [search, setSearch] = useState("")
  const [selectedTeams, setSelectedTeams] = useState([])

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => team.name?.toLowerCase().includes(search.toLowerCase()))
  }, [teams, search])

  const toggleTeam = (teamId) => {
    const alreadySelected = selectedTeams.includes(teamId)

    // remove if already selected
    if (alreadySelected) {
      setSelectedTeams((prev) => prev.filter((id) => id !== teamId))
      return
    }

    // only keep 2 teams
    // if selecting 3rd team remove oldest selected team
    if (selectedTeams.length >= 2) {
      setSelectedTeams([selectedTeams[0], teamId])
      return
    }

    setSelectedTeams((prev) => [...prev, teamId])
  }

  const selectedCount = selectedTeams.length

  const getStatusText = () => {
    if (selectedCount === 0) return "Choose 2 Teams to Start"
    if (selectedCount === 1) return "Select One More Team"
    return "Ready to Proceed"
  }

  const handleProceed = async () => {
    if (selectedTeams.length !== 2) return

    // Reset Local storage othewise some flags and temas would be take from alrady started match
    const has_matchIn_LS = !!localStorage.getItem("match")
    if (has_matchIn_LS) {
      dispatch(resetMatch())
      dispatch(startInnings_fn())
      dispatch(setMatch_id(crypto.randomUUID()))
    }

    const selectedTeamsData = teams.filter((team) => selectedTeams.includes(team._id))

    await dispatch(
      fetchTeamPlayers({
        teamAId: selectedTeamsData[0]._id,
        teamBId: selectedTeamsData[1]._id,
      }),
    )

    router.push("/matchSetup")
  }

  return (
    <>
      {playersLoading && <PageLoader />}

      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky h-[5rem] top-0 z-50 border-b bg-background/95 backdrop-blur shrink-0">
          <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Button
                className={"text-black "}
                onClick={() => {
                  router.push("/")
                }}
              >
                <ArrowLeft className="size-5" />
              </Button>

              <h1 className="text-xl font-bold">Select Teams</h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-md px-4 pt-5 flex-1 flex flex-col overflow-hidden w-full">
          {/* Status */}
          <Card className="mb-6 border-none bg-primary  shadow-md  text-white shrink-0">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Selection Status</p>

                <p className="mt-1 text-lg font-bold">{getStatusText()}</p>
              </div>

              <div className="flex gap-2">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold",
                      item <= selectedCount
                        ? "border-white/40 bg-chart-4 text-white "
                        : "border-white/20 bg-white/10 text-white/50",
                    )}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Search */}
          <div className="relative mb-6 shrink-0">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10 "
            />
          </div>

          {/* Teams */}

          <div className="space-y-3  no-scrollbar scroll-smooth flex-1 overflow-y-auto pb-32">
            {loading ? (
              "teams Loading"
            ) : filteredTeams.length === 0 ? (
              <Card className="p-10 text-center">
                <p className="text-sm text-muted-foreground">No teams found</p>
              </Card>
            ) : (
              filteredTeams.map((team) => {
                const isSelected = selectedTeams.includes(team._id)

                return (
                  <Card
                    key={team._id}
                    onClick={() => toggleTeam(team._id)}
                    className={cn(
                      "cursor-pointer p-4 transition-all active:scale-[0.98]",
                      isSelected ? "border-2 border-chart-4" : "hover:border-primary/30",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Team Logo */}
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted">
                        {team?.avatar ? (
                          <img src={team?.avatar} alt={team?.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold">
                            {team?.name?.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Team Info */}
                      <div className="flex-1 overflow-hidden">
                        <h3 className="truncate font-bold">{team?.name || ""}</h3>

                        <p className="text-sm text-muted-foreground">{team?.playersCount || ""} Players</p>
                      </div>

                      {/* Checkbox */}
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                          isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/30",
                        )}
                      >
                        {isSelected && <Check className="size-4" />}
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </main>

        {/* Proceed Button */}
        <div className="  fixed bottom-6 left-0 right-0 z-40 px-4">
          <div className="mx-auto max-w-md">
            <Button
              onClick={handleProceed}
              disabled={selectedTeams.length !== 2}
              className="h-14 w-full text-whi rounded-2xl text-base font-bold"
            >
              Proceed to Match Setup
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
