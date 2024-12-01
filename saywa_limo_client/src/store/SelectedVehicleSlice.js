import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    vehicle: ""
}

export const selectedVehicleSlice = createSlice({
    name: "selectedVehicle",
    initialState,
    reducers: {
        selectedVehicle: (state, action) => {
            state.vehicle = action.payload
        }
    }
})

export const { selectedVehicle } = selectedVehicleSlice.actions

export default selectedVehicleSlice.reducer