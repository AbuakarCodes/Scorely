import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { connectDB } from "@/lib/db"

import Team from "@/Server/models/TeamSchema.js"
import Player from "@/Server/models/PlayersSchema.js"
import Match from "@/Server/models/matchSchema.js"

import { ErrorResponse, SuccessResponse } from "@/Server/Response/response"

export async function POST(req) {
  try {
    await connectDB()

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.json(new ErrorResponse("Unauthorized"), { status: 401 })
    }

    const { teamId } = await req.json()

    if (!teamId) {
      return NextResponse.json(new ErrorResponse("Team Id is required"), { status: 400 })
    }

    const team = await Team.findOne({
      _id: teamId,
      userId: token.id,
    })

    if (!team) {
      return NextResponse.json(new ErrorResponse("Team not found"), { status: 404 })
    }

    const totalPlayers = await Player.find({
      teamId,
      isDeleted: false,
    })

    console.log(totalPlayers);

    const matchesPlayed = await Match.countDocuments({
      $or: [{ teamA: teamId }, { teamB: teamId }],
    })

    const matchesWon = await Match.countDocuments({
      "matchWinner.id": teamId,
    })

    const matchesLost = matchesPlayed - matchesWon

    const winningPercentage =
      matchesPlayed === 0 ? 0 : Number(((matchesWon / matchesPlayed) * 100).toFixed(2))

    return NextResponse.json(
      new SuccessResponse(
         "Team statistics fetched successfully",
        {
          teamId: team._id,
          teamName: team.name,
          teamAvatar: team.avatar,
          totalPlayers,
          matchesPlayed,
          matchesWon,
          matchesLost,
          winningPercentage,
        },
       
      ),
      { status: 200 },
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(new ErrorResponse(error.message), { status: 500 })
  }
}
