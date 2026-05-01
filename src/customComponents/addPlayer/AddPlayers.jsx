import React, { useEffect } from "react"
import { PlayerCard } from "@/customComponents/addPlayer/playerCard"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlayers } from "@/utils/reduxSclices/playerSlice"

export function AddPlayers() {
  const dispatch = useDispatch()

  const { players, loading, error } = useSelector((state) => state.players)

  useEffect(() => {
    if (players.length === 0) dispatch(fetchPlayers())
  }, [])

  return (
    <>
      <section className="mt-6">
        <div className="px-4 flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">My players</h3>

          <Link href={"allPlayers"} className="text-primary text-sm font-semibold">
            View all
          </Link>
        </div>

        <div className="px-4 flex gap-x-4 ">
          <Link
            href="/RegesterPlayer"
            className="min-w-[160px]  flex flex-col items-center justify-center aspect-square border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 cursor-pointer"
          >
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined">group_add</span>
            </div>

            <p className="text-sm font-medium text-primary">Add Player</p>
          </Link>

          <div className=" w-full flex items-center-center overflow-x-auto no-scrollbar gap-x-1">
            {players.map((player) => (
              <Link
                key={player._id}
                href={`/players/${player._id}`} // dynamic route
                className="flex overflow-x-auto gap-x-1 shrink-0 border  "
              >
                <PlayerCard
                  variant="compact"
                  name={player.name}
                  role={player.role}
                  image={player.avatar || "https://res.cloudinary.com/dtrrzyutr/image/upload/fl_preserve_transparency/v1777660543/playres_default_profile_o205zq.jpg?_s=public-apps"}
                  onAction={() => {
                    console.log("add", player._id)
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
