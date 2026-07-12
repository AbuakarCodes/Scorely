import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    darkMode: false,
    TotalOvers: 15,
    wicketsPerSide: 11,
    lastPlayerPlayed: true
}
export const settingSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {

        changeDefaultOvers: (state, action) => {
            if (action.payload >= 1 && action.payload <= 50) {
                state.TotalOvers = action.payload
            }
        },

        toggleLastPlayerPlayed: (state) => {
            state.lastPlayerPlayed = !state.lastPlayerPlayed
        },
    },
})

// Action creators are generated for each case reducer function
export const { toggleTheme, toggleLastPlayerPlayed } = settingSlice.actions

export default settingSlice.reducer