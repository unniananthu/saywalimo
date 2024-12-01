import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "./OrderService";

const initialState = {
  orders: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
};

export const singleOrder = createAsyncThunk(
  "post/single-order",
  async (orderData, thunkAPI) => {
    try {
      return await orderService.singleOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const singleOrderSlice = createSlice({
  name: "singleOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(singleOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(singleOrder.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(singleOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.orders = action.payload;
      });
  },
});

export default singleOrderSlice.reducer;
