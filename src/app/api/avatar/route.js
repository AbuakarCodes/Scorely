import { NextResponse } from "next/server"
import mongoose from "mongoose"

import User from "@/Server/models/user"
import Player from "@/Server/models/PlayersSchema"

import { SuccessResponse, ErrorResponse } from "@/Server/Response/response"

const models = {
  user: User,
  player: Player,
  // team: Team,
}

export async function PATCH(req) {
  try {
    const { id, imageUrl, model } = await req.json()
    

    if (!id || !model) {
      return NextResponse.json(
        new ErrorResponse("id, imageUrl, and model are required"),
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        new ErrorResponse("Invalid ID"),
        { status: 400 }
      )
    }

    const targetModel = models[model.toLowerCase()]

    if (!targetModel) {
      return NextResponse.json(
        new ErrorResponse("Invalid model type"),
        { status: 400 }
      )
    }

    const updated = await targetModel.findByIdAndUpdate(
      id,
      { avatar: imageUrl },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json(
        new ErrorResponse("Document not found"),
        { status: 404 }
      )
    }

    return NextResponse.json(
      new SuccessResponse("Avatar updated successfully", updated)
    )
  } catch (err) {
    return NextResponse.json(
      new ErrorResponse("Server error", err.message),
      { status: 500 }
    )
  }
}