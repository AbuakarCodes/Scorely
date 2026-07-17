import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectDB } from "@/lib/db"
import Match from "@/Server/models/matchSchema.js"
import Ball from "@/Server/models/BallScheme.js"
import { ErrorResponse } from "@/Server/Response/response"
import { getToken } from "next-auth/jwt"

export async function POST(req) {
  const dbSession = await mongoose.startSession()
  try {
    await connectDB()

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) return Response.json(new ErrorResponse("Unauthorized"), { status: 401 })

    const UserId = token.id
    const body = await req.json()
    const { match, innings } = body

    // BASIC VALIDATION
    if (!match || !innings) return Response.json(new ErrorResponse("Invalid payload"), { status: 400 })
    if (!match.teams?.teamA?.id || !match.teams?.teamB?.id) {
      return Response.json(new ErrorResponse("Teams are required"), { status: 400 })
    }

    if (!match.tossWinner?.id || !match.tossDecision) {
      return NextResponse.json(
        {
          message: "Toss information missing",
        },
        {
          status: 400,
        },
      )
    }

    // CREATE MATCH ID

    const matchId = crypto.randomUUID()

    // PREPARE MATCH OBJECT

    const matchObject = {
      UserId,
      matchId,
      teamA: match.teams.teamA.id,
      teamB: match.teams.teamB.id,
      tossWinner: match.tossWinner.id,
      tossDecision: match.tossDecision,
      matchWinner: {
        id: match.matchWinner?.id || null,
        name: match.matchWinner?.name || null,
      },
      TotalOvers: match.TotalOvers || "0",
    }

    // PREPARE BALLS

    const balls = innings.balls || []
    const ballsObject = balls.map((ball) => {
      return {
        matchId,
        ballId: ball.ballId,
        battingTeamId: ball.battingTeam.id,
        bowlingTeamId: ball.bowlingTeam.id,
        inningsNumber: innings.isFirstInings ? 1 : 2,
        over: ball.over,
        ballInOver: ball.ballInOver,
        isLegalDelivery: ball.isLegalDelivery,
        strikerId: ball.strikerId,
        nonStrikerId: ball.nonStrikerId,
        bowlerId: ball.bowlerId,
        runs: ball.runs ?? 0,
        extraType: ball.extraType || null,
        extraRuns: ball.extraRuns ?? 0,
        isWicket: ball.isWicket ?? false,
      }
    })

    console.log(balls)

    // BALL VALIDATION

    for (const ball of ballsObject) {
      if (!ball.matchId) throw new Error("Ball missing matchId")
      if (ball.matchId !== matchId) throw new Error("Ball matchId mismatch")
      if (!ball.strikerId || !ball.bowlerId) throw new Error("Invalid player data in ball")
      if (typeof ball.runs !== "number") throw new Error("Invalid runs value")
      if (typeof ball.isLegalDelivery !== "boolean") throw new Error("Invalid delivery type")
    }


    // DATABASE TRANSACTION
    dbSession.startTransaction()

    await Match.create([matchObject], { session: dbSession })

    if (ballsObject.length > 0) {
      await Ball.insertMany(ballsObject, {
        session: dbSession,
      })
    }

    await dbSession.commitTransaction()

    dbSession.endSession()

    return NextResponse.json(
      {
        success: true,

        message: "Match created successfully",

        matchId,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction()
    }
    dbSession.endSession()

    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    )
  }
}
