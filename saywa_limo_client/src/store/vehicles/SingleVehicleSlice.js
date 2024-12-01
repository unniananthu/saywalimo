import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import vehicleService from "./VehicleService";

const initialState = {
  vehicles: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
};

export const getSingleVehicles = createAsyncThunk(
  "getSingle/vehicles",
  async (vehicleData, thunkAPI) => {
    try {
      return await vehicleService.getSingleVehicle(vehicleData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const singleVehicleSlice = createSlice({
  name: "singleVehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleVehicles.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.vehicles = [];
      })
      .addCase(getSingleVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.vehicles = action.payload;
      })
      .addCase(getSingleVehicles.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.vehicles = [];
      });
  },
});

export default singleVehicleSlice.reducer;
