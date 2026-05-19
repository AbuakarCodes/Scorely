import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { ErrorResponse, SuccessResponse } from "@/Server/Response/response"
import Player from "@/Server/models/PlayersSchema"
import { connectDB } from "@/lib/db"

export async function GET(req) {
  try {
    await connectDB()

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.json(
        new ErrorResponse("Unauthorized"),
        { status: 401 }
      )
    }

    const userId = token.id

    const players = await Player.find({ userId })

    return NextResponse.json(
      new SuccessResponse("Players fetched successfully", players),
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