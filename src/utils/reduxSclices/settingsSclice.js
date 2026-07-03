import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    darkMode: false,
    TotalOvers: 2,
    wicketsPerSide: 11,
    lastPlayerPlayed: true
}
export const settingSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            if (state.darkMode && document.body.classList.contains("dark")) {
                document.body.classList.remove("dark")
                state.darkMode = false
            }
            else if (!state.darkMode && !document.body.classList.contains("dark")) {
                document.body.classList.add("dark")
                state.darkMode = true
            } else {
                document.body.classList.add("dark")
                state.darkMode = true
            }
        },
        changeDefaultOvers: (state, action) => {
            if (action.payload <= 50) {
                state.defaultOvers = action.payload
            }
        },
        changeWicketsPerSide: (state, action) => {
            if (action.payload <= 11) {
                state.wicketsPerSide = action.payload
            }
        },


        toggleLastPlayerPlayed: (state) => {
            state.lastPlayerPlayed = !state.lastPlayerPlayed
        },
    },
})

// Action creators are generated for each case reducer function
export const { toggleTheme, changeDefaultOvers, changeWicketsPerSide, toggleLastPlayerPlayed } = settingSlice.actions

export default settingSlice.reducer