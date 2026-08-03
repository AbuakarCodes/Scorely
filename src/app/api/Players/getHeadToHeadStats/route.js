import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { connectDB } from "@/lib/db"

import Match from "@/Server/models/matchSchema.js"
import Ball from "@/Server/models/BallScheme.js"

import { ErrorResponse, SuccessResponse } from "@/Server/Response/response"
import { getPlayerHeadToHeadStats } from "./utils/functions"

export async function POST(req) {
  try {
    await connectDB()

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.json(new ErrorResponse("Unauthorized"), {
        status: 401,
      })
    }

    const UserId = token?.id

    const body = await req.json()

    const { playerId, opponentId } = body

    if (!playerId || !opponentId) {
      return NextResponse.json(new ErrorResponse("Player ID and opponent ID are required"), {
        status: 400,
      })
    }

    if (playerId === opponentId) {
      return NextResponse.json(new ErrorResponse("Player and opponent cannot be the same"), {
        status: 400,
      })
    }

    const matches = await Match.find({
      UserId,
    })
      .select({
        matchId: 1,
        _id: 0,
      })
      .lean()

    const matchIds = matches.map((match) => match.matchId)

    if (matchIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No matches found",
          playerId,
          opponentId,
          data: getPlayerHeadToHeadStats([], playerId, opponentId),
        },
        {
          status: 200,
        },
      )
    }

    const balls = await Ball.find({
      matchId: {
        $in: matchIds,
      },
      $or: [
        {
          strikerId: playerId,
          bowlerId: opponentId,
        },
        {
          strikerId: opponentId,
          bowlerId: playerId,
        },
      ],
    }).lean()

    const stats = getPlayerHeadToHeadStats(balls, playerId, opponentId)

    return NextResponse.json(new SuccessResponse("Head-to-head stats fetched successfully", stats), {
      status: 200,
    })
  } catch (error) {
    console.log("HEAD TO HEAD STATS ERROR:", error)

    return NextResponse.json(new ErrorResponse("Failed to fetch head-to-head stats"), {status: 500})
  }
}

