import { connectDB } from "@/lib/db"
import Player from "@/Server/models/PlayersSchema"
import { SuccessResponse, ErrorResponse } from "@/Server/Response/response"
import { getToken } from "next-auth/jwt"

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    })

    if (!token) {
      return Response.json(
        new ErrorResponse("Unauthorized"),
        { status: 401 }
      )
    }

    await connectDB()

    const body = await req.json()

    const { userId, name, role, teamId, avatar } = body
    console.log( { userId, name, role, teamId, avatar } )

    if (!userId || !name || !role) {
      return Response.json(
        new ErrorResponse("Missing required fields"),
        { status: 400 }
      )
    }

    const playerData = {
      userId,
      name,
      role,
      avatar: avatar || "",
      isActive: false,
    }

    if (teamId) {
      playerData.teamId = teamId
    }

    const player = await Player.create(playerData)

    return Response.json(
      new SuccessResponse("Player created successfully", player),
      { status: 201 }
    )
  } catch (error) {
    console.log(error?.message || "Server error while creating player")

    return Response.json(
      new ErrorResponse("Server error while creating player"),
      { status: 500 }
    )
  }
}