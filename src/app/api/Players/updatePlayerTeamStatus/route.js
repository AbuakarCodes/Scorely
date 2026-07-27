import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Player from "@/Server/models/PlayersSchema"
import { SuccessResponse, ErrorResponse } from "@/Server/Response/response.js"

export async function POST(req) {
  try {
    await connectDB()

    const { playerId, teamId, action } = await req.json()

    if (!playerId || !action) {
      return NextResponse.json(new ErrorResponse("playerId and action are required"), { status: 400 })
    }

    if (!["add", "remove"].includes(action)) {
      return NextResponse.json(new ErrorResponse("Invalid action"), { status: 400 })
    }

    let update = {}

    if (action === "add") {
      if (!teamId) return NextResponse.json(new ErrorResponse("teamId is required"), { status: 400 })
      update.teamId = teamId
    }

    if (action === "remove") {
      update.teamId = ""
    }

    const player = await Player.findByIdAndUpdate(playerId, update, {
      new: true,
      runValidators: true,
    })

    if (!player) {
      return NextResponse.json(new ErrorResponse("Player not found"), { status: 404 })
    }

    return NextResponse.json(
      new SuccessResponse(`Player ${action === "add" ? "added to" : "removed from"} team`, player),
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(new ErrorResponse("Internal Server Error"), { status: 500 })
  }
}
