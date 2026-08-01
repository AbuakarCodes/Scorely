import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { connectDB } from "@/lib/db"

import Match from "@/Server/models/matchSchema.js"
import Ball from "@/Server/models/BallScheme.js"

import { ErrorResponse, SuccessResponse } from "@/Server/Response/response"

import { getBattingRankings, getBowlingRankings } from "./utils/utils"
export async function POST(req) {
  try {
    await connectDB()

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json(new ErrorResponse("Unauthorized"), {
        status: 401,
      })
    }

    const UserId = token?.id

    const body = await req.json()

    const { type } = body

    if (!type || !["batting", "bowling"].includes(type)) {
      return NextResponse.json(new ErrorResponse("Type must be either batting or bowling"), {
        status: 400,
      })
    }

    const matches = await Match.find({ UserId }).lean()

    if (matches.length === 0) {
      return NextResponse.json(ErrorResponse("No matches found"), { status: 404 })
    }

    const matchIds = matches.map((match) => match?.matchId)

    const balls = await Ball.find({
      matchId: {
        $in: matchIds,
      },
    }).lean()

    const playersMap = new Map()

    matches.forEach((match) => {
      match.teams?.forEach((team) => {
        team.players?.forEach((player) => {
          const id = String(player.playerId || player._id || player.id)

          if (!playersMap.has(id)) {
            playersMap.set(id, {
              ...player,
              _id: id,
            })
          }
        })
      })
    })

    const players = Array.from(playersMap.values())

    const data = type === "batting" ? getBattingRankings(balls, players) : getBowlingRankings(balls, players)

    return NextResponse.json(
      {
        success: true,
        message: `${type} rankings fetched successfully`,
        type,
        data,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    console.log("PLAYER RANKINGS ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch player rankings",
      },
      {
        status: 500,
      },
    )
  }
}
