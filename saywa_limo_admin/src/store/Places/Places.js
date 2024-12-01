import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [],
};

export const locationSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    location: (state, action) => {
      console.log("action:", action.payload);
      state.locations = action.payload;
    },
  },
});

export const { location } = locationSlice.actions;

export default locationSlice.reducer;
