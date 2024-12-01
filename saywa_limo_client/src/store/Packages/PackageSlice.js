import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PackageServices from "./PackagesService";

const initialState = {
  packagesList: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  singleItem: [],
};

export const getActivePackageSliceItem = createAsyncThunk(
  "get-active-package",
  async (thunkApi) => {
    try {
      return await PackageServices.getActivePackages();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getSinglePackageSliceItem = createAsyncThunk(
  "get-single-package",
  async (data, thunkApi) => {
    try {
      return await PackageServices.getSinglePackage(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const PackagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {},
  extraReducers: (builiders) =>
    builiders
      .addCase(getActivePackageSliceItem.pending, (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = true;
      })
      .addCase(getActivePackageSliceItem.rejected, (state) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
      })
      .addCase(getActivePackageSliceItem.fulfilled, (state, action) => {
        state.isError = false;
        state.isSuccess = true;
        state.isLoading = false;
        state.packagesList = action.payload;
      })
      .addCase(getSinglePackageSliceItem.pending, (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = true;
      })
      .addCase(getSinglePackageSliceItem.rejected, (state) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
      })
      .addCase(getSinglePackageSliceItem.fulfilled, (state, action) => {
        state.isError = false;
        state.isSuccess = true;
        state.isLoading = false;
        state.singleItem = action.payload;
      }),
});

export default PackagesSlice.reducer;
