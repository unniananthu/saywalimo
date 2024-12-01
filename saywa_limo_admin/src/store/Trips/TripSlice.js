import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TripOrderService from "./TripOrder";

const initialState = {
  tripData: [],
  newTripData: [],
  stepCount: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
  tabIndexState: 0,
  agreeStatus:""
};

export const newAdminiTrip = createAsyncThunk(
  "new-admin0-trip",
  async (tripdata, thunkapi) => {
    try {
      return TripOrderService.newTripAdmin(tripdata);
    } catch (error) {
      return thunkapi.rejectWithValue(error);
    }
  }
);

const getSingleOrder = createAsyncThunk(
  "trip/get-singleTrip",
  async (tripData, thunkAPI) => {
    try {
      return TripOrderService.getTrips(tripData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const updateDriver = createAsyncThunk(
  "trip/updateDriver",
  async (tripData, thunkAPI) => {
    try {
      return TripOrderService.assignDriver(tripData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const cancelTrip = createAsyncThunk(
  "trip/cancel",
  async (tripData, thunkAPI) => {
    try {
      return TripOrderService.cancelOrder(tripData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const SEND_STATUS = createAsyncThunk(
  "verified/rejected",
  async (tripData, thunkAPI) => {
    try {
      return TripOrderService.sendStatus(tripData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    changeTabIndexState: (state, action) => {
      state.tabIndexState = action.payload;
    },
    incStepCount: (state, action) => {
      state.stepCount = action.payload;
    },
    createTripState: (state, action) => {
      state.newTripData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getSingleOrder.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tripData = action.payload;
      })

      .addCase(updateDriver.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateDriver.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tripData = action.payload;
      })

      .addCase(cancelTrip.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(cancelTrip.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(cancelTrip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tripData = action.payload;
      })

      .addCase(newAdminiTrip.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(newAdminiTrip.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(newAdminiTrip.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // state.tripData = action.payload;
      })
      .addCase(SEND_STATUS.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(SEND_STATUS.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
      .addCase(SEND_STATUS.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.agreeStatus = action.payload;
      })
  },
});

export const { changeTabIndexState, incStepCount } = tripSlice.actions;
export default tripSlice.reducer;
