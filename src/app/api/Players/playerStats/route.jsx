import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { connectDB } from "@/lib/db"

import Match from "@/Server/models/matchSchema.js"
import Ball from "@/Server/models/BallScheme.js"
import Player from "@/Server/models/PlayersSchema.js"
import { SuccessResponse, ErrorResponse } from "@/Server/Response/response"

import { getPlayerBattingStats, getPlayerBowlingStats } from "./utils/functions"

export async function POST(req) {
  try {
    await connectDB()

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) return NextResponse.json(new ErrorResponse("Unauthorized"), { status: 401 })

    const userId = token.id
    const body = await req.json()
    const { playerId } = body

    if (!playerId) {
      return NextResponse.json(new ErrorResponse("Player ID is required"), {
        status: 400,
      })
    }

    // FIND PLAYER
    // Make sure:
    // 1. Player exists
    // 2. Player belongs to authenticated user
    // 3. Player is not deleted

    const player = await Player.findOne({
      _id: playerId,
      userId,
      isDeleted: false,
    }).select("-_id -userId -teamId -isDeleted: -updatedAt -createdAt")

    if (!player) {
      return NextResponse.json(new ErrorResponse("Player not found"), {
        status: 404,
      })
    }

    // FIND USER'S MATCHES
    const matches = await Match.find({
      UserId: userId,
    })
      .select({
        matchId: 1,
        _id: 0,
      })
      .lean()

    const matchIds = matches.map((match) => match.matchId)

    // NO MATCHES
    if (matchIds.length === 0) {
      const response = new SuccessResponse("Player stats fetched successfully", {
        player,
        batting: getPlayerBattingStats([], playerId),
        bowling: getPlayerBowlingStats([], playerId),
      })

      return NextResponse.json(response, {
        status: 200,
      })
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
    const response = new SuccessResponse("Player stats fetched successfully", {
      player,
      batting: battingStats,
      bowling: bowlingStats,
    })

    return NextResponse.json(response, {
      status: 200,
    })
  } catch (error) {
    console.error("GET PLAYER STATS ERROR:", error)

    return NextResponse.json(new ErrorResponse(error?.message || "Failed to fetch player stats"), {
      status: 500,
    })
  }
}
