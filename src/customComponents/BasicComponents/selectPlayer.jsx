"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function PlayerSelectionModal() {

     const { batsmen, bowler, innings } = useSelector((state) => state.match)
    


  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        onClick={() => {
          setShow(false)
          onClose?.()
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal */}
      <div
        className="
        z-10
          relative w-full max-w-lg
          bg-surface-container-lowest
          rounded-t-[1.5rem]
          sm:rounded-t-lg-[1rem]
          shadow-2xl
          max-h-[85vh]
          flex flex-col
          overflow-hidden
          bg-white

          animate-in slide-in-from-bottom
          duration-500
        "
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 rounded-full bg-surface-variant" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4">
          <h2 className="text-2xl font-bold text-primary">Select Player</h2>
          <p className="text-sm text-on-surface-variant">
            Assign next batter for Innings
          </p>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-6">
          {/* Card */}
          {players.map((p) => (
            <div
              key={p.id}
              className="
                flex items-center gap-4 p-4
                rounded-2xl
                bg-surface-container-low
                hover:bg-surface-container-high
                transition
                bg-[#F2F4F6]
              "
            >
              <img
                src={p.img}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-on-surface">
                  {p.name}
                </h3>
                <p className="text-xs text-secondary">{p.role}</p>

                <div className="flex gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-[10px] text-outline">AVG</p>
                    <p className="font-bold text-primary">{p.avg}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-outline">SR</p>
                    <p className="font-bold text-primary">{p.sr}</p>
                  </div>
                </div>
              </div>

              <Button
                className="
                  px-4 py-2 rounded-lg
                  bg-primary text-on-primary
                  text-xs font-bold
                  active:scale-95 transition
                "
              >
                Select
              </Button>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}

/* Dummy data (replace with API/store) */
const players = [
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "James Anderson",
    role: "Right-arm Fast",
    avg: 12.1,
    sr: 95.2,
    img: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Sarah Taylor",
    role: "Wicket Keeper Bat",
    avg: 38.4,
    sr: 128.5,
    img: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 1,
    name: "Alastair Cook",
    role: "Left-hand Bat",
    avg: 45.35,
    sr: 112.4,
    img: "https://i.pravatar.cc/100?img=1",
  },
]