import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wayPoints: [],
};

export const waypointsSlice = createSlice({
  name: "waypoints",
  initialState,
  reducers: {
    wayPoints: (state, action) => { 
      state.wayPoints = action.payload;
    },
  },
});

export const { wayPoints } = waypointsSlice.actions;

export default waypointsSlice.reducer;
