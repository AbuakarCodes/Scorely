import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { ErrorResponse, SuccessResponse } from "@/Server/Response/response"
import Team from "@/Server/models/TeamSchema"
import Player from "@/Server/models/PlayersSchema"
import { connectDB } from "@/lib/db"

export async function GET(req) {
  try {
    await connectDB()

    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    })

    if (!token?._id) {
      return NextResponse.json(
        new ErrorResponse("Unauthorized"),
        { status: 401 }
      )
    }

    const userId = token._id

    // 1. Fetch data
    const teams = await Team.find({ userId }).lean()
    const players = await Player.find({ userId }).lean()

    // 2. Build count object
    const countMap = {}

    players.forEach((player) => {
      if (!player.teamId) return

      const teamId = player.teamId.toString()

      countMap[teamId] = (countMap[teamId] || 0) + 1
    })

    // 3. Attach counts to teams
    const enrichedTeams = teams.map((team) => {
      const id = team._id.toString()

      return {
        ...team,
        playersCount: countMap[id] || 0,
      }
    })

    return NextResponse.json(
      new SuccessResponse("Teams fetched successfully", enrichedTeams),
      { status: 200 }
    )
  } catch (error) {
    console.log(error.message)

    return NextResponse.json(
      new ErrorResponse("Server error", error?.message),
      { status: 500 }
    )
  }
}