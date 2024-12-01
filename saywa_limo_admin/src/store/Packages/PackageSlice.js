import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import packageService from "./PackagesService";

const initialState = {
  packageList: [],
  singlePackageItem: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
};
export const ALL_PACKAGE_SLICE_ITEM = createAsyncThunk(
  "get-packages",
  async (thunkApi) => {
    try {
      return await packageService.getAllPackages();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const NEW_PACKAGE_SLICE_ITEM = createAsyncThunk(
  "new-packages",
  async (data, thunkApi) => {
    try {
      return await packageService.newPackages(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const TOGGLE_PACKAGE_STATUS_SLICE_ITEM = createAsyncThunk(
  "toggle-status-packages",
  async (data, thunkApi) => {
    try {
      return await packageService.toggleStatus(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const GET_SINGLE_PACKAGE_SLICE_ITEM = createAsyncThunk(
  "get-single-packages",
  async (data, thunkApi) => {
    try {
      return await packageService.getSinglePackage(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const LIVE_SEARCH_PACKAGE_SLICE_ITEM = createAsyncThunk(
  "search-package",
  async (data, thunkApi) => {
    try {
      return await packageService.liveSearchPackage(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const DELETE_IMAGE_PACKAGE_SLICE_ITEM = createAsyncThunk(
  "delete-image-package",
  async (data, thunkApi) => {
    try {
      return await packageService.deleteImagePackage(data);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const packageSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(ALL_PACKAGE_SLICE_ITEM.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(ALL_PACKAGE_SLICE_ITEM.rejected, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(ALL_PACKAGE_SLICE_ITEM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.packageList = action.payload;
      })
      .addCase(NEW_PACKAGE_SLICE_ITEM.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(NEW_PACKAGE_SLICE_ITEM.rejected, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(NEW_PACKAGE_SLICE_ITEM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.packageList = action.payload;
      })
      .addCase(TOGGLE_PACKAGE_STATUS_SLICE_ITEM.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(TOGGLE_PACKAGE_STATUS_SLICE_ITEM.rejected, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(TOGGLE_PACKAGE_STATUS_SLICE_ITEM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.packageList = action.payload;
      })
      .addCase(GET_SINGLE_PACKAGE_SLICE_ITEM.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(GET_SINGLE_PACKAGE_SLICE_ITEM.rejected, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(GET_SINGLE_PACKAGE_SLICE_ITEM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.singlePackageItem = action.payload;
      })
      .addCase(LIVE_SEARCH_PACKAGE_SLICE_ITEM.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(LIVE_SEARCH_PACKAGE_SLICE_ITEM.rejected, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(LIVE_SEARCH_PACKAGE_SLICE_ITEM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.packageList = action.payload;
      })
      .addCase(DELETE_IMAGE_PACKAGE_SLICE_ITEM.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(DELETE_IMAGE_PACKAGE_SLICE_ITEM.rejected, (state) => {
        state.isLoading = true;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(DELETE_IMAGE_PACKAGE_SLICE_ITEM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.singlePackageItem = action.payload;
      });
  },
});
export default packageSlice.reducer;
