import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    locations: [],
}

export const locationSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
        location: (state, action) => {
            state.locations = action.payload
        }
    }
})

export const { location } = locationSlice.actions

export default locationSlice.reducer