// utils/apiCalls/createPlayer.js

import axios from "axios"

export const RegesterPlayer_APIcall = async ({
  name,
  jersey,
  role,
  userId,
  avatarURL ,
  teamId = null,
}) => {



  try {
    // basic validation (frontend-level)
    if (!name || !jersey || !role || !userId) {
      throw new Error("Missing required fields")
    }

    const payload = {
      userId,
      name: name.trim(),
      jerseyNumber: Number(jersey),
      role,
      avatar: avatarURL || null,
    }

    // only include teamId if it exists
    if (teamId) {
      payload.teamId = teamId
    }

    const { data } = await axios.post("/api/Players/addPlayers", payload)

    return data
  } catch (error) {
    console.error("Create Player Error:", error?.response?.data || error.message)
    throw error
  }
}