import { connectDB } from "@/lib/db"
import Player from "@/Server/models/PlayersSchema" 
import { SuccessResponse, ErrorResponse } from "@/Server/Response/response.js"

// PATCH /api/player/avatar
export async function PATCH(req) {
  try {
    await connectDB()

    const { player_id, avatar } = await req.json()

    if (!player_id || !avatar) {
      return Response.json(
        new ErrorResponse("player_id and avatar are required"),
        { status: 400 }
      )
    }

    // update by player_id
    const updated = await Player.findOneAndUpdate(
      { _id },                 // match
      { $set: { avatar } },       // update
      { new: true }               // return updated doc
    )

    if (!updated) {
      return Response.json(
        new ErrorResponse("Player not found"),
        { status: 404 }
      )
    }

    return Response.json(
      new SuccessResponse("Avatar updated", updated),
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return Response.json(
      new ErrorResponse("Server error"),
      { status: 500 }
    )
  }
}