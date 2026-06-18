"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Search, Trophy, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const players = [
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    number: 8,
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "James Anderson",
    role: "Right-arm Fast",
    avg: 12.1,
    sr: 95.2,
    number: 12,
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Sarah Taylor",
    role: "Wicket Keeper Bat",
    avg: 38.4,
    sr: 128.5,
    number: 4,
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Kevin Pietersen",
    role: "Right-hand Bat",
    avg: 47.28,
    sr: 145.2,
    image: "https://i.pravatar.cc/150?img=4",
  },
]

export default function PlayerSelectionModal({ open, onClose }) {
  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Wrapper */}
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
                w-full
                max-w-2xl
                bg-background
                rounded-t-[2rem]
                sm:rounded-3xl
                shadow-2xl
                flex
                flex-col
                max-h-[90vh]
                overflow-hidden
              "
          >
            <Notch></Notch>
            <Header></Header>
            <SearchPlayers></SearchPlayers>
            <PlayersList players={players}></PlayersList>
            <Footer></Footer>
          </motion.div>
        </motion.div>
      </>
    </AnimatePresence>
  )

  function PlayersList({ players }) {
    return (
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      bg-muted/40
                      p-4
                      transition-all
                      hover:bg-muted
                    "
          >
            <div className="relative">
              <img src={player.image} alt={player.name} className="h-14 w-14 rounded-full object-cover" />

              {player.number && (
                <div
                  className="
                            absolute
                            -bottom-1
                            -right-1
                            flex
                            h-5
                            w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-primary
                            text-[10px]
                            font-bold
                            text-white
                          "
                >
                  {player.number}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{player.name}</h3>

              <p className="text-xs text-muted-foreground">{player.role}</p>

              <div className="mt-2 flex gap-5">
                <div>
                  <p className="text-[10px] text-muted-foreground">AVG</p>

                  <p className="font-bold">{player.avg}</p>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground">SR</p>

                  <p className="font-bold">{player.sr}</p>
                </div>
              </div>
            </div>

            <Button className="bg-primary text-white hover:bg-primary/90">Select</Button>
          </div>
        ))}
      </div>
    )
  }

  function SearchPlayers() {
    return (
      <div className="space-y-4 px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or role..." className="pl-10" />
        </div>
      </div>
    )
  }

  function Header() {
    return (
      <div className="px-6 pb-4">
        <h2 className="text-2xl font-bold">Select Player</h2>

        <p className="mt-1 text-sm text-muted-foreground">Assigning next batter for Innings 1</p>
      </div>
    )
  }

  function Notch() {
    return (
      <div className="flex justify-center py-4">
        <div className="h-1.5 w-12 rounded-full bg-black/30" />
      </div>
    )
  }
}
function Footer() {
  return (
    <div className="flex items-center justify-between border-t px-6 py-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="text-sm">11 Players Available</span>
      </div>
    </div>
  )
}
