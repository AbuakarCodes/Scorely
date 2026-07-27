// features/players/playerSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { Satellite } from "lucide-react"

// Async thunk
export const fetchPlayers = createAsyncThunk("players/fetchPlayers", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/api/Players/getPlayers")
    return res?.data?.data || []
  } catch (err) {
    console.log(err.message)
    return rejectWithValue(err.response?.data?.message || err?.message || "Failed to fetch cards")
  }
})

export const deletePlayer = createAsyncThunk(
  "players/deletePlayer",
  async (playerId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch("/api/Players/flagDeleted", {
        playerId,
      })

      return {
        playerId,
        player: data.data,
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to delete player")
    }
  },
)

export const updatePlayerTeam = createAsyncThunk(
  "players/updatePlayerTeam",
  async ({ playerId, action, teamId = null }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/Players/updatePlayerTeamStatus", {
        playerId,
        action,
        teamId,
      })

      return data.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update player.")
    }
  },
)

const initialState = {
  players: [],
  loading: false,
  error: null,
  deletePlayer_Loading: false,
  deletePlayer_error: null,
  updatePlayerTeam_Loading: false,
  updatePlayerTeam_Error: false,
}

const playerSlice = createSlice({
  name: "players",
  initialState,

  reducers: {
    insertPlayer: (state, action) => {
      if (!action.payload) return

      if (Array.isArray(action.payload)) {
        action.payload.forEach((player) => {
          if (player && typeof player === "object") {
            state.players.push(player)
          }
        })
      } else if (typeof action.payload === "object") {
        state.players.push(action.payload)
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false
        state.players = action.payload
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Something went wrong"
      })

    // Delete Player
    builder
      .addCase(deletePlayer.pending, (state) => {
        state.deletePlayer_Loading = true
        state.deletePlayer_error = null
      })
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.deletePlayer_Loading = false

        // "playerId" comes from request object as builder have both
        // API returend value and data being sent in promise fullfilled
        const deletedPlayerIndex = state.players.findIndex((p) => p?._id === action.payload?.playerId)
        state.players.splice(deletedPlayerIndex, 1)
      })
      .addCase(deletePlayer.rejected, (state, action) => {
        state.deletePlayer_Loading = false
        state.deletePlayer_error = action.payload
      })

    // Update Player Team
    builder
      .addCase(updatePlayerTeam.pending, (state) => {
        state.updatePlayerTeam_Loading = true
      })
      .addCase(updatePlayerTeam.fulfilled, (state, action) => {
        state.updatePlayerTeam_Loading = false

        const index = state.players.findIndex((p) => p?._id === action.payload?._id)

        if (index !== -1) {
          state.players[index].teamId = action.payload.teamId
        }
      })
      .addCase(updatePlayerTeam.rejected, (state, action) => {
        state.updatePlayerTeam_Loading = false
        state.updatePlayerTeam_Error = action.payload
      })
  },
})

export const { insertPlayer } = playerSlice.actions
export default playerSlice.reducer
