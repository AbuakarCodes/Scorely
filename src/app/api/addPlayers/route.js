
import { connectDB } from "@/lib/db"
import Player from "@/Server/models/PlayersSchema"
import { SuccessResponse, ErrorResponse } from "@/Server/Response/response"

// POST /api/player
export async function POST(req) {
  try {
    await connectDB()

    const body = await req.json()

    const { userId, name, jerseyNumber, role, teamId, avatar } = body

    // basic validation
    if (!userId || !name || !jerseyNumber || !role) {
      return Response.json(
        new ErrorResponse("Missing required fields"),
        { status: 400 }
      )
    }

    // build player object
    const playerData = {
      userId,
      name,
      jerseyNumber,
      role,
      avatar: avatar || "",
      isActive: false,
    }

    // only add teamId if it exists
    if (teamId) {
      playerData.teamId = teamId
    }

    const player = await Player.create(playerData) 
  
    return Response.json(
      new SuccessResponse("Player created successfully", player),
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return Response.json(
      new ErrorResponse("Server error while creating player"),
      { status: 500 }
    )
  }
}