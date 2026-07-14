import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    darkMode: false,
    TotalOvers: 15,
    wicketsPerSide: 11,
    lastPlayerPlayed: false
}
export const settingSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {

        changeTotaltOvers: (state, action) => {
            if (action.payload >= 1 && action.payload <= 50) {
                state.TotalOvers = action.payload
            }
        },

        changeWicketsPerSide: (state, action) => {
            if (action.payload <= 11) {
                state.wicketsPerSide = action.payload
            }
        },

        toggleLastPlayerPlayed: (state, action) => {
            const value = action.payload || {}
            if (typeof value != "boolean") return
            state.lastPlayerPlayed = value
        },
    },
})

// Action creators are generated for each case reducer function
export const { changeTotaltOvers, toggleLastPlayerPlayed } = settingSlice.actions

export default settingSlice.reducer