import React from "react"
import { PlayerCard } from "@/customComponents/addPlayer/playerCard"
import Link from "next/link"

export function AddPlayers() {
  return (
    <>
      <section className="mt-6">
        <div className="px-4 flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">My players</h3>

          <Link href={"allPlayers"} className="text-primary text-sm font-semibold">View all</Link>
        </div>

        <div className="px-4 flex gap-4 overflow-x-auto pb-2 ">
          <Link
            href="/RegesterPlayer"
            className="min-w-[160px]  flex flex-col items-center justify-center aspect-square border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 cursor-pointer"
          >
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined">group_add</span>
            </div>

            <p className="text-sm font-medium text-primary">Add Player</p>
          </Link>

          <Link href={"/abc"} className=" flex overflow-x-auto gap-x-1 no-scrollbar shadow-1xl ">
            <PlayerCard
              variant="compact"
              name="Virat K."
              role="Batsman"
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA4y8uQEdsIP9NEXlTFZ04GJrRUVTmcTkyWg&s"
              onAction={() => {
                console.log("add")
              }}
            />
          </Link>
        </div>
      </section>
    </>
  )
}
