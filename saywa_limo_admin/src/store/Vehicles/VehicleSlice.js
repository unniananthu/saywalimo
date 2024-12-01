import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import VehicleService from "./VehicleService";

const initialState = {
  allVehicleList: [],
  singleVehicle: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
};

export const getAllVehicles = createAsyncThunk(
  "get-all-vehicles",
  async (thunkApi) => {
    try {
      return VehicleService.allVehicles();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateBaseDistanceSliceItem = createAsyncThunk(
  "upate-base-distance-vehicles",
  async (data, thunkApi) => {
    try {
      return VehicleService.updateBaseDistance(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateBaseDistancePriceSliceItem = createAsyncThunk(
  "upate-base-distance-price-vehicles",
  async (data, thunkApi) => {
    try {
      return VehicleService.updatePriceDistance(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const updateBaseDistanceOrPriceSliceItem = createAsyncThunk(
  "upate-base-distance-or-price-vehicles",
  async (data, thunkApi) => {
    try {
      return VehicleService.updatePriceOrDistance(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const liveSearchVehicle = createAsyncThunk(
  "live-search-vehicle",
  async (data, thunkApi) => {
    try {
      return VehicleService.liveSearchVehicle(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const vehicleSlice = createSlice({
  name: "singleVehicles",
  initialState,
  reducers: {
    setSingleVehicle: (state, action) => {
      state.singleVehicle = action.payload;
    },
    setPackageVehicles: (state, action) => {
      state.allVehicleList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllVehicles.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllVehicles.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getAllVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allVehicleList = action.payload;
      })
      .addCase(updateBaseDistanceSliceItem.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateBaseDistanceSliceItem.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateBaseDistanceSliceItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allVehicleList = action.payload;
      })
      .addCase(updateBaseDistancePriceSliceItem.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateBaseDistancePriceSliceItem.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateBaseDistancePriceSliceItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allVehicleList = action.payload;
      })
      .addCase(updateBaseDistanceOrPriceSliceItem.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateBaseDistanceOrPriceSliceItem.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(
        updateBaseDistanceOrPriceSliceItem.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;
          state.allVehicleList = action.payload;
        }
      )
      .addCase(liveSearchVehicle.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(liveSearchVehicle.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(liveSearchVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allVehicleList = action.payload;
      });
  },
});

export const { setSingleVehicle, setPackageVehicles } = vehicleSlice.actions;
export default vehicleSlice.reducer;
