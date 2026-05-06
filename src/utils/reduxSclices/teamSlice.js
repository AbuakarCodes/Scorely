import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunk
export const fetchTeams = createAsyncThunk(
    "teams/fetchTeams",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/api/Team/getTeams")
            return res?.data?.data || []
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                err?.message ||
                "Failed to fetch teams"
            )
        }
    }
)

const initialState = {
    teams: [],
    loading: false,
    error: null,
}

const teamSlice = createSlice({
    name: "teams",
    initialState,

    reducers: {
        insertTeam: (state, action) => {
            if (!action.payload) return

            if (Array.isArray(action.payload)) {
                action.payload.forEach((team) => {
                    if (team && typeof team === "object") {
                        state.teams.push(team)
                    }
                })
            } else if (typeof action.payload === "object") {
                state.teams.push(action.payload)
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTeams.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.loading = false
                state.teams = action.payload
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Something went wrong"
            })
    },
})

export const { insertTeam } = teamSlice.actions
export default teamSlice.reducer