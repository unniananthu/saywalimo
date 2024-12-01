import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: 0,
};

export const activeStepSlice = createSlice({
  name: "ActiveStep",
  initialState,
  reducers: {
    activeStepx: (state, action) => {
      state.activeStep = action.payload;
    },
  },
});

export const { activeStepx } = activeStepSlice.actions;

export default activeStepSlice.reducer;
