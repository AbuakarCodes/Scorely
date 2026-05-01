import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  players: []
};

const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    addPlayer: (state, action) => {
      state.players.push(action.payload);
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    clearPlayers: (state) => {
      state.players = [];
    }
  }
});

export const { addPlayer, setPlayers, clearPlayers } = playersSlice.actions;
export default playersSlice.reducer;