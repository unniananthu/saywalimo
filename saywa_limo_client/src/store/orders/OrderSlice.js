import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "./OrderService";

const initialState = {
  orders: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isCancelled: false,
};

export const newOrder = createAsyncThunk(
  "post/order",
  async (orderData, thunkAPI) => {
    try {
      return await orderService.newOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "post/order-get",
  async (orderData, thunkAPI) => {
    try {
      return await orderService.getOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "post/order-cancel",
  async (orderData, thunkAPI) => {
    try {
      return await orderService.canceltOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(newOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(newOrder.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(newOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })

      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getOrder.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })

      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(cancelOrder.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isCancelled = true;
        state.orders = action.payload;
      });
  },
});
export const { resetSuccess } = orderSlice.actions;
export default orderSlice.reducer;
