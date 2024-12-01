import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import vehicleService from "./VehicleService";

const initialState = {
  vehicles: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
};

export const getVehicles = createAsyncThunk(
  "get/vehicles",
  async (thunkAPI) => {
    try {
      return await vehicleService.getVehicles();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVehicles.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getVehicles.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.vehicles = action.payload;
      });
  },
});

export default vehicleSlice.reducer;
