import { configureStore } from "@reduxjs/toolkit"
import settingsSclice from "./utils/reduxSclices/settingsSclice"
import playerReducer from "./utils/reduxSclices/playerSlice"
export const store = configureStore({
  reducer: {
    settings: settingsSclice,
     players: playerReducer,
  },
})