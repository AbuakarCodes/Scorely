// features/players/playerSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk
export const fetchPlayers = createAsyncThunk(
  "players/fetchPlayers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/Players/getPlayers");
      return res?.data?.data || []
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err?.message || "Failed to fetch cards"
      );
    }
  }
);

const initialState = {
  players: [],
  loading: false,
  error: null,
};

const playerSlice = createSlice({
  name: "players",
  initialState,

  reducers: {

    insertPlayer: (state, action) => {
      if (!action.payload || typeof action.payload !== "object") return;
      state.players.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { insertPlayer } = playerSlice.actions
  ;
export default playerSlice.reducer;