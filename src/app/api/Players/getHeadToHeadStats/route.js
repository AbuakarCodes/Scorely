import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { connectDB } from "@/lib/db"

import Match from "@/Server/models/matchSchema.js"
import Ball from "@/Server/models/BallScheme.js"

import { ErrorResponse } from "@/Server/Response/response"



export async function POST(req) {
  try {
    await connectDB()

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.json(
        new ErrorResponse("Unauthorized"),
        {
          status: 401,
        }
      )
    }

    const UserId = token?.id

    const body = await req.json()

    const {
      playerId,
      opponentId,
    } = body

    if (!playerId || !opponentId) {
      return NextResponse.json(
        new ErrorResponse("Player ID and opponent ID are required"),
        {
          status: 400,
        }
      )
    }

    if (playerId === opponentId) {
      return NextResponse.json(
        new ErrorResponse("Player and opponent cannot be the same"),
        {
          status: 400,
        }
      )
    }

    const matches = await Match.find({
      UserId,
    }).select({
      matchId: 1,
      _id: 0,
    }).lean()

    const matchIds = matches.map(
      (match) => match.matchId
    )


    if (matchIds.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No matches found",
          playerId,
          opponentId,
          data: getPlayerHeadToHeadStats(
            [],
            playerId,
            opponentId
          ),
        },
        {
          status: 200,
        }
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

    const stats = getPlayerHeadToHeadStats(
      balls,
      playerId,
      opponentId
    )

    return NextResponse.json(
      {
        success: true,
        message: "Head-to-head stats fetched successfully",
        playerId,
        opponentId,
        data: stats,
      },
      {
        status: 200,
      }
    )

  } catch (error) {
    console.log(
      "HEAD TO HEAD STATS ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch head-to-head stats",
      },
      {
        status: 500,
      }
    )
  }
}



export function getPlayerHeadToHeadStats(balls, playerId, opponentId) {

    console.log({balls, playerId, opponentId});

  const defaultStats = {
    batting: {
      runs: 0,
      ballsFaced: 0,
      strikeRate: 0,
      average: 0,
      fours: 0,
      sixes: 0,
      dismissals: 0,
      dotBalls: 0,
      boundaryPercentage: 0,
      highestScore: "0",
    },
    bowling: {
      overs: "0.0",
      balls: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      bowlingStrikeRate: 0,
      average: 0,
      dotBalls: 0,
      foursConceded: 0,
      sixesConceded: 0,
      wides: 0,
      noBalls: 0,
      bestFigures: "0/0",
    },
  }

  if (!Array.isArray(balls) || !playerId || !opponentId) {
    return defaultStats
  }

  const battingBalls = balls.filter(
    (ball) =>
      ball.strikerId === playerId &&
      ball.bowlerId === opponentId
  )

  let battingRuns = 0
  let battingBallsFaced = 0
  let battingFours = 0
  let battingSixes = 0
  let battingDotBalls = 0
  let battingDismissals = 0

  const battingInningsMap = new Map()

  for (const ball of battingBalls) {
    const key = `${ball.matchId}-${ball.inningsNumber}`

    if (!battingInningsMap.has(key)) {
      battingInningsMap.set(key, {
        runs: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        dotBalls: 0,
        dismissed: false,
      })
    }

    const innings = battingInningsMap.get(key)
    const runs = ball.runs || 0

    innings.runs += runs
    battingRuns += runs

    const isBallFaced =
      ball.isLegalDelivery &&
      ball.extraType !== "bye" &&
      ball.extraType !== "legbye"

    if (isBallFaced) {
      innings.ballsFaced++
      battingBallsFaced++
    }

    if (isBallFaced && runs === 0) {
      innings.dotBalls++
      battingDotBalls++
    }

    if (runs === 4) {
      innings.fours++
      battingFours++
    }

    if (runs === 6) {
      innings.sixes++
      battingSixes++
    }

    if (ball.isWicket) {
      innings.dismissed = true
      battingDismissals++
    }
  }

  const battingInnings = Array.from(battingInningsMap.values())

  let highestScore = 0
  let highestScoreNotOut = false

  for (const innings of battingInnings) {
    if (innings.runs > highestScore) {
      highestScore = innings.runs
      highestScoreNotOut = !innings.dismissed
    }
  }

  const battingStrikeRate =
    battingBallsFaced > 0
      ? (battingRuns / battingBallsFaced) * 100
      : 0

  const battingAverage =
    battingDismissals > 0
      ? battingRuns / battingDismissals
      : battingRuns

  const boundaryRuns =
    battingFours * 4 +
    battingSixes * 6

  const boundaryPercentage =
    battingRuns > 0
      ? (boundaryRuns / battingRuns) * 100
      : 0

  const bowlingBalls = balls.filter(
    (ball) =>
      ball.bowlerId === playerId &&
      ball.strikerId === opponentId
  )

  let bowlingLegalBalls = 0
  let bowlingRunsConceded = 0
  let bowlingWickets = 0
  let bowlingDotBalls = 0
  let bowlingFours = 0
  let bowlingSixes = 0
  let bowlingWides = 0
  let bowlingNoBalls = 0

  const bowlingInningsMap = new Map()

  for (const ball of bowlingBalls) {
    const key = `${ball.matchId}-${ball.inningsNumber}`

    if (!bowlingInningsMap.has(key)) {
      bowlingInningsMap.set(key, {
        legalBalls: 0,
        runsConceded: 0,
        wickets: 0,
      })
    }

    const innings = bowlingInningsMap.get(key)
    const runs = ball.runs || 0
    const extraRuns = ball.extraRuns || 0

    if (ball.isLegalDelivery) {
      bowlingLegalBalls++
      innings.legalBalls++
    }

    const isBye =
      ball.extraType === "bye" ||
      ball.extraType === "legbye"

    if (!isBye) {
      const conceded = runs + extraRuns
      bowlingRunsConceded += conceded
      innings.runsConceded += conceded
    }

    if (ball.isWicket) {
      bowlingWickets++
      innings.wickets++
    }

    if (runs === 0 && extraRuns === 0) {
      bowlingDotBalls++
    }

    if (runs === 4) {
      bowlingFours++
    }

    if (runs === 6) {
      bowlingSixes++
    }

    if (ball.extraType === "wide") {
      bowlingWides += extraRuns
    }

    if (ball.extraType === "noball") {
      bowlingNoBalls++
    }
  }

  const completeOvers = Math.floor(bowlingLegalBalls / 6)
  const remainingBalls = bowlingLegalBalls % 6
  const overs = `${completeOvers}.${remainingBalls}`

  const decimalOvers = bowlingLegalBalls / 6

  const economy =
    decimalOvers > 0
      ? bowlingRunsConceded / decimalOvers
      : 0

  const bowlingAverage =
    bowlingWickets > 0
      ? bowlingRunsConceded / bowlingWickets
      : 0

  const bowlingStrikeRate =
    bowlingWickets > 0
      ? bowlingLegalBalls / bowlingWickets
      : 0

  let bestWickets = 0
  let bestRuns = Infinity

  for (const innings of bowlingInningsMap.values()) {
    if (
      innings.wickets > bestWickets ||
      (
        innings.wickets === bestWickets &&
        innings.wickets > 0 &&
        innings.runsConceded < bestRuns
      )
    ) {
      bestWickets = innings.wickets
      bestRuns = innings.runsConceded
    }
  }

  const bestFigures =
    bestWickets > 0
      ? `${bestWickets}/${bestRuns}`
      : "0/0"

  return {
    batting: {
      runs: battingRuns,
      ballsFaced: battingBallsFaced,
      strikeRate: Number(battingStrikeRate.toFixed(2)),
      average: Number(battingAverage.toFixed(2)),
      fours: battingFours,
      sixes: battingSixes,
      dismissals: battingDismissals,
      dotBalls: battingDotBalls,
      boundaryPercentage: Number(boundaryPercentage.toFixed(2)),
      highestScore: `${highestScore}${highestScoreNotOut ? "*" : ""}`,
    },

    bowling: {
      overs,
      balls: bowlingLegalBalls,
      runsConceded: bowlingRunsConceded,
      wickets: bowlingWickets,
      economy: Number(economy.toFixed(2)),
      bowlingStrikeRate: Number(bowlingStrikeRate.toFixed(2)),
      average: Number(bowlingAverage.toFixed(2)),
      dotBalls: bowlingDotBalls,
      foursConceded: bowlingFours,
      sixesConceded: bowlingSixes,
      wides: bowlingWides,
      noBalls: bowlingNoBalls,
      bestFigures,
    },
  }
}

