import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: [],
  toastStatus: false,
};

export const toastMessageSlice = createSlice({
  name: "toast_message",
  initialState,
  reducers: {
    toastMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { toastMessage } = toastMessageSlice.actions;

export default toastMessageSlice.reducer;
