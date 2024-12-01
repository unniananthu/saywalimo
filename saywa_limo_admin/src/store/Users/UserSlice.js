import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserService from "./UserService";

const initialState = {
  customers: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export const getAllUsers = createAsyncThunk("get-users", async (thunkapi) => {
  try {
    return await UserService.getAllUsers();
  } catch (error) {
    return thunkapi.rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.customers = action.payload;
      });
  },
});

export default userSlice.reducer;
