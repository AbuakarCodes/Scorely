// app/api/match/delete/route.js

import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Player from "@/Server/models/PlayersSchema"
import { connectDB } from "@/lib/db"
import { ErrorResponse, SuccessResponse } from "@/Server/Response/response"

export async function PATCH(req) {
  try {
    await connectDB()

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) return Response.json(new ErrorResponse("Unauthorized"), { status: 401 })

    const { playerId } = await req.json()

    if (!playerId) {
      return NextResponse.json(new ErrorResponse("Player ID is required."), { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return NextResponse.json(new ErrorResponse("Invalid Player ID."), { status: 400 })
    }

    const player = await Player?.findById(playerId)

    if (!player) {
      return NextResponse.json(new ErrorResponse("Player not found."), { status: 404 })
    }

    if (player?.isDeleted) {
      return NextResponse.json(new ErrorResponse("Player is already deleted."), { status: 409 })
    }
    const deletedPlayer = await Player.findByIdAndUpdate(playerId, { isDeleted: true }, { new: true })

    return NextResponse.json(new SuccessResponse("Player deleted successfully.", deletedPlayer), {
      status: 200,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(new ErrorResponse("Internal server error."), { status: 500 })
  }
}
