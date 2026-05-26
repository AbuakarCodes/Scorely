import { configureStore } from "@reduxjs/toolkit"
import settingsSclice from "./utils/reduxSclices/settingsSclice"
import playerReducer from "./utils/reduxSclices/playerSlice"
import teamReducer from "./utils/reduxSclices/teamSlice"
import matchSlice from "./utils/reduxSclices/matchSlice"
import { persistMatchMiddleware } from "./utils/Basic/match_LS_middlewere"
export const store = configureStore({
  reducer: {
    settings: settingsSclice,
     players: playerReducer,
     teams: teamReducer,
     match:matchSlice
  },
   middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(persistMatchMiddleware),
})