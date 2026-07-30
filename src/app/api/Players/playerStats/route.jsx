import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { connectDB } from "@/lib/db"

import Match from "@/Server/models/matchSchema.js"
import Ball from "@/Server/models/BallScheme.js"

import { ErrorResponse } from "@/Server/Response/response"
import { getPlayerBattingStats, getPlayerBowlingStats } from "./utils/functions"
 
export async function POST(req) {
  try {
    // CONNECT DATABASE

    await connectDB()

    // AUTHENTICATION

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.json(new ErrorResponse("Unauthorized"), {
        status: 401,
      })
    }

    // USER ID

    const UserId = token.id

    // REQUEST BODY

    const body = await req.json()

    const { playerId } = body

    // BASIC VALIDATION

    if (!playerId) {
      return NextResponse.json(new ErrorResponse("Player ID is required"), {
        status: 400,
      })
    }

    // FIND USER'S MATCHES

    const matches = await Match.find({
      UserId,
    })
      .select({
        matchId: 1,
        _id: 0,
      })
      .lean()

    const matchIds = matches.map((match) => match.matchId)

    // NO MATCHES

    if (matchIds.length === 0) {
      return NextResponse.json(
        {
          success: true,

          message: "No matches found",

          playerId,

          batting: getPlayerBattingStats([], playerId),

          bowling: getPlayerBowlingStats([], playerId),
        },
        {
          status: 200,
        },
      )
    }

    // GET PLAYER BALLS
    //
    // Player can appear as:
    // 1. Striker
    // 2. Bowler

    const balls = await Ball.find({
      matchId: {
        $in: matchIds,
      },

      $or: [
        {
          strikerId: playerId,
        },
        {
          bowlerId: playerId,
        },
      ],
    }).lean()

    // CALCULATE BATTING STATS

    const battingStats = getPlayerBattingStats(balls, playerId)

    // CALCULATE BOWLING STATS

    const bowlingStats = getPlayerBowlingStats(balls, playerId)

    // RESPONSE

    return NextResponse.json(
      {
        success: true,

        message: "Player stats fetched successfully",

        playerId,

        batting: battingStats,

        bowling: bowlingStats,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    console.log("GET PLAYER STATS ERROR:", error)

    return NextResponse.json(
      {
        success: false,

        message: error?.message || "Failed to fetch player stats",
      },
      {
        status: 500,
      },
    )
  }
}
