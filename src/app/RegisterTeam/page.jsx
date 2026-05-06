"use client"

import axios from "axios"
import Link from "next/link"
import ImageUpload from "@/customComponents/BasicComponents/ImageUpload"
import { useMemo, useRef, useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useSelector, useDispatch } from "react-redux"
import { fetchPlayers, insertPlayer } from "@/utils/reduxSclices/playerSlice"
import { toast } from "sonner"
import { defaultImage } from "@/utils/Basic/constant"
import { PlayerCardSkeletonTeam } from "@/customComponents/loaders/playerCard_TeamOptionSkeleton"

export default function AddTeamForm() {
  const { players, loading: playersLoading } = useSelector((state) => state.players)
  const dispatch = useDispatch()

  const [preview, setPreview] = useState("")
  const avatarURL = useRef("")

  const [teamName, setTeamName] = useState("")
  const [search, setSearch] = useState("")
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [excludedPlayers, setExcludedPlayers] = useState([])

  const [loading, setLoading] = useState(false)
  const [errorField, setErrorField] = useState("")

  useEffect(() => {
    if (!players || players.length === 0) {
      dispatch(fetchPlayers())
    }
  }, [players, dispatch])

  const availablePlayers = useMemo(() => {
    return players.filter((p) => !p.teamId && !excludedPlayers.includes(p._id))
  }, [players, excludedPlayers])

  const filteredPlayers = useMemo(() => {
    return availablePlayers.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  }, [availablePlayers, search])

  const togglePlayer = (id) => {
    setSelectedPlayers((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      setErrorField("teamName")
      return
    }

    if (selectedPlayers.length === 0) {
      setErrorField("players")
      return
    }

    setErrorField("")
    setLoading(true)

    try {
      const payload = {
        name: teamName,
        avatar: avatarURL.current,
        players: selectedPlayers,
      }

      const res = await axios.post("/api/Team/createTeam", payload)

      dispatch(insertPlayer(res.data.data.players || []))

      setExcludedPlayers((prev) => [...prev, ...selectedPlayers])

      setPreview("")
      setTeamName("")
      setSelectedPlayers([])
      setSearch("")

      toast.success("Team created successfully")
    } catch (error) {
      console.log(error.message)
      toast.error("Failed to create team")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light flex justify-center">
      <div className="w-full max-w-2xl pb-28">
        <Header onSave={handleSubmit} loading={loading} />

        <div className="p-4 space-y-6">
          <Card className="p-6 flex justify-center">
            <ImageUpload preview={preview} setPreview={setPreview} avatarURL={avatarURL} />
          </Card>

          <Card className="p-4">
            <label className="text-sm font-semibold">Team Name</label>
            <Input
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value)
                if (e.target.value.trim()) setErrorField("")
              }}
              placeholder="e.g. Emerald Warriors"
              className={`mt-2 ${
                errorField === "teamName" ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
          </Card>

          <div>
            <h2 className="font-bold text-lg mb-3">
              Select Players
              {errorField === "players" && <span className="text-red-500 text-sm ml-2">(required)</span>}
            </h2>

            <Input
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />

            <div className="space-y-3">
              {playersLoading ? (
               <PlayerCardSkeletonTeam/>
              ) : (
                filteredPlayers.map((p) => (
                  <PlayerCard
                    key={p._id}
                    player={p}
                    isSelected={selectedPlayers.includes(p._id)}
                    onToggle={() => {
                      togglePlayer(p._id)
                      setErrorField("")
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <Footer selectedCount={selectedPlayers.length} onCreate={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}

function Header({ onSave, loading }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur border-b">
      <Link href="/">
        <ArrowLeft className="text-primary" />
      </Link>

      <h1 className="font-bold text-lg">Add New Team</h1>

      <Button onClick={onSave} disabled={loading} className="bg-primary text-white">
        {loading ? "Creating..." : "Save"}
      </Button>
    </div>
  )
}

function Footer({ selectedCount, onCreate, loading }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between max-w-2xl mx-auto">
      <div>
        <p className="text-xs text-muted-foreground">Selected</p>
        <p className="font-bold">{selectedCount} Players</p>
      </div>

      <Button onClick={onCreate} disabled={loading} className="bg-primary text-white px-8">
        {loading ? "Creating..." : "Create Team"}
      </Button>
    </div>
  )
}

function PlayerCard({ player, isSelected, onToggle }) {
  return (
    <Card
      onClick={onToggle}
      className="flex flex-row items-center p-3 border cursor-pointer hover:bg-muted/50 transition"
    >
      {/* Image */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
        <img src={player.avatar || defaultImage} alt={player.name} className="w-full h-full object-cover" />
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 ml-3">
        <span className="font-medium leading-tight">{player.name}</span>

        <span className="text-xs text-muted-foreground">{player.role}</span>

        {player.teamId && <span className="text-[10px] text-muted-foreground">In Team</span>}
      </div>

      {/* Radio */}
      <div className="ml-3 flex-shrink-0">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${isSelected ? "border-primary bg-primary" : "border-muted-foreground"}
          `}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
        </div>
      </div>
    </Card>
  )
}
