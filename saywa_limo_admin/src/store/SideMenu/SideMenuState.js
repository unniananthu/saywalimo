import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuState: false,
};

const toggleMenuStateSlice = createSlice({
  name: "toggle-menu-state",
  initialState,
  reducers: {
    toggleMenuState: (state, action) => {
      state.menuState = action.payload;
    },
  },
});

export const { toggleMenuState } = toggleMenuStateSlice.actions;
export default toggleMenuStateSlice.reducer;
