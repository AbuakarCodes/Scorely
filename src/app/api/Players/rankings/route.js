import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { connectDB } from "@/lib/db"

import Match from "@/Server/models/matchSchema.js"
import Ball from "@/Server/models/BallScheme.js"
import Player from "@/Server/models/PlayersSchema"

import { ErrorResponse, SuccessResponse } from "@/Server/Response/response"
import { getplayesStats } from "./utils/utils"

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
      return NextResponse.json(new ErrorResponse("No matches found"), { status: 404 })
    }

    const matchIds = matches.map((match) => match?.matchId)

    const balls = await Ball.find({
      matchId: {
        $in: matchIds,
      },
    }).lean()

    // Get all the participents id
    const [strikerIds, nonStrikerIds, bowlerIds] = await Promise.all([
      Ball.distinct("strikerId", { matchId: { $in: matchIds } }),
      Ball.distinct("nonStrikerId", { matchId: { $in: matchIds } }),
      Ball.distinct("bowlerId", { matchId: { $in: matchIds } }),
    ])

    // Remove Dublications
    const playerIds = [...new Set([...strikerIds, ...nonStrikerIds, ...bowlerIds])]

    // filtering deleted players id's
    const validPlayers = (
      await Player.find(
        {
          _id: {
            $in: playerIds.filter(Boolean),
          },
          isDeleted: false,
        },
        {
          _id: 1,
          name: 1,
          avatar:1,
          role:1,
          currentTeam:1,
        },
      ).lean()
    ).map((P) => {
      return { ...P, _id: P._id.toString() }
    })



    const stats = getplayesStats(balls, validPlayers, type)

    return NextResponse.json(new SuccessResponse("All Players Stats", stats), { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(new ErrorResponse("internal Server Error"), { status: 500 })
  }
}



