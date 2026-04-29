import { configureStore } from "@reduxjs/toolkit"
import settingsSclice from "./utils/reduxSclices/settingsSclice"

export const store = configureStore({
  reducer: {
    settings: settingsSclice,
  },
})